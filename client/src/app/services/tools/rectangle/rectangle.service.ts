import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
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
    private startingX: number;
    private startingY: number;
    private width: number;
    private height: number;

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
            this.width = mousePosition.x - this.startingX;
            this.height = mousePosition.y - this.startingY;
            this.drawRect(this.drawingService.baseCtx);
        }
        this.mouseDown = false;
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.width = mousePosition.x - this.startingX;
            this.height = mousePosition.y - this.startingY;

            // On dessine sur le canvas de prévisualisation et on l'efface à chaque déplacement de la souris
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawRect(this.drawingService.previewCtx);
        }
    }

    private drawRect(ctx: CanvasRenderingContext2D): void {
        ctx.fillRect(this.startingX, this.startingY, this.width, this.height);
    }
}
