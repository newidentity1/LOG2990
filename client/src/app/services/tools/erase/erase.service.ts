import { Injectable } from '@angular/core';
import { BasicShapeProperties } from '@app/classes/tools-properties/basic-shape-properties';
import { Vec2 } from '@app/classes/vec2';
import { BLACK, WHITE } from '@app/constants/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { PencilService } from '@app/services/tools/pencil/pencil-service';

// Ceci est une implémentation de base de l'outil Crayon pour aider à débuter le projet
// L'implémentation ici ne couvre pas tous les critères d'accepetation du projet
// Vous êtes encouragés de modifier et compléter le code.
// N'oubliez pas de regarder les tests dans le fichier spec.ts aussi!
@Injectable({
    providedIn: 'root',
})
export class EraseService extends PencilService {
    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.name = 'Erase';
        this.tooltip = 'Erase(E)';
        this.iconName = 'kitchen';
        this.toolProperties = new BasicShapeProperties();
        this.clearPath();
    }

    protected drawLine(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        this.drawingService.setStrokeColor(WHITE);
        // this.drawingService.setFillColor(BLACK);

        ctx.beginPath();
        ctx.lineJoin = 'bevel';
        ctx.lineCap = 'square';
        for (const point of path) {
            ctx.lineTo(point.x, point.y);
        }
        ctx.stroke();
    }

    protected drawCursor(position: Vec2): void {
        const cursorCtx = this.drawingService.previewCtx;
        if (!this.mouseDown) {
            this.drawingService.clearCanvas(cursorCtx);
        }
        this.drawingService.setFillColor(WHITE);
        this.drawingService.setStrokeColor(BLACK);
        cursorCtx.beginPath();
        cursorCtx.fillRect(
            position.x - this.toolProperties.thickness / 2,
            position.y - this.toolProperties.thickness / 2,
            this.toolProperties.thickness,
            this.toolProperties.thickness,
        );

        cursorCtx.lineWidth = 1;
        cursorCtx.strokeRect(
            position.x - this.toolProperties.thickness / 2,
            position.y - this.toolProperties.thickness / 2,
            this.toolProperties.thickness,
            this.toolProperties.thickness,
        );
        cursorCtx.lineWidth = this.toolProperties.thickness;
    }
}
