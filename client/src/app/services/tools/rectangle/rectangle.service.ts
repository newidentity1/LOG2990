import { Injectable } from '@angular/core';
import { ShapeTool } from '@app/classes/tool/shape-tool';
import { BasicShapeProperties } from '@app/classes/tools-properties/basic-shape-properties';
import { DrawingType } from '@app/enums/drawing-type.enum';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class RectangleService extends ShapeTool {
    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.name = 'Rectangle';
        this.tooltip = 'Rectangle(1)';
        this.iconName = 'crop_square';
    }

    drawShape(ctx: CanvasRenderingContext2D): void {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        const rectangleProperties = this.toolProperties as BasicShapeProperties;

        ctx.beginPath();
        ctx.rect(this.mouseDownCoord.x, this.mouseDownCoord.y, this.width, this.height);
        switch (rectangleProperties.currentType) {
            case DrawingType.Fill:
                ctx.fill();
                break;
            case DrawingType.Stroke:
                ctx.stroke();
                break;
            case DrawingType.FillAndStroke:
                ctx.fill();
                ctx.stroke();
        }
    }
}
