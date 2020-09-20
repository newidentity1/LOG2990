import { Color } from '@app/classes/color/color';
import { Tool } from '@app/classes/tool';

export class ShapeTool extends Tool {
    setColors(primaryColor: Color, secondaryColor: Color): void {
        this.drawingService.setFillColor(primaryColor.toStringRGBA());
        this.drawingService.setStrokeColor(secondaryColor.toStringRGBA());
    }
}
