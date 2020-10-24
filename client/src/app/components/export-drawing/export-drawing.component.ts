import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Component({
    selector: 'app-export-drawing',
    templateUrl: './export-drawing.component.html',
    styleUrls: ['./export-drawing.component.scss'],
})
export class ExportDrawingComponent {
    constructor(public dialog: MatDialog, public drawingService: DrawingService) {}
    exportDrawing(): void {
        // TODO: voir comment download automatiquement sans demander le répertoire
        const url = this.drawingService.canvas.toDataURL();
        // this.dialog.open(ExportDrawingDialogComponent);
    }
}
