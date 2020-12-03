import { Injectable } from '@angular/core';
import { BrushProperties } from '@app/classes/tools-properties/brush-properties';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { PencilService } from '@app/services/tools/pencil/pencil-service';

@Injectable({
    providedIn: 'root',
})
export class CalligraphyService extends PencilService {
    lineLength: number = 10; // TODO: use constants
    lineAngle: number = 0;

    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.name = 'Calligraphy';
        this.tooltip = 'Plume(p)';
        this.iconName = 'history_edu';
        this.toolProperties = new BrushProperties();
        this.clearPath();
    }

    draw(ctx: CanvasRenderingContext2D): void {
        console.log(this.lineAngle);
        ctx.lineWidth = 2;
        for (const point of this.pathData) {
            ctx.beginPath();
            ctx.lineTo(
                point.x - (this.lineLength / 2) * Math.cos((this.lineAngle * Math.PI) / 180),
                point.y - (this.lineLength / 2) * Math.sin((this.lineAngle * Math.PI) / 180),
            );
            ctx.lineTo(
                point.x + (this.lineLength / 2) * Math.cos((this.lineAngle * Math.PI) / 180),
                point.y + (this.lineLength / 2) * Math.sin((this.lineAngle * Math.PI) / 180),
            );
            ctx.stroke();
        }
    }

    protected drawCursor(position: Vec2): void {
        const cursorCtx = this.drawingService.previewCtx;
        this.drawingService.clearCanvas(cursorCtx);
        cursorCtx.beginPath();
        cursorCtx.lineTo(
            position.x - (this.lineLength / 2) * Math.cos((this.lineAngle * Math.PI) / 180),
            position.y - (this.lineLength / 2) * Math.sin((this.lineAngle * Math.PI) / 180),
        );
        cursorCtx.lineTo(
            position.x + (this.lineLength / 2) * Math.cos((this.lineAngle * Math.PI) / 180),
            position.y + (this.lineLength / 2) * Math.sin((this.lineAngle * Math.PI) / 180),
        );
        cursorCtx.stroke();
    }
}
