import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { BLUR_CONVERSION, HUE_CONVERSION, MAX_PREVIEW_SIZE } from '@app/constants/constants.ts';
import { ExportFilterType } from '@app/enums/export-filter.enum';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Component({
    selector: 'app-export-drawing-dialog',
    templateUrl: './export-drawing-dialog.component.html',
    styleUrls: ['./export-drawing-dialog.component.scss'],
})
export class ExportDrawingDialogComponent implements AfterViewInit, OnInit {
    @ViewChild('drawingImageContainer') drawingImageContainer: ElementRef;
    @ViewChild('previewCanvas') previewCanvas: ElementRef<HTMLCanvasElement>; // Visualisation canvas with filters
    @ViewChild('exportCanvas') exportCanvas: ElementRef<HTMLCanvasElement>; // Exported canvas, copy of real canvas with filters
    selectedFormat: string;
    selectedFilter: ExportFilterType;
    typeExportFilter: typeof ExportFilterType = ExportFilterType;
    drawingTitle: string;
    previewCtx: CanvasRenderingContext2D;
    exportCtx: CanvasRenderingContext2D;
    private exportFilter: string;

    // Slider
    percentage: number;
    sliderIsVisible: boolean;

    constructor(public dialogRef: MatDialogRef<ExportDrawingDialogComponent>, public drawingService: DrawingService) {
        this.selectedFormat = 'jpeg';
        this.selectedFilter = ExportFilterType.None;
        this.drawingTitle = '';
        this.sliderIsVisible = false;
        this.exportFilter = 'none';
    }

    ngOnInit(): void {
        this.percentage = 1;
    }

    ngAfterViewInit(): void {
        // Set contexts
        this.previewCtx = this.previewCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.exportCtx = this.exportCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;

        // Set Canvas Sizes
        this.setInitialCanvasSize();
        // Draw first layer
        this.setWhiteBackground(this.previewCtx);
        this.setWhiteBackground(this.exportCtx);
        // Draw filter on preview canvas only
        this.setPreviewFilter();
        this.setImageUrl();
    }

    private setInitialCanvasSize(): void {
        this.setPreviewSize();
        this.setExportSize();
    }

    private setExportSize(): void {
        this.exportCanvas.nativeElement.width = this.drawingService.canvas.width;
        this.exportCanvas.nativeElement.height = this.drawingService.canvas.height;
    }

    private setPreviewSize(): void {
        let ratio: number;
        ratio = this.drawingService.canvas.height / this.drawingService.canvas.width;

        // This logic will make sure the biggest possible size for any side is MAX_PREVIEW_SIZE

        if (this.drawingService.canvas.height > MAX_PREVIEW_SIZE && this.drawingService.canvas.width > MAX_PREVIEW_SIZE) {
            // take the biggest one of both, set and scale according to that one
            if (ratio > 1) {
                this.previewCanvas.nativeElement.height = MAX_PREVIEW_SIZE;
                this.previewCanvas.nativeElement.width = this.previewCanvas.nativeElement.height / ratio;
            } else {
                this.previewCanvas.nativeElement.width = MAX_PREVIEW_SIZE;
                this.previewCanvas.nativeElement.height = this.previewCanvas.nativeElement.width * ratio;
            }
        } else if (this.drawingService.canvas.width > MAX_PREVIEW_SIZE) {
            // set width to 800 and scale according to width
            this.previewCanvas.nativeElement.width = MAX_PREVIEW_SIZE;
            this.previewCanvas.nativeElement.height = this.previewCanvas.nativeElement.width * ratio;
        } else if (this.drawingService.canvas.height > MAX_PREVIEW_SIZE) {
            // set height to 800 and scale according to height
            this.previewCanvas.nativeElement.height = MAX_PREVIEW_SIZE;
            this.previewCanvas.nativeElement.width = this.previewCanvas.nativeElement.height / ratio;
        } else {
            // Size of canvas is small enough to display without rescaling
            this.previewCanvas.nativeElement.width = this.drawingService.canvas.width;
            this.previewCanvas.nativeElement.height = this.drawingService.canvas.height;
        }
    }

    private setWhiteBackground(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.fillStyle = '#000000';
    }

    // Function is called by slider
    setFilterPercentage(value: number): void {
        this.percentage = value;
        this.setPreviewFilter();
    }

    // Function is called by changing filter selection
    setPreviewFilter(): void {
        this.sliderIsVisible = true;

        switch (this.selectedFilter) {
            case ExportFilterType.None:
                this.previewCtx.filter = 'none';
                this.sliderIsVisible = false;
                break;
            case ExportFilterType.Blur:
                this.previewCtx.filter = 'blur(' + this.percentage * BLUR_CONVERSION + 'px)';
                break;
            case ExportFilterType.Brightness:
                this.previewCtx.filter = 'brightness(' + this.percentage + ')';
                break;
            case ExportFilterType.Saturation:
                this.previewCtx.filter = 'saturate(' + this.percentage + ')';
                break;
            case ExportFilterType.Hue:
                this.previewCtx.filter = 'hue-rotate(' + this.percentage * HUE_CONVERSION + 'deg)';
                break;
            case ExportFilterType.Sepia:
                this.previewCtx.filter = 'contrast(1.4) sepia(1)';
                this.sliderIsVisible = false;
                break;
            case ExportFilterType.Invert:
                this.previewCtx.filter = 'invert(1)';
                this.sliderIsVisible = false;
                break;
        }
        this.setWhiteBackground(this.previewCtx);
        this.previewCtx.drawImage(
            this.drawingService.canvas,
            0,
            0,
            this.drawingService.canvas.width,
            this.drawingService.canvas.height,
            0,
            0,
            this.previewCanvas.nativeElement.width,
            this.previewCanvas.nativeElement.height, // Stretches image to fit preview
        );
        this.exportFilter = this.previewCtx.filter;
        this.previewCtx.filter = 'none';
    }

    private setImageUrl(): void {
        const format = 'image/' + this.selectedFormat;
        const imageUrl = this.exportCanvas.nativeElement.toDataURL(format);
        this.drawingImageContainer.nativeElement.href = imageUrl;
    }

    onFormatChange(): void {
        this.setImageUrl();
    }

    // When user completed changes, the export canvas is drawn and image is downloaded
    downloadImage(): void {
        // Sets filter on the exported canvas
        this.exportCtx.filter = this.exportFilter;
        this.setWhiteBackground(this.exportCtx);
        this.exportCtx.drawImage(this.drawingService.canvas, 0, 0);
        this.exportCtx.filter = 'none';

        this.setImageUrl();
        const title = this.drawingTitle.length > 0 ? this.drawingTitle : 'image';
        this.drawingImageContainer.nativeElement.download = title + '.' + this.selectedFormat;
        this.drawingImageContainer.nativeElement.click();
        this.dialogRef.close();
    }

    keepOriginalOrder(): number {
        return 0;
    }
}
