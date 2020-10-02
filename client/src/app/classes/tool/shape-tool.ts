import { Color } from '@app/classes/color/color';
import { Tool } from './tool';

export abstract class ShapeTool extends Tool {
    setColors(primaryColor: Color, secondaryColor: Color): void {
        this.drawingService.setFillColor(primaryColor.toStringRGBA());
        this.drawingService.setStrokeColor(secondaryColor.toStringRGBA());
    }
}
