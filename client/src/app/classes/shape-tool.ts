import { Color } from './color/color';
import { Tool } from './tool';

export class ShapeTool extends Tool {
    setColors(primaryColor: Color, secondaryColor: Color): void {
        this.drawingService.setFillColor(primaryColor.toStringRGBA());
        this.drawingService.setStrokeColor(secondaryColor.toStringRGBA());
    }
}
