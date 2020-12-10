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
    previewCircleCtx: CanvasRenderingContext2D;
    cursorCtx: CanvasRenderingContext2D;

    currentColor: Color;

    inCanvas: boolean = false;

    constructor(private colorPickerService: ColorPickerService, drawingService: DrawingService) {
        super(drawingService);
        this.name = 'Eyedropper';
        this.tooltip = 'Pipette(i)';
        this.iconName = 'colorize';
    }

    onMouseMove(event: MouseEvent): void {
        if (this.inCanvas) {
            this.drawPreview(event);
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.inCanvas) {
            if (event.button === MouseButton.Left) {
                this.colorPickerService.setPrimaryColor(this.currentColor);
            } else if (event.button === MouseButton.Right) {
                this.colorPickerService.setSecondaryColor(this.currentColor);
            }
        }
    }

    private drawPreview(event: MouseEvent): void {
        const mousePosition = this.getPositionFromMouse(event);
        this.currentColor = this.getColorFromPosition(mousePosition);

        // Code adapted from
        // https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Pixel_manipulation_with_canvas#Zooming_and_anti-aliasing

        const cappedXPos = Math.min(
            Math.max(0, mousePosition.x - CONSTANTS.EYEDROPPER_PREVIEW_SCALE_SIZE / 2),
            this.drawingService.canvas.width - CONSTANTS.EYEDROPPER_PREVIEW_SCALE_SIZE,
        );

        const cappedYPos = Math.min(
            Math.max(0, mousePosition.y - CONSTANTS.EYEDROPPER_PREVIEW_SCALE_SIZE / 2),
            this.drawingService.canvas.height - CONSTANTS.EYEDROPPER_PREVIEW_SCALE_SIZE,
        );

        this.drawScaledZone({ x: cappedXPos, y: cappedYPos } as Vec2);

        const cursorX = ((mousePosition.x - cappedXPos) * CONSTANTS.EYEDROPPER_PREVIEW_CANVAS_WIDTH) / CONSTANTS.EYEDROPPER_PREVIEW_SCALE_SIZE;
        const cursorY = ((mousePosition.y - cappedYPos) * CONSTANTS.EYEDROPPER_PREVIEW_CANVAS_HEIGHT) / CONSTANTS.EYEDROPPER_PREVIEW_SCALE_SIZE;
        const cursorPosition = { x: cursorX, y: cursorY } as Vec2;
        this.drawCursor(cursorPosition);
    }

    private drawScaledZone(startingPosition: Vec2): void {
        this.drawingService.clearCanvas(this.previewCircleCtx);

        this.previewCircleCtx.drawImage(
            this.drawingService.canvas,
            startingPosition.x,
            startingPosition.y,
            CONSTANTS.EYEDROPPER_PREVIEW_SCALE_SIZE,
            CONSTANTS.EYEDROPPER_PREVIEW_SCALE_SIZE,
            0,
            0,
            CONSTANTS.EYEDROPPER_PREVIEW_CANVAS_WIDTH,
            CONSTANTS.EYEDROPPER_PREVIEW_CANVAS_HEIGHT,
        );
    }

    private drawCursor(position: Vec2): void {
        this.drawingService.clearCanvas(this.cursorCtx);

        this.cursorCtx.lineWidth = 2;
        this.cursorCtx.strokeStyle = this.currentColor.toStringRGBA();
        this.cursorCtx.strokeRect(
            position.x - CONSTANTS.EYEDROPPER_PREVIEW_CURSOR_SIZE / 2,
            position.y - CONSTANTS.EYEDROPPER_PREVIEW_CURSOR_SIZE / 2,
            CONSTANTS.EYEDROPPER_PREVIEW_CURSOR_SIZE,
            CONSTANTS.EYEDROPPER_PREVIEW_CURSOR_SIZE,
        );
    }

    private getColorFromPosition(position: Vec2): Color {
        const imgData = this.drawingService.baseCtx.getImageData(position.x, position.y, 1, 1);
        const rgbData = imgData.data;
        const color: Color = new Color();
        color.red = rgbData[0];
        color.green = rgbData[1];
        color.blue = rgbData[2];
        color.opacity = rgbData[CONSTANTS.IMAGE_DATA_OPACITY_INDEX] / CONSTANTS.MAX_COLOR_VALUE;
        return color.opacity ? color : new Color(CONSTANTS.WHITE);
    }

    resetContext(): void {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
    }
}
