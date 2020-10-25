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

    draw(ctx: CanvasRenderingContext2D): void {
        const rectangleProperties = this.toolProperties as BasicShapeProperties;
        this.adjustThickness();

        ctx.beginPath();
        ctx.rect(this.pathStart.x + this.dx, this.pathStart.y + this.dy, this.radius.x * 2, this.radius.y * 2);

        ctx.beginPath();
        ctx.rect(this.mouseDownCoord.x, this.mouseDownCoord.y, this.width, this.height);
        switch (rectangleProperties.currentType) {
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
    }
}
