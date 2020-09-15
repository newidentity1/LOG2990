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
    private mousePosition: Vec2;

    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.name = 'Ellipse';
        this.tooltip = 'Ellipse';
        this.iconName = 'panorama_fish_eye';
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
            this.mousePosition = this.getPositionFromMouse(event);
            this.computeDimensions();

            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.mouseDown = false;
            this.drawEllipse(this.drawingService.baseCtx);
        }
        this.mouseDown = false;
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            this.mousePosition = this.getPositionFromMouse(event);
            this.drawPreview();
        }
    }

    onKeyDown(event: KeyboardEvent): void {
        this.shiftDown = event.key === 'Shift';
        if (this.mouseDown) this.drawPreview();
    }

    onKeyUp(event: KeyboardEvent): void {
        this.shiftDown = !(event.key === 'Shift');
        if (this.mouseDown) this.drawPreview();
    }

    computeDimensions(): void {
        this.width = this.mousePosition.x - this.pathStart.x;
        this.height = this.mousePosition.y - this.pathStart.y;

        if (this.shiftDown) {
            const min = Math.min(Math.abs(this.width), Math.abs(this.height));
            this.width = this.width < 0 ? -min : min;
            this.height = this.height < 0 ? -min : min;
        }
    }

    private drawPreview(): void {
        this.computeDimensions();

        // On dessine sur le canvas de prévisualisation et on l'efface à chaque déplacement de la souris
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.drawEllipse(this.drawingService.previewCtx);
    }

    private drawEllipse(ctx: CanvasRenderingContext2D): void {
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
