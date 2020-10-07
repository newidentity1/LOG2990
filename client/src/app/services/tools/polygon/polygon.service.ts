import { Injectable } from '@angular/core';
import { ShapeTool } from '@app/classes/tool/shape-tool';
import { BasicShapeProperties } from '@app/classes/tools-properties/basic-shape-properties';
import { Vec2 } from '@app/classes/vec2';
import { DASHED_SEGMENTS, MINIMUM_THICKNESS } from '@app/constants/constants';
import { DrawingType } from '@app/enums/drawing-type.enum';
import { MouseButton } from '@app/enums/mouse-button.enum';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class PolygonService extends ShapeTool {
    pathStart: Vec2;
    width: number;
    height: number;
    currentMousePosition: Vec2;
    escapeDown: boolean = false;

    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.name = 'polygon';
        this.tooltip = 'Polygone(3)';
        this.iconName = 'change_history';
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
            this.computeDimensions(this.currentMousePosition);
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.draw(this.drawingService.baseCtx);
        }
        this.mouseDown = false;
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            this.currentMousePosition = this.getPositionFromMouse(event);
            this.computeDimensions(this.currentMousePosition);

            // On dessine sur le canvas de prévisualisation et on l'efface à chaque déplacement de la souris
            const previewCtx = this.drawingService.previewCtx;
            this.drawingService.clearCanvas(previewCtx);
            this.draw(previewCtx);
        }
    }

    onKeyDown(event: KeyboardEvent): void {
        this.escapeDown = event.key === 'Escape';
    }

    draw(ctx: CanvasRenderingContext2D): void {
        if (this.escapeDown) {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            return;
        }
        const radiusX = Math.abs(this.width / 2);
        const radiusY = Math.abs(this.height / 2);

        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        const polygonProperties = this.toolProperties as BasicShapeProperties;
        ctx.beginPath();
        ctx.moveTo(this.pathStart.x, this.pathStart.y - radiusY);

        const numberOfSides = 12;
        const startingAngle = Math.PI / 2;
        const angle = (2 * Math.PI) / numberOfSides;

        for (let i = 1; i < numberOfSides; ++i) {
            const currentAngle = i * angle + startingAngle;
            const pointX = this.pathStart.x + radiusX * Math.cos(currentAngle);
            const pointY = this.pathStart.y - radiusY * Math.sin(currentAngle);

            ctx.lineTo(pointX, pointY);
        }

        switch (polygonProperties.currentType) {
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

        if (ctx === this.drawingService.previewCtx) {
            this.drawEllipsePerimeter(ctx);
        }
    }

    drawEllipsePerimeter(ctx: CanvasRenderingContext2D): void {
        if (this.mouseDown) {
            ctx.lineWidth = MINIMUM_THICKNESS;
            ctx.setLineDash([DASHED_SEGMENTS]);
            const radius: Vec2 = { x: this.width / 2, y: this.height / 2 };

            ctx.beginPath();
            ctx.ellipse(this.pathStart.x, this.pathStart.y, Math.abs(radius.x), Math.abs(radius.y), 0, 0, 2 * Math.PI);
            ctx.stroke();
        }
    }

    computeDimensions(mousePosition: Vec2): void {
        this.width = mousePosition.x - this.pathStart.x;
        this.height = mousePosition.y - this.pathStart.y;
    }

    setThickness(value: number | null): void {
        value = value === null ? 1 : value;
        this.toolProperties.thickness = value;
        this.drawingService.setThickness(value);
    }

    setTypeDrawing(value: string): void {
        const rectangleProperties = this.toolProperties as BasicShapeProperties;
        rectangleProperties.currentType = value;
    }

    resetContext(): void {
        this.mouseDown = false;
        this.escapeDown = false;
        this.setThickness(this.toolProperties.thickness);
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
    }
}
