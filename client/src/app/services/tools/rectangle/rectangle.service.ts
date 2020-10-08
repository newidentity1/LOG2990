import { Injectable } from '@angular/core';
import { ShapeTool } from '@app/classes/tool/shape-tool';
import { BasicShapeProperties } from '@app/classes/tools-properties/basic-shape-properties';
import { DrawingType } from '@app/enums/drawing-type.enum';
import { MouseButton } from '@app/enums/mouse-button.enum';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class RectangleService extends ShapeTool {
    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.name = 'Rectangle';
        this.tooltip = 'Rectangle(1)';
        this.iconName = 'crop_square';
        this.pathStart = { x: 0, y: 0 };
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
            this.draw(this.drawingService.baseCtx);
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
        this.draw(this.drawingService.previewCtx);
    }

    /**
     * @description Draws the rectangle with the correct thickness and prioritizes
     * the dimensions of the guide perimeter (boxGuide) which follow the mouse
     * movements. When the thickness is too big for the rectangle to be drawn
     * inside the perimeter, the ctx.lineWidth is assigned to the half of the
     * smallest of its sides.
     */
    draw(ctx: CanvasRenderingContext2D): void {
        if (this.escapeDown) {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            return;
        }

        const rectangleProperties = this.toolProperties as BasicShapeProperties;
        this.adjustThickness();

        ctx.beginPath();
        ctx.rect(this.pathStart.x + this.dx, this.pathStart.y + this.dy, this.radius.x * 2, this.radius.y * 2);

        switch (rectangleProperties.currentType) {
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
    }
}
