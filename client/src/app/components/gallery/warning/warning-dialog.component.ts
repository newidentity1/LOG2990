import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Component({
    selector: 'app-warning-dialog',
    templateUrl: './warning-dialog.component.html',
    styleUrls: ['./warning-dialog.component.scss'],
})
export class WarningDialogComponent {
    constructor(public drawingService: DrawingService, public dialogRef: MatDialogRef<WarningDialogComponent>) {}

    deleteCanvas(): void {
        this.drawingService.clearCanvas(this.drawingService.baseCtx);
        this.dialogRef.close();
        this.drawingService.emitCreateNewDrawingEvent();
    }

    cancel(): void {
        this.dialogRef.close();
    }
}
