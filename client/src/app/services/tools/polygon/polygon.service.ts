import { Injectable } from '@angular/core';
import { ShapeTool } from '@app/classes/tool/shape-tool';
import { PolygonProperties } from '@app/classes/tools-properties/polygon-properties';
import { Vec2 } from '@app/classes/vec2';
import { DASHED_SEGMENTS, MINIMUM_SIDES, SELECTION_BOX_THICKNESS } from '@app/constants/constants';
import { DrawingType } from '@app/enums/drawing-type.enum';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { EllipseService } from '@app/services/tools/ellipse/ellipse.service';

@Injectable({
    providedIn: 'root',
})

/** @todo Maybe extend EllipseService */
export class PolygonService extends ShapeTool {
    ellipseService: EllipseService;

    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.name = 'Polygon';
        this.tooltip = 'Polygone(3)';
        this.iconName = 'change_history';
        this.toolProperties = new PolygonProperties();
        this.ellipseService = new EllipseService(drawingService);
    }

    onMouseUp(): ShapeTool | undefined {
        if (this.mouseDown) {
            this.computeDimensions();
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
        }
        this.mouseDown = false;

        return this;
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            this.currentMousePosition = this.getPositionFromMouse(event);
            this.ellipseService.pathStart = this.pathStart;
            this.ellipseService.currentMousePosition = this.currentMousePosition;
            this.computeDimensions();
            this.ellipseService.width = this.width;
            this.ellipseService.height = this.height;
            this.ellipseService.setTypeDrawing(DrawingType.Stroke);
            this.ellipseService.mouseDown = true;

            // On dessine sur le canvas de prévisualisation et on l'efface à chaque déplacement de la souris
            const previewCtx = this.drawingService.previewCtx;
            this.drawingService.clearCanvas(previewCtx);
            this.setThickness(this.toolProperties.thickness);
            this.draw(previewCtx);
            this.ellipseService.dashedSegments = 0;
            this.drawingService.previewCtx.setLineDash([DASHED_SEGMENTS]);
            this.ellipseService.draw(previewCtx);
        }
    }

    computeDimensions(): void {
        this.width = this.currentMousePosition.x - this.mouseDownCoord.x;
        this.height = this.currentMousePosition.y - this.mouseDownCoord.y;
        const min = Math.min(Math.abs(this.width), Math.abs(this.height));
        this.width = min * this.signOf(this.width);
        this.height = min * this.signOf(this.height);
    }

    draw(ctx: CanvasRenderingContext2D): void {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        if (this.escapeDown) {
            return;
        }

        const radiusX = Math.abs(this.width / 2);
        const radiusY = Math.abs(this.height / 2);

        const polygonProperties = this.toolProperties as PolygonProperties;
        const thickness = this.adjustThickness();
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
    }

    setNumberOfSides(value: number | null): void {
        value = value === null ? MINIMUM_SIDES : value;
        const polygonProperties = this.toolProperties as PolygonProperties;
        polygonProperties.numberOfSides = value;
    }

    drawBoxGuide(): void {
        const ctx = this.drawingService.previewCtx;
        if (this.mouseDown) {
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
