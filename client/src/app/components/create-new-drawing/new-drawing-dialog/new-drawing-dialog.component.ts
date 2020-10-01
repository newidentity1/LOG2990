import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { DrawingService } from '@app/services/drawing/drawing.service';

// NewDrawingDialogComponent is the pop up window that corresponds to CreateNewDrawingComponent
@Component({
    selector: 'app-new-drawing-dialog',
    templateUrl: './new-drawing-dialog.component.html',
    styleUrls: ['./new-drawing-dialog.component.scss'],
})
export class NewDrawingDialogComponent {
    constructor(public drawingService: DrawingService, public dialogRef: MatDialogRef<NewDrawingDialogComponent>) {}

    deleteCanvas(): void {
        this.drawingService.clearCanvas(this.drawingService.baseCtx);
        this.dialogRef.close();
        this.drawingService.emitCreateNewDrawingEvent('Button <new drawing> resized the canvas');
    }

    cancel(): void {
        this.dialogRef.close();
    }
}
