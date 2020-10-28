import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DrawingService } from '@app/services/drawing/drawing.service';

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
        this.setImageUrl();
        // TODO
        // this.cloneCtx = this.cloneCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        // this.cloneCanvas.nativeElement.height = this.drawingService.canvas.height;
        // this.cloneCanvas.nativeElement.width = this.drawingService.canvas.width;
    }

    onFormatChange(): void {
        this.setImageUrl();
    }

    onFilterChange(): void {
        this.cloneCtx = this.cloneCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;

        switch (this.selectedFilter) {
            case '0':
                this.cloneCtx.filter = 'none';
                this.cloneCtx.drawImage(this.drawingService.canvas, 0, 0);
                break;
            case '1':
                this.cloneCtx.filter = 'blur(7px)';
                this.cloneCtx.drawImage(this.drawingService.canvas, 0, 0);
                this.cloneCtx.filter = 'none';
                break;
            case '2':
                this.cloneCtx.filter = 'sepia(100%)';
                this.cloneCtx.drawImage(this.drawingService.canvas, 0, 0);
                this.cloneCtx.filter = 'none';
                break;
            case '3':
                this.cloneCtx.filter = 'saturate(100%)';
                this.cloneCtx.drawImage(this.drawingService.canvas, 0, 0);
                this.cloneCtx.filter = 'none';
                break;
            case '4':
                this.cloneCtx.filter = 'sepia(0.5)';
                this.cloneCtx.drawImage(this.drawingService.canvas, 0, 0);
                this.cloneCtx.filter = 'none';
                break;
            case '5':
                this.cloneCtx.filter = 'sepia(0.5)';
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
