import { Injectable } from '@angular/core';
import { Color } from '@app/classes/color/color';
import { Tool } from '@app/classes/tool/tool';
import { Vec2 } from '@app/classes/vec2';
import * as CONSTANTS from '@app/constants/constants';
import { MouseButton } from '@app/enums/mouse-button.enum';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ColorPickerService extends Tool {
    colorCanvasCtx: CanvasRenderingContext2D;
    cursorCanvasCtx: CanvasRenderingContext2D;
    canvas: HTMLCanvasElement;

    primaryColor: BehaviorSubject<Color> = new BehaviorSubject<Color>(new Color(CONSTANTS.BLACK));
    secondaryColor: BehaviorSubject<Color> = new BehaviorSubject<Color>(new Color(CONSTANTS.WHITE));
    selectedColor: Color = new Color(CONSTANTS.BLACK);
    recentColors: Color[] = [];

    constructor(protected drawingService: DrawingService) {
        super(drawingService);
        for (let i = 0; i < CONSTANTS.MAX_RECENT_COLORS_SIZE; i++) {
            this.recentColors.push(new Color(CONSTANTS.BLACK));
        }
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

    onMouseUp(event: MouseEvent): Tool {
        this.mouseDown = false;
        return this;
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
            this.secondaryColor.next(this.selectedColor.clone());
        } else {
            this.primaryColor.next(this.selectedColor.clone());
        }
        this.addToRecentColors(new Color(this.selectedColor.hex));
    }

    resetSelectedColor(isSecondaryColorPicker: boolean): void {
        this.selectedColor = isSecondaryColorPicker ? this.secondaryColor.getValue().clone() : this.primaryColor.getValue().clone();
    }

    swapColors(): void {
        const tempColor = this.primaryColor.getValue();
        this.primaryColor.next(this.secondaryColor.getValue());
        this.secondaryColor.next(tempColor);
    }

    applyRecentColor(color: Color, isSecondaryColor: boolean): void {
        if (isSecondaryColor) {
            this.secondaryColor.next(new Color(color.hex, this.secondaryColor.getValue().opacity));
        } else {
            this.primaryColor.next(new Color(color.hex, this.primaryColor.getValue().opacity));
        }
    }

    setPrimaryColor(newColor: Color): void {
        this.primaryColor.next(newColor);
    }

    setSecondaryColor(newColor: Color): void {
        this.secondaryColor.next(newColor);
    }

    private drawCursor(ctx: CanvasRenderingContext2D, position: Vec2): void {
        ctx.strokeStyle = '#' + this.selectedColor.hex;
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
        if (!this.recentColors.some((recentColor) => recentColor.hex === color.hex)) {
            if (this.recentColors.length === CONSTANTS.MAX_RECENT_COLORS_SIZE) {
                this.recentColors.pop();
            }
            this.recentColors.unshift(color);
        }
    }
}
