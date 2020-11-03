import { Injectable } from '@angular/core';
import { ShapeTool } from '@app/classes/tool/shape-tool';
import { BasicShapeProperties } from '@app/classes/tools-properties/basic-shape-properties';
import { DrawingType } from '@app/enums/drawing-type.enum';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class EllipseService extends ShapeTool {
    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.name = 'Ellipse';
        this.tooltip = 'Ellipse(2)';
        this.iconName = 'panorama_fish_eye';
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
            this.mouseDownCoord.x + this.width / 2,
            this.mouseDownCoord.y + this.height / 2,
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

    clone(): ShapeTool {
        const ellipseClone: EllipseService = new EllipseService(this.drawingService);
        this.copyShape(ellipseClone);
        return ellipseClone;
    }
}
