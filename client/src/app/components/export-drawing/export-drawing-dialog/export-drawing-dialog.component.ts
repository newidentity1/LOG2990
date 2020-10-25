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
    selectedFormat: string;
    selectedFilter: string;
    drawingTitle: string;

    constructor(public dialog: MatDialog, public drawingService: DrawingService) {
        this.selectedFormat = 'jpeg';
        this.selectedFilter = '0';
        this.drawingTitle = '';
    }

    ngAfterViewInit(): void {
        this.setImageUrl();
    }

    onFormatChange(): void {
        this.setImageUrl();
    }

    downloadImage(): void {
        this.setImageUrl();
        const title = this.drawingTitle.length > 0 ? this.drawingTitle : 'image';
        this.drawingPreviewContainer.nativeElement.download = title + '.' + this.selectedFormat;
        this.drawingPreviewContainer.nativeElement.click();
    }

    setImageUrl(): void {
        const format = 'image/' + this.selectedFormat;
        const imageUrl = this.drawingService.canvas.toDataURL(format);
        this.drawingPreview.nativeElement.src = imageUrl;
        this.drawingPreviewContainer.nativeElement.href = imageUrl;
    }
}
