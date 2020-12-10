import { Color } from '@app/classes/color/color';
import { BasicShapeProperties } from '@app/classes/tools-properties/basic-shape-properties';
import { Vec2 } from '@app/classes/vec2';
import { DASHED_SEGMENTS, SELECTION_BOX_THICKNESS } from '@app/constants/constants';
import { DrawingType } from '@app/enums/drawing-type.enum';
import { MouseButton } from '@app/enums/mouse-button.enum';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { Tool } from './tool';

export abstract class ShapeTool extends Tool {
    width: number = 0;
    height: number = 0;
    shiftDown: boolean = false;
    escapeDown: boolean = false;
    radius: Vec2 = { x: 0, y: 0 };
    currentMousePosition: Vec2 = { x: 0, y: 0 };
    dashedSegments: number = DASHED_SEGMENTS;
    dx: number = 0;
    dy: number = 0;

    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.mouseDownCoord = { x: 0, y: 0 };
        this.toolProperties = new BasicShapeProperties();
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        if (this.mouseDown) {
            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.currentMousePosition = this.getPositionFromMouse(event);
        }
    }

    onMouseMove(event: MouseEvent): void {
        this.currentMousePosition = this.getPositionFromMouse(event);
        if (this.mouseDown) {
            this.drawPreview();
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            this.mouseDown = false;
            this.computeDimensions();
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            if (this.currentMousePosition.x !== this.mouseDownCoord.x && this.currentMousePosition.y !== this.mouseDownCoord.y) {
                this.draw(this.drawingService.baseCtx);
                this.executedCommand.emit(this.clone());
            }
        }
    }

    setTypeDrawing(value: string): void {
        const shapeProperties = this.toolProperties as BasicShapeProperties;
        shapeProperties.currentType = value;
    }

    onKeyDown(event: KeyboardEvent): void {
        if (event.key === 'Escape') {
            this.mouseDown = false;
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
        }

        this.shiftDown = event.key === 'Shift';
        if (this.mouseDown) this.drawPreview();
    }

    onKeyUp(event: KeyboardEvent): void {
        this.shiftDown = event.key === 'Shift' ? false : this.shiftDown;

        if (this.mouseDown) this.drawPreview();
    }

    protected computeDimensions(): void {
        this.width = this.currentMousePosition.x - this.mouseDownCoord.x;
        this.height = this.currentMousePosition.y - this.mouseDownCoord.y;

        if (this.shiftDown) {
            this.transformToEqualSides();
        }
    }

    private transformToEqualSides(): void {
        if (Math.abs(this.width) === Math.abs(this.height)) return;

        const smallestSide = Math.min(Math.abs(this.width), Math.abs(this.height));
        this.width = smallestSide * Math.sign(this.width);
        this.height = smallestSide * Math.sign(this.height);
    }

    abstract draw(ctx: CanvasRenderingContext2D): void;

    setColors(primaryColor: Color, secondaryColor: Color): void {
        this.drawingService.previewCtx.canvas.style.cursor = '';
        this.currentPrimaryColor = primaryColor;
        this.currentSecondaryColor = secondaryColor;
        this.drawingService.setFillColor(primaryColor.toStringRGBA());
        this.drawingService.setStrokeColor(secondaryColor.toStringRGBA());
    }

    resetContext(): void {
        this.mouseDown = false;
        this.shiftDown = false;
        this.escapeDown = false;
        this.applyCurrentSettings();
    }

    adjustThickness(): number {
        const shapeProperties = this.toolProperties as BasicShapeProperties;
        this.radius = { x: this.width / 2, y: this.height / 2 };

        const minRadius = Math.min(Math.abs(this.radius.x), Math.abs(this.radius.y));
        const maxThickness = this.toolProperties.thickness < minRadius ? this.toolProperties.thickness : minRadius;

        const thickness = shapeProperties.currentType === DrawingType.Fill ? 0 : maxThickness;
        this.dx = (thickness / 2) * Math.sign(this.width);
        this.dy = (thickness / 2) * Math.sign(this.height);
        this.radius.x -= this.dx;
        this.radius.y -= this.dy;
        this.drawingService.setThickness(thickness);
        return thickness;
    }

    protected drawPreview(): void {
        this.computeDimensions();
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.draw(this.drawingService.previewCtx);
    }

    drawBoxGuide(ctx: CanvasRenderingContext2D): void {
        if (this.mouseDown) {
            ctx.save();

            ctx.lineWidth = SELECTION_BOX_THICKNESS;
            ctx.beginPath();
            ctx.rect(
                this.mouseDownCoord.x,
                this.mouseDownCoord.y,
                this.currentMousePosition.x - this.mouseDownCoord.x,
                this.currentMousePosition.y - this.mouseDownCoord.y,
            );

            ctx.setLineDash([]);
            ctx.strokeStyle = 'white';
            ctx.stroke();

            ctx.setLineDash([this.dashedSegments]);
            ctx.strokeStyle = 'black';
            ctx.stroke();

            ctx.restore();
        }
    }

    copyShape(shape: ShapeTool): void {
        this.copyTool(shape);
        shape.width = this.width;
        shape.height = this.height;
        shape.mouseDownCoord = this.mouseDownCoord;
        shape.currentMousePosition = this.currentMousePosition;
        const shapeProperties = this.toolProperties as BasicShapeProperties;
        shape.setTypeDrawing(shapeProperties.currentType);
    }
}
