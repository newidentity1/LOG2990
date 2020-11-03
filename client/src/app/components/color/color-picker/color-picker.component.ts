import { AfterViewInit, Component, ElementRef, HostListener, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Color } from '@app/classes/color/color';
import { Vec2 } from '@app/classes/vec2';
import * as CONSTANTS from '@app/constants/constants';
import { ColorPickerService } from '@app/services/color-picker/color-picker.service';

@Component({
    selector: 'app-color-picker',
    templateUrl: './color-picker.component.html',
    styleUrls: ['./color-picker.component.scss'],
})
export class ColorPickerComponent implements AfterViewInit {
    @ViewChild('colorPickerCanvas', { static: false }) colorCanvas: ElementRef<HTMLCanvasElement>;
    @ViewChild('cursorCanvas', { static: false }) cursorCanvas: ElementRef<HTMLCanvasElement>;

    private colorCanvasCtx: CanvasRenderingContext2D;
    private cursorCanvasCtx: CanvasRenderingContext2D;
    private canvasSize: Vec2 = { x: CONSTANTS.COLOR_PICKER_WIDTH, y: CONSTANTS.COLOR_PICKER_HEIGHT };

    constructor(
        private colorPickerService: ColorPickerService,
        public dialogRef: MatDialogRef<ColorPickerComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { isSecondaryColorPicker: boolean },
    ) {}

    ngAfterViewInit(): void {
        this.colorCanvasCtx = this.colorCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.cursorCanvasCtx = this.cursorCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.colorPickerService.colorCanvasCtx = this.colorCanvasCtx;
        this.colorPickerService.cursorCanvasCtx = this.cursorCanvasCtx;
        this.colorPickerService.canvas = this.colorCanvas.nativeElement;
        this.initColorPicker();
    }

    initColorPicker(): void {
        // Code retrieved from https://stackoverflow.com/a/60953966
        let gradient = this.colorCanvasCtx.createLinearGradient(0, 0, this.width, 0);
        gradient.addColorStop(0, '#ff0000');
        gradient.addColorStop(CONSTANTS.COLOR_PICKER_GRADIENT_FIRST_DIVISION / CONSTANTS.COLOR_PICKER_GRADIENT_DIVISIONS, '#ffff00');
        gradient.addColorStop(CONSTANTS.COLOR_PICKER_GRADIENT_SECOND_DIVISION / CONSTANTS.COLOR_PICKER_GRADIENT_DIVISIONS, '#00ff00');
        gradient.addColorStop(CONSTANTS.COLOR_PICKER_GRADIENT_THIRD_DIVISION / CONSTANTS.COLOR_PICKER_GRADIENT_DIVISIONS, '#00ffff');
        gradient.addColorStop(CONSTANTS.COLOR_PICKER_GRADIENT_FOURTH_DIVISION / CONSTANTS.COLOR_PICKER_GRADIENT_DIVISIONS, '#0000ff');
        gradient.addColorStop(CONSTANTS.COLOR_PICKER_GRADIENT_FIFTH_DIVISION / CONSTANTS.COLOR_PICKER_GRADIENT_DIVISIONS, '#ff00ff');
        gradient.addColorStop(1, '#ff0000');
        this.colorCanvasCtx.fillStyle = gradient;
        this.colorCanvasCtx.fillRect(0, 0, this.width, this.height);

        gradient = this.colorCanvasCtx.createLinearGradient(0, 0, 0, this.height);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(1 / 2, 'rgba(255, 255, 255, 0)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        this.colorCanvasCtx.fillStyle = gradient;
        this.colorCanvasCtx.fillRect(0, 0, this.width, this.height);

        gradient = this.colorCanvasCtx.createLinearGradient(0, 0, 0, this.height);
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
        gradient.addColorStop(1 / 2, 'rgba(0, 0, 0, 0)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 1)');
        this.colorCanvasCtx.fillStyle = gradient;
        this.colorCanvasCtx.fillRect(0, 0, this.width, this.height);
    }

    onMouseDown(event: MouseEvent): void {
        event.preventDefault();
        this.colorPickerService.onMouseDown(event);
    }

    onMouseMove(event: MouseEvent): void {
        this.colorPickerService.onMouseMove(event);
    }

    @HostListener('window:mouseup', ['$event'])
    onMouseUp(event: MouseEvent): void {
        this.colorPickerService.onMouseUp(event);
    }

    getCurrentColor(): Color {
        return this.colorPickerService.selectedColor;
    }

    getPreviousColor(): Color {
        return this.data.isSecondaryColorPicker ? this.colorPickerService.secondaryColor.getValue() : this.colorPickerService.primaryColor.getValue();
    }

    onDialogClose(): void {
        this.colorPickerService.confirmSelectedColor(this.data.isSecondaryColorPicker);
        this.dialogRef.close();
    }

    get width(): number {
        return this.canvasSize.x;
    }

    get height(): number {
        return this.canvasSize.y;
    }
}
