import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';
import { GuideComponent } from '@app/components/guide/guide.component';

@Component({
    selector: 'app-open-guide',
    templateUrl: './open-guide.component.html',
    styleUrls: ['./open-guide.component.scss'],
})
export class OpenGuideComponent implements OnInit {
    constructor(private dialog: MatDialog) {}

    ngOnInit(): void {}

    openDialog(): void {
        this.dialog.open(GuideComponent, {
            height: '95%',
        });
    }
}
