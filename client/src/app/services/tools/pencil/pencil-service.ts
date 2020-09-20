import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { BasicShapeProperties } from '@app/classes/tools-properties/basic-shape-properties';
import { Vec2 } from '@app/classes/vec2';
import { MouseButton } from '@app/enums/mouse-button.enum';
import { DrawingService } from '@app/services/drawing/drawing.service';

// Ceci est une implémentation de base de l'outil Crayon pour aider à débuter le projet
// L'implémentation ici ne couvre pas tous les critères d'accepetation du projet
// Vous êtes encouragés de modifier et compléter le code.
// N'oubliez pas de regarder les tests dans le fichier spec.ts aussi!
@Injectable({
    providedIn: 'root',
})
export class PencilService extends Tool {
    private pathData: Vec2[];

    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.name = 'Crayon';
        this.tooltip = 'Crayon';
        this.iconName = 'create';
        this.toolProperties = new BasicShapeProperties();
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
            this.drawLine(this.drawingService.baseCtx, this.pathData);
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
            this.drawCursor(mousePosition);
        }
    }

    onMouseEnter(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.pathData.push(mousePosition);
            this.drawLine(this.drawingService.previewCtx, this.pathData);
            this.clearPath();
        }
    }

    onMouseLeave(event: MouseEvent): void {
        const mousePosition = this.getPositionFromMouse(event);
        this.pathData.push(mousePosition);
        if (this.mouseDown) {
            this.drawLine(this.drawingService.baseCtx, this.pathData);
            this.clearPath();
        } else {
            this.drawCursor(mousePosition);
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

    private drawCursor(position: Vec2): void {
        const cursorCtx = this.drawingService.previewCtx;
        this.drawingService.clearCanvas(cursorCtx);
        cursorCtx.beginPath();
        cursorCtx.arc(position.x, position.y, this.toolProperties.thickness / 2, 0, Math.PI * 2);
        cursorCtx.fill();
    }

    private clearPath(): void {
        this.pathData = [];
    }
}
