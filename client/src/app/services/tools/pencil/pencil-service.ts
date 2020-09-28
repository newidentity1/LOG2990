import { Injectable } from '@angular/core';
import { BasicShapeProperties } from '@app/classes/tools-properties/basic-shape-properties';
import { TracingTool } from '@app/classes/tracing-tool';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';

// Ceci est une implémentation de base de l'outil Crayon pour aider à débuter le projet
// L'implémentation ici ne couvre pas tous les critères d'accepetation du projet
// Vous êtes encouragés de modifier et compléter le code.
// N'oubliez pas de regarder les tests dans le fichier spec.ts aussi!
@Injectable({
    providedIn: 'root',
})
export class PencilService extends TracingTool {
    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.name = 'Crayon';
        this.tooltip = 'Crayon(c)';
        this.iconName = 'create';
        this.toolProperties = new BasicShapeProperties();
        this.clearPath();
    }

    protected drawLine(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        ctx.beginPath();
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
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
        cursorCtx.beginPath();
        cursorCtx.arc(position.x, position.y, this.toolProperties.thickness / 2, 0, Math.PI * 2);
        cursorCtx.fill();
    }
}
