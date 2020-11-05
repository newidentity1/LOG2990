import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GalleryDialogComponent } from '@app/components/gallery/gallery-dialog/gallery-dialog.component';

@Component({
    selector: 'app-gallery',
    templateUrl: './gallery.component.html',
    styleUrls: ['./gallery.component.scss'],
})
export class GalleryComponent {
    @Input()
    inMenu: boolean = false;

    constructor(private dialog: MatDialog) {}

    openDialog(): void {
        this.dialog.open(GalleryDialogComponent, {
            height: '55%',
        });
    }
}
