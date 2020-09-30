import { Injectable } from '@angular/core';
import { Color } from '@app/classes/color/color';
import { Tool } from '@app/classes/tool';
import { BrushProperties } from '@app/classes/tools-properties/brush-properties';
import { Vec2 } from '@app/classes/vec2';
import { BrushType } from '@app/enums/brush-filters.enum';
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
export class BrushService extends Tool {
    private pathData: Vec2[];

    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.name = 'Brush';
        this.tooltip = 'Brush(w)';
        this.iconName = 'brush';
        this.toolProperties = new BrushProperties();
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
            this.paintLine(this.drawingService.baseCtx, this.pathData);
        }
        this.mouseDown = false;
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.clearPath();
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.pathData.push(mousePosition);

            // On dessine sur le canvas de prévisualisation et on l'efface à chaque déplacement de la souris
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.paintLine(this.drawingService.previewCtx, this.pathData);
        }
    }

    private paintLine(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        ctx.beginPath();

        ctx.lineCap = 'round';

        // set filter
        // ctx.filter = 'url(#Brushed)';
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

        for (const point of path) {
            ctx.lineTo(point.x, point.y);
        }
        ctx.stroke();
        // reset filter
        ctx.filter = 'none';
    }

    setColors(primaryColor: Color, secondaryColor: Color): void {
        this.drawingService.setColor(primaryColor.toStringRGBA());
    }

    setFilter(value: string): void {
        const brushProperties = this.toolProperties as BrushProperties;
        brushProperties.currentFilter = value;
    }

    // TODO: duplicate code from rectangle (clean)
    setThickness(value: number | null): void {
        // TODO possiblement ajouter de la validation ici aussi
        value = value === null ? 1 : value;
        this.toolProperties.thickness = value;
        this.drawingService.setThickness(value);
    }

    private clearPath(): void {
        this.pathData = [];
    }
}
