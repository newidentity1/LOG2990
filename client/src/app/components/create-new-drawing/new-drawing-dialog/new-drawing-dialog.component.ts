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
    constructor(public newDrawingService: DrawingService, public dialogRef: MatDialogRef<NewDrawingDialogComponent>) {
        // TODO: Empty
    }

    DeleteCanvas(): void {
        this.newDrawingService.clearCanvas(this.newDrawingService.baseCtx);
        this.dialogRef.close();
    }

    Cancel(): void {
        this.dialogRef.close();
    }
}
