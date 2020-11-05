import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { Drawing } from '@common/communication/drawing';

@Component({
    selector: 'app-warning-dialog',
    templateUrl: './warning-dialog.component.html',
    styleUrls: ['./warning-dialog.component.scss'],
})
export class WarningDialogComponent {
    static drawing: Drawing;
    private image = new Image();
    constructor(public drawingService: DrawingService, public dialogRef: MatDialogRef<WarningDialogComponent>) {}

    deleteCanvas(): void {
        this.image.crossOrigin = '';
        this.image.src = WarningDialogComponent.drawing.url;
        this.image.onload = () => {
            this.loadImage();
        };
    }

    loadImage(): void {
        const ctx = this.drawingService.canvas.getContext('2d') as CanvasRenderingContext2D;
        this.drawingService.clearCanvas(ctx as CanvasRenderingContext2D);
        this.drawingService.baseCtx.canvas.width = this.image.width;
        this.drawingService.baseCtx.canvas.height = this.image.height;
        this.drawingService.previewCtx.canvas.width = this.image.width;
        this.drawingService.previewCtx.canvas.height = this.image.height;
        ctx.drawImage(this.image, 0, 0);
        this.cancel();
    }

    cancel(): void {
        this.dialogRef.close();
    }
}
