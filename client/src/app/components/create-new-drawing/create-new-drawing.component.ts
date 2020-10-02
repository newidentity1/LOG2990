import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { NewDrawingDialogComponent } from './new-drawing-dialog/new-drawing-dialog.component';

// CreateNewDrawingComponent is the button in the sidebar
@Component({
    selector: 'app-create-new-drawing',
    templateUrl: './create-new-drawing.component.html',
    styleUrls: ['./create-new-drawing.component.scss'],
})
export class CreateNewDrawingComponent {
    constructor(public drawingService: DrawingService, public dialog: MatDialog) {}

    // Empty: Automatically clears canvas, Not Empty: Pop Up Warning
    createNewDrawing(): void {
        const isCanvasEmpty = this.drawingService.canvasEmpty(this.drawingService.baseCtx, this.drawingService.canvas);
        if (isCanvasEmpty) {
            this.drawingService.clearCanvas(this.drawingService.baseCtx);
            this.drawingService.emitCreateNewDrawingEvent();
        } else {
            this.warningClearCanvas();
        }
    }

    warningClearCanvas(): void {
        this.dialog.open(NewDrawingDialogComponent);
    }
}
