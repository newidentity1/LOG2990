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
                this.width = this.isWidthSmallest() ? this.width : this.height;
                this.height = this.width;
            }
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawFillRect(this.drawingService.baseCtx);
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
        let isWidthSmallest: boolean | undefined;
        if (this.shiftDown) {
            isWidthSmallest = this.isWidthSmallest() ? true : false;
        }

        if (typeof isWidthSmallest === 'boolean') {
            this.drawingService.previewCtx.fillStyle = 'white';
        }

        this.drawFillRect(this.drawingService.previewCtx);
        this.drawStrokeRect(this.drawingService.previewCtx);
        if (typeof isWidthSmallest === 'boolean') {
            this.drawingService.previewCtx.fillStyle = 'black';
            let squareWidth;
            let squareHeight;
            const canvasMaxX = this.drawingService.canvas.width;
            const canvasMaxY = this.drawingService.canvas.height;

            if (isWidthSmallest) {
                squareWidth = squareHeight = this.width;
                // check if the square is gonna be out of bounds
                if (this.width + this.startingX < 0 || this.width + this.startingX > canvasMaxX) squareWidth = -this.width;

                if (this.width + this.startingY < 0 || this.width + this.startingY > canvasMaxY) squareHeight = -this.width;
            } else {
                squareWidth = squareHeight = this.height;
                // check if the square is gonna be out of bounds
                if (this.height + this.startingX < 0 || this.height + this.startingX > canvasMaxX) squareWidth = -this.height;

                if (this.height + this.startingY < 0 || this.height + this.startingY > canvasMaxY) squareHeight = -this.height;
            }

            this.drawCustomRect(this.drawingService.previewCtx, squareWidth, squareHeight);
        }
    }

    computeDimensions(mousePosition: Vec2): void {
        this.width = mousePosition.x - this.startingX;
        this.height = mousePosition.y - this.startingY;
    }

    isWidthSmallest(): boolean {
        return Math.abs(this.width) < Math.abs(this.height);
    }

    private drawFillRect(ctx: CanvasRenderingContext2D): void {
        ctx.fillRect(this.startingX, this.startingY, this.width, this.height);
    }

    private drawStrokeRect(ctx: CanvasRenderingContext2D): void {
        ctx.strokeRect(this.startingX, this.startingY, this.width, this.height);
    }

    private drawCustomRect(ctx: CanvasRenderingContext2D, width: number, height: number): void {
        ctx.fillRect(this.startingX, this.startingY, width, height);
        ctx.strokeRect(this.startingX, this.startingY, width, height);
    }
}
