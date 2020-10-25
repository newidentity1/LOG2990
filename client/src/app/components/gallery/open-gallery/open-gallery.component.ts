import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GalleryComponent } from '@app/components/gallery/gallery.component';

@Component({
    selector: 'app-open-gallery',
    templateUrl: './open-gallery.component.html',
    styleUrls: ['./open-gallery.component.scss'],
})
export class OpenGalleryComponent {
    @Input()
    inMenu: boolean = false;

    constructor(private dialog: MatDialog) {}

    openDialog(): void {
        this.dialog.open(GalleryComponent, {
            height: '95%',
        });
    }
}
