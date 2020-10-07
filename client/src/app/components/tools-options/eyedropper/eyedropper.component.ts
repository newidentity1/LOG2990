import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { EYEDROPPER_PREVIEW_CANVAS_HEIGHT, EYEDROPPER_PREVIEW_CANVAS_WIDTH } from '@app/constants/constants';
import { EyedropperService } from '@app/services/tools/eyedropper/eyedropper.service';

@Component({
    selector: 'app-eyedropper-option',
    templateUrl: './eyedropper.component.html',
    styleUrls: ['./eyedropper.component.scss'],
})
export class EyedropperComponent implements AfterViewInit {
    @ViewChild('colorPreviewCanvas', { static: false }) colorPreviewCanvas: ElementRef<HTMLCanvasElement>;
    @ViewChild('cursorCanvas', { static: false }) cursorCanvas: ElementRef<HTMLCanvasElement>;

    private colorPreviewCtx: CanvasRenderingContext2D;
    private cursorCtx: CanvasRenderingContext2D;

    constructor(private eyedropperService: EyedropperService) {}

    ngAfterViewInit(): void {
        this.colorPreviewCtx = this.colorPreviewCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.cursorCtx = this.cursorCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.eyedropperService.colorPreviewCtx = this.colorPreviewCtx;
        this.eyedropperService.cursorCtx = this.cursorCtx;
    }

    isInCanvas(): boolean {
        return this.eyedropperService.isInCanvas();
    }

    get width(): number {
        return EYEDROPPER_PREVIEW_CANVAS_WIDTH;
    }

    get height(): number {
        return EYEDROPPER_PREVIEW_CANVAS_HEIGHT;
    }
}
