import { Injectable } from '@angular/core';
import { Color } from '@app/classes/color/color';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import * as CONSTANTS from '@app/constants/constants';
import { MouseButton } from '@app/enums/mouse-button.enum';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ToolbarService } from '@app/services/toolbar/toolbar.service';

@Injectable({
    providedIn: 'root',
})
export class ColorPickerService extends Tool {
    // TODO: do not extend from Tool?

    colorCanvasCtx: CanvasRenderingContext2D;
    cursorCanvasCtx: CanvasRenderingContext2D;

    primaryColor: Color;
    secondaryColor: Color;
    selectedColor: Color;
    recentColors: Color[];

    constructor(protected drawingService: DrawingService, private toolbarService: ToolbarService) {
        super(drawingService);
        this.primaryColor = new Color(CONSTANTS.BLACK);
        this.secondaryColor = new Color(CONSTANTS.WHITE);
        this.selectedColor = new Color(CONSTANTS.BLACK);
        this.recentColors = [];
        this.updateDrawingColor();
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        if (this.mouseDown) {
            this.updateSelectedColor(event);
        }
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            this.updateSelectedColor(event);
        }
    }

    onMouseUp(event: MouseEvent): void {
        this.mouseDown = false;
    }

    onMouseLeave(event: MouseEvent): void {
        this.mouseDown = false;
    }

    setRedHex(hex: string): void {
        this.selectedColor.setRedHex(hex);
    }

    setGreenHex(hex: string): void {
        this.selectedColor.setGreenHex(hex);
    }

    setBlueHex(hex: string): void {
        this.selectedColor.setBlueHex(hex);
    }

    confirmSelectedColor(isSecondaryColorPicker: boolean): void {
        if (isSecondaryColorPicker) {
            if (this.selectedColor.hex !== this.secondaryColor.hex) {
                this.addToRecentColors(new Color(this.selectedColor.hex));
            }
            this.secondaryColor = new Color(this.selectedColor.hex, this.selectedColor.opacity);
        } else {
            if (this.selectedColor.hex !== this.primaryColor.hex) {
                this.addToRecentColors(new Color(this.selectedColor.hex));
            }
            this.primaryColor = new Color(this.selectedColor.hex, this.selectedColor.opacity);
        }
        this.updateDrawingColor();
    }

    resetSelectedColor(isSecondaryColorPicker: boolean): void {
        if (isSecondaryColorPicker) {
            this.selectedColor = new Color(this.secondaryColor.hex, this.secondaryColor.opacity);
        } else {
            this.selectedColor = new Color(this.primaryColor.hex, this.primaryColor.opacity);
        }
    }

    swapColors(): void {
        [this.primaryColor, this.secondaryColor] = [this.secondaryColor, this.primaryColor];
        this.updateDrawingColor();
    }

    applyRecentColor(color: Color, isSecondaryColor: boolean): void {
        if (isSecondaryColor) {
            this.secondaryColor.hex = color.hex;
        } else {
            this.primaryColor.hex = color.hex;
            this.updateDrawingColor();
        }
    }

    updateDrawingColor(): void {
        this.toolbarService.setColors(this.primaryColor, this.secondaryColor);
    }

    private drawCursor(ctx: CanvasRenderingContext2D, position: Vec2): void {
        ctx.strokeStyle = this.selectedColor.toStringRGBA();
        ctx.beginPath();
        this.drawingService.clearCanvas(ctx);
        ctx.lineWidth = 2;
        ctx.arc(position.x, position.y, CONSTANTS.COLOR_PICKER_CURSOR_RADIUS, 0, Math.PI * 2);
        ctx.stroke();
    }

    private updateSelectedColor(event: MouseEvent): void {
        const mousePosition: Vec2 = this.getPositionFromMouse(event);
        this.selectedColor = this.getColorFromPosition(mousePosition);
        this.drawCursor(this.cursorCanvasCtx, mousePosition);
    }

    private getColorFromPosition(position: Vec2): Color {
        const imgData = this.colorCanvasCtx.getImageData(position.x, position.y, 1, 1);
        const rgbData = imgData.data;
        const color: Color = new Color();
        color.red = rgbData[0];
        color.green = rgbData[1];
        color.blue = rgbData[2];
        color.opacity = this.selectedColor.opacity;

        return color;
    }

    private addToRecentColors(color: Color): void {
        if (this.recentColors.length === CONSTANTS.MAX_RECENT_COLORS_SIZE) {
            this.recentColors.shift();
        }
        this.recentColors.push(color);
    }
}
