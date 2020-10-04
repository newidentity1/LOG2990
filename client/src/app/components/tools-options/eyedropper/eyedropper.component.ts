import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { EyedropperService } from '@app/services/tools/eyedropper/eyedropper.service';

@Component({
    selector: 'app-eyedropper-option',
    templateUrl: './eyedropper.component.html',
    styleUrls: ['./eyedropper.component.scss'],
})
export class EyedropperComponent implements AfterViewInit {
    @ViewChild('colorPreviewCanvas', { static: false }) colorPreviewCanvas: ElementRef<HTMLCanvasElement>;

    private colorPreviewCtx: CanvasRenderingContext2D;

    constructor(private eyedropperService: EyedropperService) {}

    ngAfterViewInit(): void {
        this.colorPreviewCtx = this.colorPreviewCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.eyedropperService.colorPreviewCtx = this.colorPreviewCtx;
    }
}
