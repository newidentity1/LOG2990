import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ExportDrawingDialogComponent } from './export-drawing-dialog/export-drawing-dialog.component';

@Component({
    selector: 'app-export',
    templateUrl: './export.component.html',
    styleUrls: ['./export.component.scss'],
})
export class ExportComponent {
    constructor(public dialog: MatDialog) {}
    exportDrawing(): void {
        this.dialog.open(ExportDrawingDialogComponent);
    }
}
