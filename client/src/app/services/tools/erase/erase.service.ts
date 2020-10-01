import { Injectable } from '@angular/core';
import { BasicShapeProperties } from '@app/classes/tools-properties/basic-shape-properties';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { PencilService } from '@app/services/tools/pencil/pencil-service';

@Injectable({
    providedIn: 'root',
})
export class EraseService extends PencilService {
    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.name = 'Eraser';
        this.tooltip = 'Efface(e)';
        this.iconName = 'kitchen';
        this.toolProperties = new BasicShapeProperties();
        this.clearPath();
    }

    onMouseMove(event: MouseEvent): void {
        const mousePosition = this.getPositionFromMouse(event);
        if (this.mouseDown) {
            this.pathData.push(mousePosition);
            // On dessine sur le canvas de prévisualisation et on l'efface à chaque déplacement de la souris
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawLine(this.drawingService.previewCtx, this.pathData);
        }
        this.drawCursor(mousePosition);
    }

    protected drawLine(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        this.drawingService.setStrokeColor('white');
        ctx.lineJoin = 'round';
        ctx.miterLimit = 1;
        ctx.beginPath();
        for (const point of path) {
            ctx.lineTo(point.x, point.y);
            ctx.fillRect(
                point.x - this.toolProperties.thickness / 2,
                point.y - this.toolProperties.thickness / 2,
                this.toolProperties.thickness,
                this.toolProperties.thickness,
            );
        }
        ctx.stroke();
    }

    protected drawCursor(position: Vec2): void {
        const cursorCtx = this.drawingService.previewCtx;
        if (!this.mouseDown) {
            this.drawingService.clearCanvas(cursorCtx);
        }
        this.drawingService.setFillColor('white');
        this.drawingService.setStrokeColor('black');
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
