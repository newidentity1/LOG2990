import { Injectable } from '@angular/core';
import { ShapeTool } from '@app/classes/tool/shape-tool';
import { PolygonProperties } from '@app/classes/tools-properties/polygon-properties';
import { Vec2 } from '@app/classes/vec2';
import { DASHED_SEGMENTS, MINIMUM_SIDES } from '@app/constants/constants';
import { DrawingType } from '@app/enums/drawing-type.enum';
import { MouseButton } from '@app/enums/mouse-button.enum';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { EllipseService } from '@app/services/tools/ellipse/ellipse.service';

@Injectable({
    providedIn: 'root',
})

/** @todo Maybe extend EllipseService */
export class PolygonService extends ShapeTool {
    pathStart: Vec2;
    width: number;
    height: number;
    currentMousePosition: Vec2;
    escapeDown: boolean = false;
    ellipseService: EllipseService;

    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.name = 'Polygon';
        this.tooltip = 'Polygone(3)';
        this.iconName = 'change_history';
        this.toolProperties = new PolygonProperties();
        this.ellipseService = new EllipseService(drawingService);
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        if (this.mouseDown) {
            this.escapeDown = false;
            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.pathStart = this.mouseDownCoord;
            this.ellipseService.pathStart = this.mouseDownCoord;
        }
    }

    onMouseUp(): ShapeTool | undefined {
        if (this.mouseDown) {
            this.computeDimensions();
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.setThickness(this.toolProperties.thickness);
            this.draw(this.drawingService.baseCtx);
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

    onKeyDown(event: KeyboardEvent): void {
        this.escapeDown = event.key === 'Escape';
    }

    draw(ctx: CanvasRenderingContext2D): void {
        if (this.escapeDown) {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            return;
        }
        const radiusX = Math.abs(this.width / 2);
        const radiusY = Math.abs(this.height / 2);
        const centerX = this.pathStart.x + radiusX * this.signOf(this.width);
        const centerY = this.pathStart.y + radiusY * this.signOf(this.height);

        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        const polygonProperties = this.toolProperties as PolygonProperties;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - radiusY);

        const numberOfSides = polygonProperties.numberOfSides;
        const startingAngle = Math.PI / 2;
        const angle = (2 * Math.PI) / numberOfSides;

        for (let i = 1; i <= numberOfSides; ++i) {
            const currentAngle = i * angle + startingAngle;
            const pointX = centerX + radiusX * Math.cos(currentAngle);
            const pointY = centerY - radiusY * Math.sin(currentAngle);

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

    signOf(num: number): number {
        return Math.abs(num) / num;
    }

    setNumberOfSides(value: number | null): void {
        value = value === null ? MINIMUM_SIDES : value;
        const polygonProperties = this.toolProperties as PolygonProperties;
        polygonProperties.numberOfSides = value;
    }
}
