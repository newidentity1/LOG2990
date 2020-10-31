import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Component({
    selector: 'app-export-drawing-dialog',
    templateUrl: './export-drawing-dialog.component.html',
    styleUrls: ['./export-drawing-dialog.component.scss'],
})
export class ExportDrawingDialogComponent implements AfterViewInit {
    @ViewChild('drawingImageContainer') drawingImageContainer: ElementRef;
    @ViewChild('drawingImage') drawingImage: ElementRef; // Image of canvas, created from exportCanvas
    @ViewChild('previewCanvas') previewCanvas: ElementRef<HTMLCanvasElement>; // Visualisation canvas with filters
    @ViewChild('exportCanvas') exportCanvas: ElementRef<HTMLCanvasElement>; // Exported canvas, copy of real canvas with filters
    selectedFormat: string;
    selectedFilter: string;
    drawingTitle: string;
    previewCtx: CanvasRenderingContext2D;
    exportCtx: CanvasRenderingContext2D;

    constructor(public dialog: MatDialog, public drawingService: DrawingService) {
        this.selectedFormat = 'jpeg';
        this.selectedFilter = '0';
        this.drawingTitle = '';
    }

    ngAfterViewInit(): void {
        // Set clone context
        this.previewCtx = this.previewCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.exportCtx = this.exportCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;

        // Set Preview
        this.setInitialCanvasSize();
        this.previewCtx.globalCompositeOperation = 'destination-over';
        // this.whiteBackground();
        this.whiteBackground();
        this.previewCtx.globalCompositeOperation = 'source-over';

        // this.exportCtx.globalCompositeOperation = 'destination-over';
        // this.whiteBackground();
        // this.exportCtx.globalCompositeOperation = 'source-over';

        this.setPreviewFilter();
        this.setImageUrl();
    }

    setInitialCanvasSize(): void {
        this.previewCanvas.nativeElement.width = 800;
        this.previewCanvas.nativeElement.height = 400;
        this.exportCanvas.nativeElement.width = this.drawingService.canvas.width;
        this.exportCanvas.nativeElement.height = this.drawingService.canvas.height;
    }

    whiteBackground(): void {
        this.previewCtx.fillStyle = '#FFFFFF';
        this.previewCtx.fillRect(0, 0, this.previewCanvas.nativeElement.width, this.previewCanvas.nativeElement.height);
        this.previewCtx.fillStyle = '#000000';
    }

    whiteBackground1(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.fillStyle = '#000000';
    }

    whiteBackground2(): void {
        this.exportCtx.fillStyle = '#FFFFFF';
        this.exportCtx.fillRect(0, 0, this.exportCanvas.nativeElement.width, this.exportCanvas.nativeElement.height);
        this.exportCtx.fillStyle = '#000000';
    }

    onFormatChange(): void {
        this.setImageUrl();
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
            800,
            400,
        );
    }
    // Sets filters on the preview
    setPreviewFilter(): void {
        switch (this.selectedFilter) {
            case '0':
                this.previewCtx.filter = 'none';
                this.whiteBackground();
                // this.whiteBackground1(previewCtx);
                this.drawPreviewCanvas();
                break;
            case '1':
                this.previewCtx.filter = 'blur(7px)';
                this.whiteBackground();
                // this.whiteBackground1(previewCtx);
                this.drawPreviewCanvas();
                this.previewCtx.filter = 'none';
                break;
            case '2':
                this.previewCtx.filter = 'contrast(1.4) sepia(1)';
                this.whiteBackground();
                this.drawPreviewCanvas();
                this.previewCtx.filter = 'none';
                break;
            case '3':
                this.previewCtx.filter = 'brightness(50%)';
                this.whiteBackground();
                this.drawPreviewCanvas();
                this.previewCtx.filter = 'none';
                break;
            case '4':
                this.previewCtx.filter = 'saturate(50%)';
                this.whiteBackground();
                this.drawPreviewCanvas();
                this.previewCtx.filter = 'none';
                break;
            case '5':
                this.previewCtx.filter = 'dropshadow(50%)';
                this.whiteBackground();
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
                this.whiteBackground2();
                this.exportCtx.drawImage(this.drawingService.canvas, 0, 0);
                break;
            case '1':
                this.exportCtx.filter = 'blur(7px)';
                this.whiteBackground2();
                this.exportCtx.drawImage(this.drawingService.canvas, 0, 0);
                this.exportCtx.filter = 'none';
                break;
            case '2':
                this.exportCtx.filter = 'contrast(1.4) sepia(1)';
                this.whiteBackground2();
                this.exportCtx.drawImage(this.drawingService.canvas, 0, 0);
                this.exportCtx.filter = 'none';
                break;
            case '3':
                this.exportCtx.filter = 'brightness(50%)';
                this.whiteBackground2();
                this.exportCtx.drawImage(this.drawingService.canvas, 0, 0);
                this.exportCtx.filter = 'none';
                break;
            case '4':
                this.exportCtx.filter = 'saturate(50%)';
                this.whiteBackground2();
                this.exportCtx.drawImage(this.drawingService.canvas, 0, 0);
                this.exportCtx.filter = 'none';
                break;
            case '5':
                this.exportCtx.filter = 'dropshadow(50%)';
                this.whiteBackground2();
                this.exportCtx.drawImage(this.drawingService.canvas, 0, 0);
                this.exportCtx.filter = 'none';
                break;
        }
    }

    downloadImage(): void {
        // RESET CANVAS BEFORE DOWNLOAD
        this.setExportFilter();
        this.setImageUrl();
        const title = this.drawingTitle.length > 0 ? this.drawingTitle : 'image';
        this.drawingImageContainer.nativeElement.download = title + '.' + this.selectedFormat;
        this.drawingImageContainer.nativeElement.click();
    }

    setImageUrl(): void {
        const format = 'image/' + this.selectedFormat;
        // this.setExportFilter();
        const imageUrl = this.exportCanvas.nativeElement.toDataURL(format);
        // const imageUrl = this.drawingService.canvas.toDataURL(format);
        this.drawingImage.nativeElement.src = imageUrl;
        this.drawingImageContainer.nativeElement.href = imageUrl;
    }
}
