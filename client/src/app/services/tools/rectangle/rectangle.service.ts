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
        const thickness = this.adjustThickness();

        this.drawingService.setThickness(thickness);

        ctx.beginPath();
        ctx.rect(
            this.mouseDownCoord.x + (thickness / 2) * Math.sign(this.width),
            this.mouseDownCoord.y + (thickness / 2) * Math.sign(this.height),
            this.width - thickness * Math.sign(this.width),
            this.height - thickness * Math.sign(this.height),
        );
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
        this.drawBoxGuide(ctx);
    }

    clone(): ShapeTool {
        const rectangleClone: RectangleService = new RectangleService(this.drawingService);
        this.copyShape(rectangleClone);
        return rectangleClone;
    }
}
