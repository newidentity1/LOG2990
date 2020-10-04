import { Injectable } from '@angular/core';
import { Color } from '@app/classes/color/color';
import { Tool } from '@app/classes/tool/tool';
import { Vec2 } from '@app/classes/vec2';
import * as CONSTANTS from '@app/constants/constants';
import { MouseButton } from '@app/enums/mouse-button.enum';
import { ColorPickerService } from '@app/services/color-picker/color-picker.service';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class EyedropperService extends Tool {
    colorPreviewCtx: CanvasRenderingContext2D;

    currentColor: Color;

    constructor(private colorPickerService: ColorPickerService, drawingService: DrawingService) {
        super(drawingService);
        this.name = 'Eyedropper';
        this.tooltip = 'Pipette(I)';
        this.iconName = 'colorize';
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        if (this.mouseDown) {
            this.drawPreview(event);
        }
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            this.drawPreview(event);
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            this.colorPickerService.setPrimaryColor(this.currentColor);
        }
        this.mouseDown = false;
    }

    drawPreview(event: MouseEvent): void {
        const mousePosition = this.getPositionFromMouse(event);
        this.currentColor = this.getColorFromPosition(mousePosition);

        this.drawingService.clearCanvas(this.colorPreviewCtx);

        // Code adapted from
        // https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Pixel_manipulation_with_canvas#Zooming_and_anti-aliasing
        this.colorPreviewCtx.drawImage(
            this.drawingService.canvas,
            Math.min(
                Math.max(0, mousePosition.x - CONSTANTS.EYEDROPPER_PREVIEW_SCALE_SIZE / 2),
                this.drawingService.canvas.width - CONSTANTS.EYEDROPPER_PREVIEW_SCALE_SIZE,
            ),
            Math.min(
                Math.max(0, mousePosition.y - CONSTANTS.EYEDROPPER_PREVIEW_SCALE_SIZE / 2),
                this.drawingService.canvas.height - CONSTANTS.EYEDROPPER_PREVIEW_SCALE_SIZE,
            ),
            CONSTANTS.EYEDROPPER_PREVIEW_SCALE_SIZE,
            CONSTANTS.EYEDROPPER_PREVIEW_SCALE_SIZE,
            0,
            0,
            CONSTANTS.EYEDROPPER_PREVIEW_CANVAS_WIDTH,
            CONSTANTS.EYEDROPPER_PREVIEW_CANVAS_HEIGHT,
        );
    }

    private getColorFromPosition(position: Vec2): Color {
        const imgData = this.drawingService.baseCtx.getImageData(position.x, position.y, 1, 1);
        const rgbData = imgData.data;
        const color: Color = new Color();
        color.red = rgbData[0];
        color.green = rgbData[1];
        color.blue = rgbData[2];
        color.opacity = rgbData[CONSTANTS.IMAGE_DATA_OPACITY_INDEX];

        return color;
    }

    resetContext(): void {
        // does nothing
    }
}
