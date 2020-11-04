import { Injectable } from '@angular/core';
import { BrushProperties } from '@app/classes/tools-properties/brush-properties';
import { Vec2 } from '@app/classes/vec2';
import { BrushType } from '@app/enums/brush-filters.enum';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { PencilService } from '@app/services/tools/pencil/pencil-service';

// Ceci est une implémentation de base de l'outil Crayon pour aider à débuter le projet
// L'implémentation ici ne couvre pas tous les critères d'accepetation du projet
// Vous êtes encouragés de modifier et compléter le code.
// N'oubliez pas de regarder les tests dans le fichier spec.ts aussi!
@Injectable({
    providedIn: 'root',
})
export class BrushService extends PencilService {
    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.name = 'Brush';
        this.tooltip = 'Pinceau(w)';
        this.iconName = 'brush';
        this.toolProperties = new BrushProperties();
        this.clearPath();
    }

    protected drawCursor(position: Vec2): void {
        const cursorCtx = this.drawingService.previewCtx;
        this.drawingService.clearCanvas(cursorCtx);
        cursorCtx.beginPath();
        this.switchFilter(cursorCtx);
        cursorCtx.arc(position.x, position.y, this.toolProperties.thickness / 2, 0, Math.PI * 2);
        cursorCtx.fill();
        // reset filter
        cursorCtx.filter = 'none';
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.beginPath();

        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        this.switchFilter(ctx);

        for (const point of this.pathData) {
            ctx.lineTo(point.x, point.y);
        }
        ctx.stroke();
        // reset filter
        ctx.filter = 'none';
    }

    setFilter(value: string): void {
        const brushProperties = this.toolProperties as BrushProperties;
        if (brushProperties.filterType.includes(value)) {
            brushProperties.currentFilter = value;
        }
    }

    switchFilter(ctx: CanvasRenderingContext2D): void {
        const brushProperties = this.toolProperties as BrushProperties;
        switch (brushProperties.currentFilter) {
            case BrushType.Blurred:
                ctx.filter = 'url(#Blurred)';
                break;
            case BrushType.Brushed:
                ctx.filter = 'url(#Brushed)';
                break;
            case BrushType.Spray:
                ctx.filter = 'url(#Spray)';
                break;
            case BrushType.Splash:
                ctx.filter = 'url(#Splash)';
                break;
            case BrushType.Cloud:
                ctx.filter = 'url(#Cloud)';
                break;
        }
    }

    clone(): BrushService {
        const brushClone: BrushService = new BrushService(this.drawingService);
        this.copyTool(brushClone);
        const brushCloneProperties = brushClone.toolProperties as BrushProperties;
        const brushProperties = this.toolProperties as BrushProperties;
        brushCloneProperties.currentFilter = brushProperties.currentFilter;
        return brushClone;
    }
}
