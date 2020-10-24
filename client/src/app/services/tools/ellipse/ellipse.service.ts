import { Injectable } from '@angular/core';
import { ShapeTool } from '@app/classes/tool/shape-tool';
import { BasicShapeProperties } from '@app/classes/tools-properties/basic-shape-properties';
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
    dashedSegments: number;

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

    onMouseUp(): ShapeTool | undefined {
        let tool: ShapeTool | undefined;
        if (this.mouseDown) {
            this.computeDimensions();
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.mouseDown = false;
            this.dashedSegments = DASHED_SEGMENTS;
            this.draw(this.drawingService.baseCtx);
            tool = this;
        }
        this.mouseDown = false;

        return tool;
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

    private drawPreview(): void {
        this.computeDimensions();
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.dashedSegments = DASHED_SEGMENTS;
        this.draw(this.drawingService.previewCtx);
    }

    private drawBoxGuide(ctx: CanvasRenderingContext2D): void {
        if (this.mouseDown) {
            ctx.lineWidth = MINIMUM_THICKNESS;
            ctx.setLineDash([this.dashedSegments]);
            ctx.beginPath();
            ctx.strokeRect(this.pathStart.x, this.pathStart.y, this.mouseDownCoord.x - this.pathStart.x, this.mouseDownCoord.y - this.pathStart.y);
            ctx.setLineDash([0]);
        }
    }

    /**
     * @description Draws the ellipse with the correct thickness and prioritizes
     * the dimensions of the guide perimeter (boxGuide) which follow the mouse
     * movements. When the thickness is too big for the ellipse to be drawn
     * inside the perimeter, the ctx.lineWidth is assigned to the half of the
     * smallest of its sides.
     */
    draw(ctx: CanvasRenderingContext2D): void {
        if (this.escapeDown) {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            return;
        }

        const ellipseProperties = this.toolProperties as BasicShapeProperties;
        this.adjustThickness();

        ctx.beginPath();
        ctx.ellipse(
            this.pathStart.x + this.width / 2,
            this.pathStart.y + this.height / 2,
            Math.abs(this.radius.x),
            Math.abs(this.radius.y),
            0,
            0,
            2 * Math.PI,
        );

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
}
