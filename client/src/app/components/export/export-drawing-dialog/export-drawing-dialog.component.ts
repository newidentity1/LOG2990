import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'app-export-drawing-dialog',
    templateUrl: './export-drawing-dialog.component.html',
    styleUrls: ['./export-drawing-dialog.component.scss'],
})
export class ExportDrawingDialogComponent {
    constructor(public dialog: MatDialog) {}

    selectedFormat: string = 'None';
    selectedFilter: string = 'None';
}
