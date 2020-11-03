import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ExportDrawingDialogComponent } from './export-drawing-dialog/export-drawing-dialog.component';

@Component({
    selector: 'app-export-drawing',
    templateUrl: './export-drawing.component.html',
    styleUrls: ['./export-drawing.component.scss'],
})
export class ExportDrawingComponent {
    constructor(public dialog: MatDialog) {}

    exportDrawing(): void {
        this.dialog.open(ExportDrawingDialogComponent);
    }
}
