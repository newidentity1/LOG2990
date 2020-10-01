import { Injectable } from '@angular/core';
import { ShapeTool } from '@app/classes/shape-tool';
import { BasicShapeProperties } from '@app/classes/tools-properties/basic-shape-properties';
import { Vec2 } from '@app/classes/vec2';
import { DASHED_SEGMENTS, MINIMUM_THICKNESS } from '@app/constants/constants';
import { DrawingType } from '@app/enums/drawing-type.enum';
import { MouseButton } from '@app/enums/mouse-button.enum';
import { DrawingService } from '@app/services/drawing/drawing.service';

// Ceci est une implémentation de base de l'outil Crayon pour aider à débuter le projet
// L'implémentation ici ne couvre pas tous les critères d'accepetation du projet
// Vous êtes encouragés de modifier et compléter le code.
// N'oubliez pas de regarder les tests dans le fichier spec.ts aussi!
@Injectable({
    providedIn: 'root',
})
export class EllipseService extends ShapeTool {
    pathStart: Vec2;
    width: number;
    height: number;
    shiftDown: boolean = false;
    escapeDown: boolean = false;

    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.name = 'Ellipse';
        this.tooltip = 'Ellipse(2)';
        this.iconName = 'panorama_fish_eye';
        this.pathStart = { x: 0, y: 0 };
        this.mouseDownCoord = { x: 0, y: 0 };
        this.toolProperties = new BasicShapeProperties();
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        if (this.mouseDown) {
            this.escapeDown = false;
            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.pathStart = this.mouseDownCoord;
        }
    }

    onMouseUp(): void {
        if (this.mouseDown) {
            this.computeDimensions();
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.mouseDown = false;
            this.drawEllipse(this.drawingService.baseCtx);
        }
        this.mouseDown = false;
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.drawPreview();
        }
    }

    onKeyDown(event: KeyboardEvent): void {
        this.escapeDown = event.key === 'Escape';
        this.shiftDown = event.key === 'Shift';

        if (this.mouseDown) this.drawPreview();
    }

    onKeyUp(event: KeyboardEvent): void {
        this.shiftDown = event.key === 'Shift' ? false : this.shiftDown;
        if (this.mouseDown) this.drawPreview();
    }

    signOf(num: number): number {
        return Math.abs(num) / num;
    }

    transformToCircle(): void {
        const min = Math.min(Math.abs(this.width), Math.abs(this.height));
        this.width = min * this.signOf(this.width);
        this.height = min * this.signOf(this.height);
    }

    computeDimensions(): void {
        this.width = this.mouseDownCoord.x - this.pathStart.x;
        this.height = this.mouseDownCoord.y - this.pathStart.y;

        if (this.shiftDown) {
            this.transformToCircle();
        }
    }

    setThickness(value: number | null): void {
        value = value === null ? 1 : value;
        this.drawingService.setThickness(value);
        this.toolProperties.thickness = value;
    }

    setTypeDrawing(value: string): void {
        const ellipseProperties = this.toolProperties as BasicShapeProperties;
        ellipseProperties.currentType = value;
    }

    private drawPreview(): void {
        this.computeDimensions();
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.drawEllipse(this.drawingService.previewCtx);
    }

    private drawBoxGuide(ctx: CanvasRenderingContext2D): void {
        if (this.mouseDown) {
            ctx.lineWidth = MINIMUM_THICKNESS;

            ctx.setLineDash([DASHED_SEGMENTS]);
            ctx.beginPath();
            ctx.strokeRect(this.pathStart.x, this.pathStart.y, this.width, this.height);
            ctx.setLineDash([0]);
        }
    }

    adjustThickness(ellipseProperties: BasicShapeProperties, radius: Vec2): number {
        return ellipseProperties.currentType === DrawingType.Fill
            ? MINIMUM_THICKNESS
            : this.toolProperties.thickness < Math.min(Math.abs(radius.x), Math.abs(radius.y))
            ? this.toolProperties.thickness
            : Math.min(Math.abs(radius.x), Math.abs(radius.y));
    }

    /**
     * @description Draws the ellipse with the correct thickness and prioritizes
     * the dimensions of the guide perimeter (boxGuide) which follow the mouse
     * movements. When the thickness is too big for the ellipse to be drawn
     * inside the perimeter, the ctx.lineWidth is assigned to the half of the
     * smallest of its sides.
     */
    drawEllipse(ctx: CanvasRenderingContext2D): void {
        if (this.escapeDown) {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            return;
        }

        const radius: Vec2 = { x: this.width / 2, y: this.height / 2 };
        const ellipseProperties = this.toolProperties as BasicShapeProperties;
        const thickness = this.adjustThickness(ellipseProperties, radius);
        const dx = (thickness / 2) * this.signOf(this.width);
        const dy = (thickness / 2) * this.signOf(this.height);

        this.drawingService.setThickness(thickness);
        ctx.beginPath();
        ctx.ellipse(this.pathStart.x + radius.x, this.pathStart.y + radius.y, Math.abs(radius.x - dx), Math.abs(radius.y - dy), 0, 0, 2 * Math.PI);

        switch (ellipseProperties.currentType) {
            case DrawingType.Stroke:
                ctx.stroke();
                break;
            case DrawingType.Fill:
                ctx.fill();
                break;
            default:
                ctx.fill();
                ctx.stroke();
        }

        this.drawBoxGuide(ctx);
    }

    resetContext(): void {
        this.mouseDown = false;
        this.shiftDown = false;
        this.escapeDown = false;
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
    }
}
