import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GuideComponent } from '@app/components/guide/guide.component';

@Component({
    selector: 'app-open-guide',
    templateUrl: './open-guide.component.html',
    styleUrls: ['./open-guide.component.scss'],
})
export class OpenGuideComponent {
    @Input() inMenu: boolean = false;

    constructor(private dialog: MatDialog) {}

    openDialog(): void {
        this.dialog.open(GuideComponent, {
            height: '95%',
        });
    }
}
