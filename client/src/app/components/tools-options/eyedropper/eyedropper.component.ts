import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { EYEDROPPER_PREVIEW_CANVAS_HEIGHT, EYEDROPPER_PREVIEW_CANVAS_WIDTH } from '@app/constants/constants';
import { EyedropperService } from '@app/services/tools/eyedropper/eyedropper.service';

@Component({
    selector: 'app-eyedropper-option',
    templateUrl: './eyedropper.component.html',
    styleUrls: ['./eyedropper.component.scss'],
})
export class EyedropperComponent implements AfterViewInit {
    @ViewChild('previewCircleCanvas', { static: false }) previewCircleCanvas: ElementRef<HTMLCanvasElement>;
    @ViewChild('cursorCanvas', { static: false }) cursorCanvas: ElementRef<HTMLCanvasElement>;

    private previewCircleCtx: CanvasRenderingContext2D;
    private cursorCtx: CanvasRenderingContext2D;

    constructor(public eyedropperService: EyedropperService) {}

    ngAfterViewInit(): void {
        this.previewCircleCtx = this.previewCircleCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.cursorCtx = this.cursorCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.eyedropperService.previewCircleCtx = this.previewCircleCtx;
        this.eyedropperService.cursorCtx = this.cursorCtx;
    }

    get width(): number {
        return EYEDROPPER_PREVIEW_CANVAS_WIDTH;
    }

    get height(): number {
        return EYEDROPPER_PREVIEW_CANVAS_HEIGHT;
    }
}
