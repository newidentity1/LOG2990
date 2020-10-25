import { Color } from '@app/classes/color/color';
import { BasicShapeProperties } from '@app/classes/tools-properties/basic-shape-properties';
import { Vec2 } from '@app/classes/vec2';
import { DrawingType } from '@app/enums/drawing-type.enum';
import { MouseButton } from '@app/enums/mouse-button.enum';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { Tool } from './tool';

export abstract class ShapeTool extends Tool {
    width: number;
    height: number;
    shiftDown: boolean = false;
    escapeDown: boolean = false;
    radius: Vec2;
    pathStart: Vec2;
    currentMousePosition: Vec2;
    dx: number;
    dy: number;

    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.pathStart = { x: 0, y: 0 };
        this.mouseDownCoord = { x: 0, y: 0 };
        this.currentMousePosition = { x: 0, y: 0 };
        this.toolProperties = new BasicShapeProperties();
    }

    setThickness(value: number | null): void {
        value = value === null ? 1 : value;
        this.drawingService.setThickness(value);
        this.toolProperties.thickness = value;
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        if (this.mouseDown) {
            this.pathStart = this.getPositionFromMouse(event);
            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.currentMousePosition = this.getPositionFromMouse(event);
        }
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            this.currentMousePosition = this.getPositionFromMouse(event);
            this.drawPreview();
        }
    }

    onMouseUp(event: MouseEvent): Tool | undefined {
        this.currentMousePosition = this.getPositionFromMouse(event);
        if (this.mouseDown) {
            this.mouseDown = false;
            this.computeDimensions();
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.draw(this.drawingService.baseCtx);
        }

        return this;
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

    abstract draw(ctx: CanvasRenderingContext2D): void;

    setColors(primaryColor: Color, secondaryColor: Color): void {
        this.currentPrimaryColor = primaryColor;
        this.currentSecondaryColor = secondaryColor;
        this.drawingService.setFillColor(primaryColor.toStringRGBA());
        this.drawingService.setStrokeColor(secondaryColor.toStringRGBA());
    }

    resetContext(): void {
        this.mouseDown = false;
        this.shiftDown = false;
        this.escapeDown = false;
        this.setThickness(this.toolProperties.thickness);
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
    }

    signOf(num: number): number {
        return Math.abs(num) / num;
    }

    adjustThickness(): number {
        const shapeProperties = this.toolProperties as BasicShapeProperties;
        this.radius = { x: this.width / 2, y: this.height / 2 };

        const minRadius = Math.min(Math.abs(this.radius.x), Math.abs(this.radius.y));
        const maxThickness = this.toolProperties.thickness < minRadius ? this.toolProperties.thickness : minRadius;

        const thickness = shapeProperties.currentType === DrawingType.Fill ? 0 : maxThickness;
        this.dx = (thickness / 2) * this.signOf(this.width);
        this.dy = (thickness / 2) * this.signOf(this.height);
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
        this.width = this.width >= 0 ? smallestSide : -smallestSide;
        this.height = this.height >= 0 ? smallestSide : -smallestSide;
    }
}
