import { Color } from '@app/classes/color/color';
import { BasicShapeProperties } from '@app/classes/tools-properties/basic-shape-properties';
import { Vec2 } from '@app/classes/vec2';
import { MouseButton } from '@app/enums/mouse-button.enum';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { Tool } from './tool';

export abstract class ShapeTool extends Tool {
    width: number;
    height: number;
    shiftDown: boolean;
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
            this.computeDimensions();
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawShape(this.drawingService.baseCtx);
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
        this.drawingService.setFillColor(primaryColor.toStringRGBA());
        this.drawingService.setStrokeColor(secondaryColor.toStringRGBA());
    }

    protected drawPreview(): void {
        this.computeDimensions();
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.drawShape(this.drawingService.previewCtx);
    }

    private computeDimensions(): void {
        this.width = this.currentMousePosition.x - this.mouseDownCoord.x;
        this.height = this.currentMousePosition.y - this.mouseDownCoord.y;

        if (this.shiftDown) {
            this.transformToEqualSides();
        }
    }

    private transformToEqualSides(): void {
        if (Math.abs(this.width) === Math.abs(this.height)) return;

        const smallestSide = Math.min(Math.abs(this.width), Math.abs(this.height));
        this.width = this.width >= 0 ? smallestSide : -smallestSide;
        this.height = this.height >= 0 ? smallestSide : -smallestSide;
    }

    resetContext(): void {
        this.mouseDown = false;
        this.shiftDown = false;
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
    }
}
