import { Component, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { Drawing } from '@common/communication/drawing';

@Component({
    selector: 'app-warning-dialog',
    templateUrl: './warning-dialog.component.html',
    styleUrls: ['./warning-dialog.component.scss'],
})
export class WarningDialogComponent {
    private image: HTMLImageElement = new Image();
    constructor(public drawingService: DrawingService, public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: { drawing: Drawing }) {}

    deleteCanvas(): void {
        this.image.crossOrigin = '';
        this.image.src = this.data.drawing.url;
        this.image.onload = () => {
            this.loadImage();
        };
    }

    loadImage(): void {
        this.drawingService.clearCanvas(this.drawingService.baseCtx);
        this.drawingService.baseCtx.canvas.width = this.image.width;
        this.drawingService.baseCtx.canvas.height = this.image.height;
        this.drawingService.previewCtx.canvas.width = this.image.width;
        this.drawingService.previewCtx.canvas.height = this.image.height;
        this.drawingService.baseCtx.drawImage(this.image, 0, 0);
        this.cancel();
    }

    cancel(): void {
        this.dialog.closeAll();
    }
}
