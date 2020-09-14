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

// Ceci est une implémentation de base de l'outil Crayon pour aider à débuter le projet
// L'implémentation ici ne couvre pas tous les critères d'accepetation du projet
// Vous êtes encouragés de modifier et compléter le code.
// N'oubliez pas de regarder les tests dans le fichier spec.ts aussi!
@Injectable({
    providedIn: 'root',
})
export class EllipseService extends Tool {
    private pathStart: Vec2;
    private width: number;
    private height: number;
    private shiftDown: boolean = false;

    constructor(drawingService: DrawingService) {
        super(drawingService);
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        if (this.mouseDown) {
            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.pathStart = this.mouseDownCoord;
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.computeDimensions(mousePosition);

            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.mouseDown = false;
            this.drawLine(this.drawingService.baseCtx);
        }
        this.mouseDown = false;
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.computeDimensions(mousePosition);

            // On dessine sur le canvas de prévisualisation et on l'efface à chaque déplacement de la souris
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawLine(this.drawingService.previewCtx);
        }
    }

    onKeyDown(event: KeyboardEvent): void {
        this.shiftDown = event.key === 'Shift';
    }

    onKeyUp(event: KeyboardEvent): void {
        this.shiftDown = !(event.key === 'Shift');
    }

    computeDimensions(mousePosition: Vec2): void {
        this.width = mousePosition.x - this.pathStart.x;
        this.height = mousePosition.y - this.pathStart.y;

        if (this.shiftDown) {
            const max = Math.max(Math.abs(this.width), Math.abs(this.height));
            this.width = this.width < 0 ? -max : max;
            this.height = this.height < 0 ? -max : max;
        }
    }

    private drawLine(ctx: CanvasRenderingContext2D): void {
        if (this.mouseDown) {
            ctx.beginPath();
            ctx.rect(this.pathStart.x, this.pathStart.y, this.width, this.height);
            ctx.stroke();
        }

        const radius: Vec2 = { x: this.width / 2, y: this.height / 2 };
        ctx.beginPath();
        ctx.ellipse(this.pathStart.x + radius.x, this.pathStart.y + radius.y, Math.abs(radius.x), Math.abs(radius.y), 0, 0, 2 * Math.PI);
        ctx.stroke();
    }
}
