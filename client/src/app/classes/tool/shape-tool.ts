import { Color } from '@app/classes/color/color';
import { BasicShapeProperties } from '@app/classes/tools-properties/basic-shape-properties';
import { Vec2 } from '@app/classes/vec2';
import { DASHED_SEGMENTS, MINIMUM_THICKNESS, SELECTION_BOX_THICKNESS } from '@app/constants/constants';
import { DrawingType } from '@app/enums/drawing-type.enum';
import { MouseButton } from '@app/enums/mouse-button.enum';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { Tool } from './tool';

export abstract class ShapeTool extends Tool {
    width: number;
    height: number;
    shiftDown: boolean = false;
    escapeDown: boolean = false;
    currentMousePosition: Vec2;

    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.mouseDownCoord = { x: 0, y: 0 };
        this.toolProperties = new BasicShapeProperties();
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        if (this.mouseDown) {
            this.mouseDownCoord = this.getPositionFromMouse(event);
        }
    }

    onMouseMove(event: MouseEvent): void {
        this.currentMousePosition = this.getPositionFromMouse(event);
        if (this.mouseDown) {
            this.drawPreview();
        }
    }

    onMouseUp(event: MouseEvent): void {
        this.currentMousePosition = this.getPositionFromMouse(event);
        if (this.mouseDown) {
            this.mouseDown = false;
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            if (this.currentMousePosition.x !== this.mouseDownCoord.x && this.currentMousePosition.y !== this.mouseDownCoord.y) {
                this.drawShape(this.drawingService.baseCtx);
            }
        }
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

    setTypeDrawing(value: string): void {
        const shapeProperties = this.toolProperties as BasicShapeProperties;
        shapeProperties.currentType = value;
    }

    abstract drawShape(ctx: CanvasRenderingContext2D): void;

    setColors(primaryColor: Color, secondaryColor: Color): void {
        this.currentPrimaryColor = primaryColor;
        this.currentSecondaryColor = secondaryColor;
        this.drawingService.setFillColor(primaryColor.toStringRGBA());
        this.drawingService.setStrokeColor(secondaryColor.toStringRGBA());
    }

    protected drawPreview(): void {
        this.computeDimensions();
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.drawShape(this.drawingService.previewCtx);
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
        this.width = smallestSide * this.signOf(this.width);
        this.height = smallestSide * this.signOf(this.height);
    }

    signOf(num: number): number {
        return Math.abs(num) / num;
    }

    resetContext(): void {
        this.mouseDown = false;
        this.shiftDown = false;
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
    }

    drawBoxGuide(ctx: CanvasRenderingContext2D): void {
        if (this.mouseDown) {
            ctx.save();

            ctx.lineWidth = SELECTION_BOX_THICKNESS;
            ctx.beginPath();
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

    adjustThickness(properties: BasicShapeProperties, dimensions: Vec2): number {
        return properties.currentType === DrawingType.Fill
            ? MINIMUM_THICKNESS
            : this.toolProperties.thickness < Math.min(Math.abs(dimensions.x), Math.abs(dimensions.y))
            ? this.toolProperties.thickness
            : Math.min(Math.abs(dimensions.x), Math.abs(dimensions.y));
    }
}
