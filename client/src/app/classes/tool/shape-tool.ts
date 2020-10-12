import { Color } from '@app/classes/color/color';
import { DrawingType } from '@app/enums/drawing-type.enum';
import { BasicShapeProperties } from '../tools-properties/basic-shape-properties';
import { Vec2 } from '../vec2';
import { Tool } from './tool';

export abstract class ShapeTool extends Tool {
    width: number;
    height: number;
    shiftDown: boolean = false;
    escapeDown: boolean = false;
    radius: Vec2;
    pathStart: Vec2;
    dx: number;
    dy: number;

    setThickness(value: number | null): void {
        value = value === null ? 1 : value;
        this.drawingService.setThickness(value);
        this.toolProperties.thickness = value;
    }

    setColors(primaryColor: Color, secondaryColor: Color): void {
        this.currentPrimaryColor = primaryColor;
        this.currentSecondaryColor = secondaryColor;
        this.drawingService.setFillColor(primaryColor.toStringRGBA());
        this.drawingService.setStrokeColor(secondaryColor.toStringRGBA());
    }

    setTypeDrawing(value: string): void {
        const shapeProperties = this.toolProperties as BasicShapeProperties;
        shapeProperties.currentType = value;
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
        const thickness =
            shapeProperties.currentType === DrawingType.Fill
                ? 0
                : this.toolProperties.thickness < Math.min(Math.abs(this.radius.x), Math.abs(this.radius.y))
                ? this.toolProperties.thickness
                : Math.min(Math.abs(this.radius.x), Math.abs(this.radius.y));
        this.dx = (thickness / 2) * this.signOf(this.width);
        this.dy = (thickness / 2) * this.signOf(this.height);
        this.radius.x -= this.dx;
        this.radius.y -= this.dy;
        this.drawingService.setThickness(thickness);
        return thickness;
    }
}
