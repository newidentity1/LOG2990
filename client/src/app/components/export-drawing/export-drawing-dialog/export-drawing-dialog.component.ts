import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DrawingService } from '@app/services/drawing/drawing.service';
import {
    CANVAS_MARGIN_LEFT,
    CANVAS_MARGIN_TOP,
    CANVAS_MIN_HEIGHT,
    CANVAS_MIN_WIDTH,
    DEFAULT_HEIGHT,
    DEFAULT_WIDTH,
    PREVIEW_CANVAS_HEIGHT,
    PREVIEW_CANVAS_WIDTH,
    SELECTION_CONTROL_POINT_SIZE,
} from '@app/constants/constants';

@Component({
    selector: 'app-export-drawing-dialog',
    templateUrl: './export-drawing-dialog.component.html',
    styleUrls: ['./export-drawing-dialog.component.scss'],
})
export class ExportDrawingDialogComponent implements AfterViewInit {
    @ViewChild('drawingPreviewContainer') drawingPreviewContainer: ElementRef;
    @ViewChild('drawingPreview') drawingPreview: ElementRef;
    @ViewChild('cloneCanvas') cloneCanvas: ElementRef<HTMLCanvasElement>;
    selectedFormat: string;
    selectedFilter: string;
    drawingTitle: string;
    cloneCtx: CanvasRenderingContext2D;

    constructor(public dialog: MatDialog, public drawingService: DrawingService) {
        this.selectedFormat = 'jpeg';
        this.selectedFilter = '0';
        this.drawingTitle = '';
    }

    ngAfterViewInit(): void {
        // Set clone context
        this.cloneCtx = this.cloneCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;

        // Set Preview
        this.setInitialCanvasSize();
        while (this.cloneCanvas.nativeElement.width > PREVIEW_CANVAS_WIDTH || this.cloneCanvas.nativeElement.height > PREVIEW_CANVAS_HEIGHT) {
            this.scalePreview();
        }
        // this.cloneCtx.globalCompositeOperation = 'destination-over';
        this.whiteBackground();
        // this.cloneCtx.globalCompositeOperation = 'source-over';

        this.setImageUrl();
    }

    setInitialCanvasSize(): void {
        this.cloneCanvas.nativeElement.width = this.drawingService.canvas.width;
        this.cloneCanvas.nativeElement.height = this.drawingService.canvas.height;
    }

    scalePreview(): void {
        this.cloneCtx.save();
        this.cloneCtx.translate(50, 50);
        this.cloneCtx.drawImage(this.cloneCanvas.nativeElement, 0, 0);
        this.cloneCtx.translate(100, 0);
        this.cloneCtx.scale(0.75, 0.75);
        this.cloneCtx.drawImage(this.cloneCanvas.nativeElement, 0, 0);

        this.cloneCtx.translate(133.333, 0);
        this.cloneCtx.scale(0.75, 0.75);
        this.cloneCtx.drawImage(this.cloneCanvas.nativeElement, 0, 0);
        this.cloneCtx.restore();
        this.cloneCanvas.nativeElement.height /= 2;
        this.cloneCanvas.nativeElement.width /= 2;
    }

    whiteBackground(): void {
        this.cloneCtx.fillStyle = '#FFFFFF';
        this.cloneCtx.fillRect(0, 0, this.cloneCanvas.nativeElement.width, this.cloneCanvas.nativeElement.height);
        this.cloneCtx.fillStyle = '#000000';
    }

    onFormatChange(): void {
        this.setImageUrl();
    }

    onFilterChange(): void {
        switch (this.selectedFilter) {
            case '0':
                this.cloneCtx.filter = 'none';
                this.whiteBackground();
                this.cloneCtx.drawImage(this.drawingService.canvas, 0, 0);
                break;
            case '1':
                this.cloneCtx.filter = 'blur(7px)';
                this.whiteBackground();
                this.cloneCtx.drawImage(this.drawingService.canvas, 0, 0);
                this.cloneCtx.filter = 'none';
                break;
            case '2':
                this.cloneCtx.filter = 'contrast(1.4) sepia(1)';
                this.whiteBackground();
                this.cloneCtx.drawImage(this.drawingService.canvas, 0, 0);
                this.cloneCtx.filter = 'none';
                break;
            case '3':
                this.cloneCtx.filter = 'brightness(50%)';
                this.whiteBackground();
                this.cloneCtx.drawImage(this.drawingService.canvas, 0, 0);
                this.cloneCtx.filter = 'none';
                break;
            case '4':
                this.cloneCtx.filter = 'saturate(50%)';
                this.whiteBackground();
                this.cloneCtx.drawImage(this.drawingService.canvas, 0, 0);
                this.cloneCtx.filter = 'none';
                break;
            case '5':
                this.cloneCtx.filter = 'dropshadow(50%)';
                this.whiteBackground();
                this.cloneCtx.drawImage(this.drawingService.canvas, 0, 0);
                this.cloneCtx.filter = 'none';
                break;
        }
    }

    downloadImage(): void {
        this.setImageUrl();
        const title = this.drawingTitle.length > 0 ? this.drawingTitle : 'image';
        this.drawingPreviewContainer.nativeElement.download = title + '.' + this.selectedFormat;
        this.drawingPreviewContainer.nativeElement.click();
    }

    setImageUrl(): void {
        const format = 'image/' + this.selectedFormat;
        this.onFilterChange();
        const imageUrl = this.cloneCanvas.nativeElement.toDataURL(format);
        // const imageUrl = this.drawingService.canvas.toDataURL(format);
        this.drawingPreview.nativeElement.src = imageUrl;
        this.drawingPreviewContainer.nativeElement.href = imageUrl;
    }
}
