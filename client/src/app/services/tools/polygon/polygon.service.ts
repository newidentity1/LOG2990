import { Injectable } from '@angular/core';
import { ShapeTool } from '@app/classes/tool/shape-tool';
import { BasicShapeProperties } from '@app/classes/tools-properties/basic-shape-properties';
import { PolygonProperties } from '@app/classes/tools-properties/polygon-properties';
import { Vec2 } from '@app/classes/vec2';
import { DASHED_SEGMENTS, MINIMUM_SIDES, SELECTION_BOX_THICKNESS } from '@app/constants/constants';
import { DrawingType } from '@app/enums/drawing-type.enum';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class PolygonService extends ShapeTool {
    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.name = 'Polygon';
        this.tooltip = 'Polygone(3)';
        this.iconName = 'change_history';
        this.toolProperties = new PolygonProperties();
    }

    onKeyDown(event: KeyboardEvent): void {
        if (event.key === 'Escape') {
            this.mouseDown = false;
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
        }
    }

    onKeyUp(event: KeyboardEvent): void {
        // no shift for polygon
    }

    computeDimensions(): void {
        this.width = this.currentMousePosition.x - this.mouseDownCoord.x;
        this.height = this.currentMousePosition.y - this.mouseDownCoord.y;
        const min = Math.min(Math.abs(this.width), Math.abs(this.height));
        this.width = min * this.signOf(this.width);
        this.height = min * this.signOf(this.height);
    }

    drawShape(ctx: CanvasRenderingContext2D): void {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);

        const radiusX = Math.abs(this.width / 2);
        const radiusY = Math.abs(this.height / 2);

        const polygonProperties = this.toolProperties as PolygonProperties;
        const thickness = this.adjustThickness(this.toolProperties as BasicShapeProperties, { x: radiusX, y: radiusY } as Vec2);
        this.drawingService.setThickness(thickness);
        const numberOfSides = polygonProperties.numberOfSides;
        const thicknessRatio = numberOfSides / (numberOfSides / 2);

        const centerX = this.mouseDownCoord.x + radiusX * this.signOf(this.width);
        const centerY = this.mouseDownCoord.y + radiusY * this.signOf(this.height);

        ctx.beginPath();
        ctx.moveTo(centerX, centerY - (radiusY - thickness / thicknessRatio));

        const startingAngle = Math.PI / 2;
        const angle = (2 * Math.PI) / numberOfSides;
        ctx.save();
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        for (let i = 1; i <= numberOfSides; ++i) {
            const currentAngle = i * angle + startingAngle;
            const pointX = centerX + (radiusX - thickness / thicknessRatio) * Math.cos(currentAngle);
            const pointY = centerY - (radiusY - thickness / thicknessRatio) * Math.sin(currentAngle);

            ctx.lineTo(pointX, pointY);
        }

        switch (polygonProperties.currentType) {
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
        ctx.closePath();
        ctx.restore();

        this.drawBoxGuide();
    }

    setNumberOfSides(value: number | null): void {
        value = value === null ? MINIMUM_SIDES : value;
        const polygonProperties = this.toolProperties as PolygonProperties;
        polygonProperties.numberOfSides = value;
    }

    drawBoxGuide(): void {
        if (this.mouseDown) {
            const ctx = this.drawingService.previewCtx;
            ctx.save();

            ctx.lineWidth = SELECTION_BOX_THICKNESS;
            ctx.beginPath();
            const radius: Vec2 = { x: this.width / 2, y: this.height / 2 };
            ctx.ellipse(
                this.mouseDownCoord.x + radius.x,
                this.mouseDownCoord.y + radius.y,
                Math.abs(radius.x),
                Math.abs(radius.y),
                0,
                0,
                2 * Math.PI,
            );
            ctx.rect(this.mouseDownCoord.x, this.mouseDownCoord.y, this.width, this.height);
            ctx.setLineDash([]);
            ctx.strokeStyle = 'white';
            ctx.stroke();
            ctx.setLineDash([DASHED_SEGMENTS]);
            ctx.strokeStyle = 'black';
            ctx.stroke();
            ctx.restore();
        }
    }
}
