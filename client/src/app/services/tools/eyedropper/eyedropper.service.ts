import { Injectable } from '@angular/core';
import { Color } from '@app/classes/color/color';
import { Tool } from '@app/classes/tool/tool';
import { Vec2 } from '@app/classes/vec2';
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
            const mousePosition = this.getPositionFromMouse(event);

            this.currentColor = this.getColorFromPosition(mousePosition);

            this.drawingService.clearCanvas(this.colorPreviewCtx);
            this.colorPreviewCtx.drawImage(
                this.drawingService.canvas,
                Math.min(Math.max(0, mousePosition.x - 5), this.drawingService.canvas.width - 10),
                Math.min(Math.max(0, mousePosition.y - 5), this.drawingService.canvas.height - 10),
                10,
                10,
                0,
                0,
                200,
                200,
            );
        }
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.currentColor = this.getColorFromPosition(mousePosition);

            this.drawingService.clearCanvas(this.colorPreviewCtx);
            this.colorPreviewCtx.drawImage(
                this.drawingService.canvas,
                Math.min(Math.max(0, mousePosition.x - 5), this.drawingService.canvas.width - 10),
                Math.min(Math.max(0, mousePosition.y - 5), this.drawingService.canvas.height - 10),
                50,
                50,
                0,
                0,
                200,
                200,
            );
        }
    }

    onMouseUp(event: MouseEvent): void {
        console.log(event);
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            const color = this.getColorFromPosition(mousePosition);
            this.colorPickerService.setPrimaryColor(color);
        }
        this.mouseDown = false;
    }

    private getColorFromPosition(position: Vec2): Color {
        const imgData = this.drawingService.baseCtx.getImageData(position.x, position.y, 1, 1);
        const rgbData = imgData.data;
        const color: Color = new Color();
        color.red = rgbData[0];
        color.green = rgbData[1];
        color.blue = rgbData[2];
        color.opacity = rgbData[3];

        return color;
    }

    resetContext(): void {
        // does nothing
    }
}
