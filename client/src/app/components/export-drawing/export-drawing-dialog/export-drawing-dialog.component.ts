import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { BLUR_CONVERSION, HUE_CONVERSION, MAX_PREVIEW_SIZE } from '@app/constants/constants.ts';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Component({
    selector: 'app-export-drawing-dialog',
    templateUrl: './export-drawing-dialog.component.html',
    styleUrls: ['./export-drawing-dialog.component.scss'],
})
export class ExportDrawingDialogComponent implements AfterViewInit, OnInit {
    @ViewChild('drawingImageContainer') drawingImageContainer: ElementRef;
    @ViewChild('drawingImage') drawingImage: ElementRef; // Image of canvas, created from exportCanvas
    @ViewChild('previewCanvas') previewCanvas: ElementRef<HTMLCanvasElement>; // Visualisation canvas with filters
    @ViewChild('exportCanvas') exportCanvas: ElementRef<HTMLCanvasElement>; // Exported canvas, copy of real canvas with filters
    selectedFormat: string;
    selectedFilter: string;
    drawingTitle: string;
    previewCtx: CanvasRenderingContext2D;
    exportCtx: CanvasRenderingContext2D;

    // Slider
    percentageForm: FormControl;
    percentage: number;
    sliderIsVisible: boolean;
    sliderIsDisabled: boolean;

    constructor(public dialog: MatDialog, public drawingService: DrawingService) {
        this.selectedFormat = 'jpeg';
        this.selectedFilter = '0';
        this.drawingTitle = '';
        this.sliderIsVisible = false;
        this.sliderIsDisabled = true;
    }

    ngOnInit(): void {
        this.percentage = 1;
        this.percentageForm = new FormControl(this.percentage, [Validators.required]);
    }

    ngAfterViewInit(): void {
        // Set contexts
        this.previewCtx = this.previewCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.exportCtx = this.exportCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;

        // Set Canvas Sizes
        this.setInitialCanvasSize();
        // Draw first layer
        this.whiteBackground(this.previewCtx);
        this.whiteBackground(this.exportCtx);
        // Draw filter on preview canvas only
        this.setPreviewFilter();
        this.setImageUrl();
    }

    setInitialCanvasSize(): void {
        this.setPreviewSize();
        this.setExportSize();
    }

    setExportSize(): void {
        this.exportCanvas.nativeElement.width = this.drawingService.canvas.width;
        this.exportCanvas.nativeElement.height = this.drawingService.canvas.height;
    }

    // Sets proportions for preview canvas to avoid a distortion of the drawing
    setPreviewSize(): void {
        let ratio: number;
        ratio = this.drawingService.canvas.height / this.drawingService.canvas.width;

        // This logic will make sure the biggest possible size for any side is MAX_PREVIEW_SIZE

        if (this.drawingService.canvas.height > MAX_PREVIEW_SIZE && this.drawingService.canvas.width > MAX_PREVIEW_SIZE) {
            // take the biggest one of both, set and scale according to that one
            ratio > 1 ? (this.previewCanvas.nativeElement.height = MAX_PREVIEW_SIZE) : (this.previewCanvas.nativeElement.width = MAX_PREVIEW_SIZE);
            if (ratio > 1) {
                this.previewCanvas.nativeElement.width = this.previewCanvas.nativeElement.height / ratio;
            } else {
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

    whiteBackground(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.fillStyle = '#000000';
    }

    drawPreviewCanvas(): void {
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
    }

    // Function is called by slider
    setFilterPercentage(value: number): void {
        this.percentage = value;
        this.percentageForm.setValue(this.percentage);
        this.setPreviewFilter();
    }

    activeSlider(): void {
        switch (this.selectedFilter) {
            case '0':
            case '5':
            case '6':
            case '7':
                this.sliderIsVisible = false;
                this.sliderIsDisabled = true;
                break;
            case '1':
            case '2':
            case '3':
            case '4':
                this.sliderIsVisible = true;
                this.sliderIsDisabled = false;
                break;
        }
    }

    // Function is called by changing filter selection
    setPreviewFilter(): void {
        this.activeSlider();

        switch (this.selectedFilter) {
            case '0':
                this.previewCtx.filter = 'none';
                this.whiteBackground(this.previewCtx);
                this.drawPreviewCanvas();
                break;
            case '1':
                this.whiteBackground(this.previewCtx);
                this.previewCtx.filter = 'blur(' + this.percentage * BLUR_CONVERSION + 'px)';
                this.drawPreviewCanvas();
                this.previewCtx.filter = 'none';
                break;
            case '2':
                this.previewCtx.filter = 'brightness(' + this.percentage + ')';
                this.whiteBackground(this.previewCtx);
                this.drawPreviewCanvas();
                this.previewCtx.filter = 'none';
                break;
            case '3':
                this.previewCtx.filter = 'saturate(' + this.percentage + ')';
                this.whiteBackground(this.previewCtx);
                this.drawPreviewCanvas();
                this.previewCtx.filter = 'none';
                break;
            case '4':
                this.previewCtx.filter = 'hue-rotate(' + this.percentage * HUE_CONVERSION + 'deg)';
                this.whiteBackground(this.previewCtx);
                this.drawPreviewCanvas();
                this.previewCtx.filter = 'none';
                break;
            case '5':
                this.previewCtx.filter = 'contrast(1.4) sepia(1)';
                this.whiteBackground(this.previewCtx);
                this.drawPreviewCanvas();
                this.previewCtx.filter = 'none';
                break;
            case '6':
                this.whiteBackground(this.previewCtx);
                this.previewCtx.filter = 'invert(1)';
                this.drawPreviewCanvas();
                this.previewCtx.filter = 'none';
                break;
            case '7':
                this.previewCtx.filter = 'invert(1)';
                this.whiteBackground(this.previewCtx);
                this.drawPreviewCanvas();
                this.previewCtx.filter = 'none';
                break;
        }
    }

    // Sets filter on the exported canvas
    setExportFilter(): void {
        switch (this.selectedFilter) {
            case '0':
                this.exportCtx.filter = 'none';
                this.whiteBackground(this.exportCtx);
                this.exportCtx.drawImage(this.drawingService.canvas, 0, 0);
                break;
            case '1':
                this.exportCtx.filter = 'blur(' + this.percentage * BLUR_CONVERSION + 'px)';
                this.whiteBackground(this.exportCtx);
                this.exportCtx.drawImage(this.drawingService.canvas, 0, 0);
                this.exportCtx.filter = 'none';
                break;
            case '2':
                this.exportCtx.filter = 'brightness(' + this.percentage + ')';
                this.whiteBackground(this.exportCtx);
                this.exportCtx.drawImage(this.drawingService.canvas, 0, 0);
                this.exportCtx.filter = 'none';
                break;
            case '3':
                this.exportCtx.filter = 'saturate(' + this.percentage + ')';
                this.whiteBackground(this.exportCtx);
                this.exportCtx.drawImage(this.drawingService.canvas, 0, 0);
                this.exportCtx.filter = 'none';
                break;
            case '4':
                this.exportCtx.filter = 'hue-rotate(' + this.percentage * HUE_CONVERSION + 'deg)';
                this.whiteBackground(this.exportCtx);
                this.exportCtx.drawImage(this.drawingService.canvas, 0, 0);
                this.exportCtx.filter = 'none';
                break;
            case '5':
                this.exportCtx.filter = 'contrast(1.4) sepia(1)';
                this.whiteBackground(this.exportCtx);
                this.exportCtx.drawImage(this.drawingService.canvas, 0, 0);
                this.exportCtx.filter = 'none';
                break;
            case '6':
                this.whiteBackground(this.exportCtx);
                this.exportCtx.filter = 'invert(1)';
                this.exportCtx.drawImage(this.drawingService.canvas, 0, 0);
                this.exportCtx.filter = 'none';
                break;
            case '7':
                this.exportCtx.filter = 'invert(1)';
                this.whiteBackground(this.exportCtx);
                this.exportCtx.drawImage(this.drawingService.canvas, 0, 0);
                this.exportCtx.filter = 'none';
                break;
        }
    }

    setImageUrl(): void {
        const format = 'image/' + this.selectedFormat;
        const imageUrl = this.exportCanvas.nativeElement.toDataURL(format);
        this.drawingImage.nativeElement.src = imageUrl;
        this.drawingImageContainer.nativeElement.href = imageUrl;
    }

    onFormatChange(): void {
        this.setImageUrl();
    }

    // When user completed changes, the export canvas is drawn and image is downloaded
    downloadImage(): void {
        this.setExportFilter();
        this.setImageUrl();
        const title = this.drawingTitle.length > 0 ? this.drawingTitle : 'image';
        this.drawingImageContainer.nativeElement.download = title + '.' + this.selectedFormat;
        this.drawingImageContainer.nativeElement.click();
        // Close export window, once everything is done
        this.dialog.closeAll();
    }
}
