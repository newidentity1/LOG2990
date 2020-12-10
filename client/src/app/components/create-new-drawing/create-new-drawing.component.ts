import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AutomaticSavingService } from '@app/services/automatic-saving/automatic-saving.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { NewDrawingDialogComponent } from './new-drawing-dialog/new-drawing-dialog.component';

@Component({
    selector: 'app-create-new-drawing',
    templateUrl: './create-new-drawing.component.html',
    styleUrls: ['./create-new-drawing.component.scss'],
})
export class CreateNewDrawingComponent {
    @Input() inMenu: boolean = false;
    constructor(public drawingService: DrawingService, public dialog: MatDialog, private automaticSavingService: AutomaticSavingService) {}

    createNewDrawing(): void {
        const isCanvasEmpty = this.inMenu
            ? !this.automaticSavingService.savedDrawingExists()
            : this.drawingService.canvasEmpty(this.drawingService.baseCtx);
        if (isCanvasEmpty) {
            this.drawingService.emitCreateNewDrawingEvent();
        } else {
            if (this.inMenu) this.automaticSavingService.recover();
            this.warningClearCanvas();
        }
    }

    warningClearCanvas(): void {
        this.dialog.open(NewDrawingDialogComponent);
    }
}
