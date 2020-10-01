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
    constructor(public currentDrawingService: DrawingService, public dialog: MatDialog) {}

    // Empty: Automatically clears canvas, Not Empty: Pop Up Warning
    createNewDrawing(): void {
        if (this.currentDrawingService.CanvasEmpty(this.currentDrawingService.baseCtx, this.currentDrawingService.canvas)) {
            this.currentDrawingService.clearCanvas(this.currentDrawingService.baseCtx);
            console.log('Cleared Canvas Without Warning');
            this.currentDrawingService.emitCreateNewDrawingEvent('Button <new drawing> resized the canvas');
        } else {
            this.warningClearCanvas();
            console.log('Cleared Canvas With Warning');
        }
    }

    warningClearCanvas(): void {
        this.dialog.open(NewDrawingDialogComponent);
    }

    // TODO : Implement keypress for CTRL+0
}
