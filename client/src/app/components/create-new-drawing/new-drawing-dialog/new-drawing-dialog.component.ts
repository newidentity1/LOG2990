import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AutomaticSavingService } from '@app/services/automatic-saving/automatic-saving.service';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Component({
    selector: 'app-new-drawing-dialog',
    templateUrl: './new-drawing-dialog.component.html',
    styleUrls: ['./new-drawing-dialog.component.scss'],
})
export class NewDrawingDialogComponent {
    constructor(
        public drawingService: DrawingService,
        public dialogRef: MatDialogRef<NewDrawingDialogComponent>,
        private automaticSavingService: AutomaticSavingService,
    ) {}

    deleteCanvas(): void {
        this.automaticSavingService.clearStorage();
        this.drawingService.clearCanvas(this.drawingService.baseCtx);
        this.dialogRef.close();
        this.drawingService.emitCreateNewDrawingEvent();
    }

    cancel(): void {
        this.dialogRef.close();
    }
}
