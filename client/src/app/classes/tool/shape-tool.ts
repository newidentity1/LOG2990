import { Color } from '@app/classes/color/color';
import { Vec2 } from '../vec2';
import { Tool } from './tool';

export abstract class ShapeTool extends Tool {
    width: number;
    height: number;
    shiftDown: boolean = false;
    escapeDown: boolean = false;
    pathStart: Vec2;

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

    resetContext(): void {
        this.mouseDown = false;
        this.shiftDown = false;
        this.escapeDown = false;
        this.setThickness(this.toolProperties.thickness);
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
    }
}
