import { Injectable } from '@angular/core';
import { ShapeTool } from '@app/classes/tool/shape-tool';
import { BasicShapeProperties } from '@app/classes/tools-properties/basic-shape-properties';
import { PolygonProperties } from '@app/classes/tools-properties/polygon-properties';
import { Vec2 } from '@app/classes/vec2';
import { DASHED_SEGMENTS, MINIMUM_SIDES, MINIMUM_THICKNESS } from '@app/constants/constants';
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

    onMouseUp(): void {
        if (this.mouseDown) {
            this.computeDimensions(this.currentMousePosition);
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.setThickness(this.toolProperties.thickness);
            this.draw(this.drawingService.baseCtx);
        }
        this.mouseDown = false;
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            this.currentMousePosition = this.getPositionFromMouse(event);
            this.ellipseService.mouseDownCoord = this.currentMousePosition;
            this.computeDimensions(this.currentMousePosition);
            this.ellipseService.width = this.width;
            this.ellipseService.height = this.height;
            this.ellipseService.setTypeDrawing(DrawingType.Stroke);
            this.ellipseService.mouseDown = true;

            // On dessine sur le canvas de prévisualisation et on l'efface à chaque déplacement de la souris
            const previewCtx = this.drawingService.previewCtx;
            this.drawingService.clearCanvas(previewCtx);
            this.setThickness(this.toolProperties.thickness);
            this.draw(previewCtx);
            this.ellipseService.drawEllipse(previewCtx, 0);
        }
    }

    onKeyDown(event: KeyboardEvent): void {
        this.escapeDown = event.key === 'Escape';
    }

    // refactor apres les changements de Brando
    adjustThickness(polygonProperties: BasicShapeProperties, radius: Vec2): number {
        return polygonProperties.currentType === DrawingType.Fill
            ? MINIMUM_THICKNESS
            : this.toolProperties.thickness < Math.min(Math.abs(radius.x), Math.abs(radius.y))
            ? this.toolProperties.thickness
            : Math.min(Math.abs(radius.x), Math.abs(radius.y));
    }

    draw(ctx: CanvasRenderingContext2D): void {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        if (this.escapeDown) {
            return;
        }

        const radiusX = Math.abs(this.width / 2);
        const radiusY = Math.abs(this.height / 2);

        const polygonProperties = this.toolProperties as PolygonProperties;
        const thickness = this.adjustThickness(this.toolProperties as BasicShapeProperties, { x: radiusX, y: radiusY } as Vec2);
        this.drawingService.setThickness(thickness);
        const numberOfSides = polygonProperties.numberOfSides;
        const thicknessRatio = numberOfSides / (numberOfSides / 2);

        const centerX = this.pathStart.x + radiusX * this.signOf(this.width);
        const centerY = this.pathStart.y + radiusY * this.signOf(this.height);

        ctx.beginPath();
        ctx.moveTo(centerX, centerY - (radiusY - thickness / thicknessRatio));

        const startingAngle = Math.PI / 2;
        const angle = (2 * Math.PI) / numberOfSides;
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

        if (ctx === this.drawingService.previewCtx) {
            ctx.setLineDash([DASHED_SEGMENTS]);
        }
        ctx.lineCap = 'butt';
        ctx.lineJoin = 'miter';
    }

    signOf(num: number): number {
        return Math.abs(num) / num;
    }

    computeDimensions(mousePosition: Vec2): void {
        this.width = mousePosition.x - this.pathStart.x;
        this.height = mousePosition.y - this.pathStart.y;
        const min = Math.min(Math.abs(this.width), Math.abs(this.height));
        this.width = min * this.signOf(this.width);
        this.height = min * this.signOf(this.height);
    }

    setNumberOfSides(value: number | null): void {
        value = value === null ? MINIMUM_SIDES : value;
        const polygonProperties = this.toolProperties as PolygonProperties;
        polygonProperties.numberOfSides = value;
    }
}
