import { Injectable } from '@angular/core';
import { ShapeTool } from '@app/classes/tool/shape-tool';
import { BasicShapeProperties } from '@app/classes/tools-properties/basic-shape-properties';
import { Vec2 } from '@app/classes/vec2';
import { DrawingType } from '@app/enums/drawing-type.enum';
import { MouseButton } from '@app/enums/mouse-button.enum';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class RectangleService extends ShapeTool {
    startingX: number;
    startingY: number;
    currentMousePosition: Vec2;

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
            this.startingX = this.mouseDownCoord.x;
            this.startingY = this.mouseDownCoord.y;
            this.pathStart = this.mouseDownCoord;
        }
    }

    onMouseUp(): void {
        if (this.mouseDown) {
            this.computeDimensions(this.currentMousePosition);
            if (this.shiftDown) {
                const square = this.transformToSquare(this.width, this.height);
                this.width = square.x;
                this.height = square.y;
            }
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
        if (event.key === 'Shift') {
            this.shiftDown = true;
            this.draw(this.drawingService.previewCtx);
        }
    }

    onKeyUp(event: KeyboardEvent): void {
        if (event.key === 'Shift') {
            this.shiftDown = false;
            this.draw(this.drawingService.previewCtx);
        }
    }

    draw(ctx: CanvasRenderingContext2D): void {
        if (this.escapeDown) {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            return;
        }

        let width = this.width;
        let height = this.height;
        if (this.shiftDown) {
            const square: Vec2 = this.transformToSquare(width, height);
            width = square.x;
            height = square.y;
        }
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        const rectangleProperties = this.toolProperties as BasicShapeProperties;

        switch (rectangleProperties.currentType) {
            case DrawingType.Fill:
                this.drawFillRect(ctx, width, height);
                break;
            case DrawingType.Stroke:
                this.drawStrokeRect(ctx, width, height);
                break;
            case DrawingType.FillAndStroke:
                this.drawFillStrokeRect(ctx, width, height);
        }
    }

    transformToSquare(width: number, height: number): Vec2 {
        // already a square
        if (Math.abs(width) === Math.abs(height)) return { x: width, y: height };
        let squareWidth = Math.abs(this.isWidthSmallest() ? width : height);
        let squareHeight = squareWidth;

        if (width > 0) {
            if (height < 0) {
                // Quadrant2
                squareHeight = -squareHeight;
            }
        } else {
            squareWidth = -squareWidth;
            if (height < 0) {
                // Quadrant3
                squareHeight = -squareHeight;
            }
        }

        return { x: squareWidth, y: squareHeight };
    }

    computeDimensions(mousePosition: Vec2): void {
        this.width = mousePosition.x - this.pathStart.x;
        this.height = mousePosition.y - this.pathStart.y;
    }

    isWidthSmallest(): boolean {
        return Math.abs(this.width) < Math.abs(this.height);
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

    drawFillRect(ctx: CanvasRenderingContext2D, width: number, height: number): void {
        ctx.fillRect(this.pathStart.x, this.pathStart.y, width, height);
    }

    drawStrokeRect(ctx: CanvasRenderingContext2D, width: number, height: number): void {
        ctx.strokeRect(this.pathStart.x, this.pathStart.y, width, height);
    }

    drawFillStrokeRect(ctx: CanvasRenderingContext2D, width: number, height: number): void {
        this.drawFillRect(ctx, width, height);
        this.drawStrokeRect(ctx, width, height);
    }

    resetContext(): void {
        this.mouseDown = false;
        this.shiftDown = false;
        this.escapeDown = false;
        this.setThickness(this.toolProperties.thickness);
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
    }
}
