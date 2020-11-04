import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { FireBaseService } from '@app/services/firebase/fire-base.service';
import { Drawing } from '@common/communication/drawing';

@Component({
    selector: 'app-upload-dialog',
    templateUrl: './upload-dialog.component.html',
    styleUrls: ['./upload-dialog.component.scss'],
})
export class UploadDialogComponent implements OnInit {
    drawingTitle: string;
    drawings: Drawing[] = [];
    drawingTags: string[] = [];
    tagToAdd: string = '';
    tagForm: FormControl;

    constructor(public dialog: MatDialog, public fireBaseService: FireBaseService) {
        this.drawingTitle = '';
    }

    ngOnInit(): void {
        this.tagForm = new FormControl(this.tagToAdd, [Validators.pattern('^(\\d|[a-zA-ZÀ-ÿ]){0,15}$'), Validators.required]);
    }

    uploadImage(): void {
        this.fireBaseService.name = this.drawingTitle;
        this.fireBaseService.uploadCanvas();
    }

    addTag(tag: string): void {
        this.drawingTags.push(tag);
    }

    validateTag(tag: string): boolean {
        return tag.length > 0 && !this.drawingTags.includes(tag) && !this.tagForm.invalid;
    }
}
