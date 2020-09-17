import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';

// TODO : Déplacer ça dans un fichier séparé accessible par tous
export enum MouseButton {
    Left = 0,
    Middle = 1,
    Right = 2,
    Back = 3,
    Forward = 4,
}

@Injectable({
    providedIn: 'root',
})
export class RectangleService extends Tool {
    startingX: number;
    startingY: number;
    width: number;
    height: number;
    shiftDown: boolean = false;

    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.name = 'Rectangle';
        this.tooltip = 'Rectangle';
        this.iconName = 'crop_square';
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        if (this.mouseDown) {
            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.startingX = this.mouseDownCoord.x;
            this.startingY = this.mouseDownCoord.y;
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.computeDimensions(mousePosition);
            if (this.shiftDown) {
                const square = this.transformToSquare(this.width, this.height);
                this.width = square.x;
                this.height = square.y;
            }
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawFillRect(this.drawingService.baseCtx, this.width, this.height);
        }
        this.mouseDown = false;
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.computeDimensions(mousePosition);

            // On dessine sur le canvas de prévisualisation et on l'efface à chaque déplacement de la souris
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawPreview();
        }
    }

    onKeyDown(event: KeyboardEvent): void {
        if (event.key === 'Shift') {
            this.shiftDown = true;
            this.drawPreview();
        }
    }

    onKeyUp(event: KeyboardEvent): void {
        if (event.key === 'Shift') {
            this.shiftDown = false;
            this.drawPreview();
        }
    }

    private drawPreview(): void {
        let previewWidth = this.width;
        let previewHeight = this.height;
        if (this.shiftDown) {
            const square: Vec2 = this.transformToSquare(previewWidth, previewHeight);
            previewWidth = square.x;
            previewHeight = square.y;
        }
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.drawFillRect(this.drawingService.previewCtx, previewWidth, previewHeight);
        this.drawStrokeRect(this.drawingService.previewCtx, previewWidth, previewHeight);
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
        this.width = mousePosition.x - this.startingX;
        this.height = mousePosition.y - this.startingY;
    }

    isWidthSmallest(): boolean {
        return Math.abs(this.width) < Math.abs(this.height);
    }

    private drawFillRect(ctx: CanvasRenderingContext2D, width: number, height: number): void {
        ctx.fillRect(this.startingX, this.startingY, width, height);
    }

    private drawStrokeRect(ctx: CanvasRenderingContext2D, width: number, height: number): void {
        ctx.strokeRect(this.startingX, this.startingY, width, height);
    }
}
