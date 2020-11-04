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
    constructor(public drawingService: DrawingService, public dialogRef: MatDialogRef<WarningDialogComponent>) {}

    deleteCanvas(): void {
        const image = new Image();
        image.crossOrigin = '';
        image.src = WarningDialogComponent.drawing.url;
        image.onload = () => {
            const ctx = this.drawingService.canvas.getContext('2d') as CanvasRenderingContext2D;
            this.drawingService.clearCanvas(ctx as CanvasRenderingContext2D);
            this.drawingService.baseCtx.canvas.width = image.width;
            this.drawingService.baseCtx.canvas.height = image.height;
            this.drawingService.previewCtx.canvas.width = image.width;
            this.drawingService.previewCtx.canvas.height = image.height;
            ctx.drawImage(image, 0, 0);
            this.cancel();
        };
    }

    cancel(): void {
        this.dialogRef.close();
    }
}
