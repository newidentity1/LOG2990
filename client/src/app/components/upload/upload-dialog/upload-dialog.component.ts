import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ResponseResult } from '@app/classes/response-result';
import { FireBaseService } from '@app/services/firebase/fire-base.service';
import { Drawing } from '@common/communication/drawing';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-upload-dialog',
    templateUrl: './upload-dialog.component.html',
    styleUrls: ['./upload-dialog.component.scss'],
})
export class UploadDialogComponent implements OnInit {
    drawingTitle: string = '';
    drawings: Drawing[] = [];
    drawingTags: string[] = [];
    tagToAdd: string = '';
    tagEmpty: boolean;
    tagForm: FormControl;
    titleForm: FormControl;
    subscribeSaveDrawing: Subscription;

    constructor(public dialog: MatDialog, public fireBaseService: FireBaseService, private snackBar: MatSnackBar) {
        this.drawingTitle = '';
    }

    ngOnInit(): void {
        this.tagForm = new FormControl(this.tagToAdd, [Validators.pattern('^(\\d|[a-zA-ZÀ-ÿ]){0,15}$'), Validators.required]);
        this.titleForm = new FormControl(this.drawingTitle, [Validators.pattern('^[a-zA-ZÀ-ÿ](\\d|[a-zA-ZÀ-ÿ ]){0,20}$'), Validators.required]);
        this.subscribeSaveDrawing = this.fireBaseService.saveDrawingEventListener().subscribe((result: ResponseResult) => {
            this.snackBar.open(result.message, 'Fermer', {
                duration: 4000,
                verticalPosition: 'top',
                panelClass: result.isSuccess ? ['sucess-snackbar'] : ['error-snackbar'],
            });
        });
    }

    uploadImage(): void {
        this.fireBaseService.name = this.drawingTitle;
        this.fireBaseService.drawingTags = this.drawingTags;
        this.fireBaseService.uploadCanvas();
    }

    validateTitle(title: string): boolean {
        return title.length > 0 && !this.titleForm.invalid;
    }

    validateTag(tag: string): boolean {
        return tag.length > 0 && !this.drawingTags.includes(tag) && !this.tagForm.invalid;
    }

    addTag(tag: string): void {
        this.drawingTags.push(tag);
    }

    deleteTag(tag: string): void {
        const index = this.drawingTags.indexOf(tag);

        if (index >= 0) {
            this.drawingTags.splice(index, 1);
        }
    }

    isTitleInputEmpty(): boolean {
        return this.drawingTitle.length === 0;
    }

    isTagInputEmpty(): boolean {
        return this.tagToAdd.length === 0;
    }
}
