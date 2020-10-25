import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ExportDrawingService } from '@app/services/export-drawing/export-drawing.service';

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

    constructor(public dialog: MatDialog, public exportDrawingService: ExportDrawingService) {
        this.selectedFormat = '.jpg';
        this.selectedFilter = '0';
    }

    ngAfterViewInit(): void {
        const imageUrl = this.exportDrawingService.getCanvasImageUrl();
        this.drawingPreview.nativeElement.src = imageUrl;
        this.drawingPreviewContainer.nativeElement.href = imageUrl;
    }

    downloadImage(): void {
        // TODO changer 'test' pour le nom choisit par l'usager
        this.drawingPreviewContainer.nativeElement.download = 'test' + this.selectedFormat;
        this.drawingPreviewContainer.nativeElement.click();
    }
}
