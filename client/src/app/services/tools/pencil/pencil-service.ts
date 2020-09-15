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
export class PencilService extends Tool {
    private pathData: Vec2[];
    thickness: number = 20; // TODO: Utiliser un properties service
    inCanvas: boolean;

    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.name = 'Crayon';
        this.tooltip = 'Crayon';
        this.iconName = 'create';
        this.clearPath();
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        if (this.mouseDown) {
            this.clearPath();

            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.pathData.push(this.mouseDownCoord);
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.pathData.push(mousePosition);
            if (this.inCanvas) {
                this.drawLine(this.drawingService.baseCtx, this.pathData);
            } else {
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
            }
        }
        this.mouseDown = false;
        this.clearPath();
    }

    onMouseMove(event: MouseEvent): void {
        const mousePosition = this.getPositionFromMouse(event);
        if (this.mouseDown) {
            this.pathData.push(mousePosition);

            // On dessine sur le canvas de prévisualisation et on l'efface à chaque déplacement de la souris
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawLine(this.drawingService.previewCtx, this.pathData);
        } else {
            this.drawCursor(this.drawingService.previewCtx, mousePosition);
        }
    }

    onMouseEnter(event: MouseEvent): void {
        this.inCanvas = true;
        if (this.mouseDown) {
            this.drawLine(this.drawingService.baseCtx, this.pathData);
            const mousePosition = this.getPositionFromMouse(event);
            this.pathData.push(mousePosition);
            this.drawLine(this.drawingService.previewCtx, this.pathData);
            this.clearPath();
        }
    }

    onMouseLeave(event: MouseEvent): void {
        this.inCanvas = false;
        const mousePosition = this.getPositionFromMouse(event);
        this.pathData.push(mousePosition);
        if (this.mouseDown) {
            this.drawLine(this.drawingService.previewCtx, this.pathData);
        } else {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
        }
    }

    private drawLine(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        ctx.beginPath();
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        for (const point of path) {
            ctx.lineTo(point.x, point.y);
        }
        ctx.stroke();
    }

    private drawCursor(ctx: CanvasRenderingContext2D, position: Vec2): void {
        this.drawingService.clearCanvas(ctx);
        ctx.beginPath();
        ctx.arc(position.x, position.y, this.thickness / 2, 0, Math.PI * 2);
        ctx.fill();
    }

    private clearPath(): void {
        this.pathData = [];
    }
}
