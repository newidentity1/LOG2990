import { Injectable } from '@angular/core';
import { ShapeTool } from '@app/classes/tool/shape-tool';
import { BasicShapeProperties } from '@app/classes/tools-properties/basic-shape-properties';
import { Vec2 } from '@app/classes/vec2';
import { DASHED_SEGMENTS, MINIMUM_THICKNESS, SELECTION_BOX_THICKNESS } from '@app/constants/constants';
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

    /**
     * @description Draws the ellipse with the correct thickness and prioritizes
     * the dimensions of the guide perimeter (boxGuide) which follow the mouse
     * movements. When the thickness is too big for the ellipse to be drawn
     * inside the perimeter, the ctx.lineWidth is assigned to the half of the
     * smallest of its sides.
     */
    drawShape(ctx: CanvasRenderingContext2D): void {
        const radius: Vec2 = { x: this.width / 2, y: this.height / 2 };
        const ellipseProperties = this.toolProperties as BasicShapeProperties;
        const thickness = this.adjustThickness(ellipseProperties, radius);
        const dx = (thickness / 2) * this.signOf(this.width);
        const dy = (thickness / 2) * this.signOf(this.height);

        this.drawingService.setThickness(thickness);
        ctx.beginPath();
        ctx.ellipse(
            this.mouseDownCoord.x + radius.x,
            this.mouseDownCoord.y + radius.y,
            Math.abs(radius.x - dx),
            Math.abs(radius.y - dy),
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

    private signOf(num: number): number {
        return Math.abs(num) / num;
    }

    private drawBoxGuide(ctx: CanvasRenderingContext2D): void {
        if (this.mouseDown) {
            ctx.save();

            ctx.lineWidth = SELECTION_BOX_THICKNESS;
            ctx.beginPath();
            ctx.rect(this.mouseDownCoord.x, this.mouseDownCoord.y, this.width, this.height);
            ctx.strokeStyle = 'white';
            ctx.stroke();
            ctx.setLineDash([DASHED_SEGMENTS]);
            ctx.strokeStyle = 'black';
            ctx.stroke();

            ctx.restore();
        }
    }

    private adjustThickness(ellipseProperties: BasicShapeProperties, radius: Vec2): number {
        return ellipseProperties.currentType === DrawingType.Fill
            ? MINIMUM_THICKNESS
            : this.toolProperties.thickness < Math.min(Math.abs(radius.x), Math.abs(radius.y))
            ? this.toolProperties.thickness
            : Math.min(Math.abs(radius.x), Math.abs(radius.y));
    }
}
