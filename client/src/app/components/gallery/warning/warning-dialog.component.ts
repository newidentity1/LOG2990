import { Component, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ResizeService } from '@app/services/resize/resize.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { Drawing } from '@common/communication/drawing';

@Component({
    selector: 'app-warning-dialog',
    templateUrl: './warning-dialog.component.html',
    styleUrls: ['./warning-dialog.component.scss'],
})
export class WarningDialogComponent {
    private image: HTMLImageElement = new Image();
    constructor(
        public drawingService: DrawingService,
        private undoRedoService: UndoRedoService,
        private resizeService: ResizeService,
        public dialog: MatDialog,
        @Inject(MAT_DIALOG_DATA) public data: { drawing: Drawing },
    ) {}

    deleteCanvas(): void {
        this.undoRedoService.resetUndoRedo();
        this.image.crossOrigin = '';
        this.image.src = this.data.drawing.url;
        this.image.onload = () => {
            this.loadImage();
        };
    }

    loadImage(): void {
        this.cancel();
        this.drawingService.clearCanvas(this.drawingService.baseCtx);
        this.resizeService.resizeFromImage(this.image);
    }

    cancel(): void {
        this.dialog.closeAll();
    }
}
