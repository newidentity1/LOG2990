import { Injectable } from '@angular/core';
import { ShapeTool } from '@app/classes/tool/shape-tool';
import { BasicShapeProperties } from '@app/classes/tools-properties/basic-shape-properties';
import { DASHED_SEGMENTS, SELECTION_BOX_THICKNESS } from '@app/constants/constants';
import { DrawingType } from '@app/enums/drawing-type.enum';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class EllipseService extends ShapeTool {
    dashedSegments: number;

    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.name = 'Ellipse';
        this.tooltip = 'Ellipse(2)';
        this.iconName = 'panorama_fish_eye';
        this.dashedSegments = DASHED_SEGMENTS;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        if (this.escapeDown) {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            return;
        }

        const ellipseProperties = this.toolProperties as BasicShapeProperties;
        this.adjustThickness();

        ctx.beginPath();
        ctx.ellipse(
            this.pathStart.x + this.width / 2,
            this.pathStart.y + this.height / 2,
            Math.abs(this.radius.x),
            Math.abs(this.radius.y),
            0,
            0,
            2 * Math.PI,
        );

        switch (ellipseProperties.currentType) {
            case DrawingType.Stroke:
                ctx.stroke();
                break;
            case DrawingType.Fill:
                ctx.fill();
                break;
            default:
                ctx.fill();
                ctx.stroke();
        }

        this.drawBoxGuide(ctx);
    }

    private drawBoxGuide(ctx: CanvasRenderingContext2D): void {
        if (this.mouseDown) {
            ctx.save();

            ctx.lineWidth = SELECTION_BOX_THICKNESS;
            ctx.beginPath();
            ctx.rect(
                this.pathStart.x,
                this.pathStart.y,
                this.currentMousePosition.x - this.pathStart.x,
                this.currentMousePosition.y - this.pathStart.y,
            );
            ctx.setLineDash([this.dashedSegments]);
            ctx.strokeStyle = 'black';
            ctx.stroke();

            ctx.restore();
        }
    }
}
