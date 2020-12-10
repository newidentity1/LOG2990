import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ResponseResult } from '@app/classes/response-result';
import { FireBaseService } from '@app/services/fire-base/fire-base.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-upload-dialog',
    templateUrl: './upload-dialog.component.html',
    styleUrls: ['./upload-dialog.component.scss'],
})
export class UploadDialogComponent implements OnInit, OnDestroy {
    drawingTags: string[] = [];
    tagForm: FormControl;
    titleForm: FormControl;
    subscribeSaveDrawing: Subscription;

    constructor(public dialog: MatDialog, public fireBaseService: FireBaseService, private snackBar: MatSnackBar) {}

    ngOnInit(): void {
        this.tagForm = new FormControl('', [Validators.pattern('^(\\d|[a-zA-ZÀ-ÿ]){0,15}$'), Validators.required]);
        this.titleForm = new FormControl('', [Validators.pattern('^[a-zA-ZÀ-ÿ](\\d|[a-zA-ZÀ-ÿ ]){0,20}$'), Validators.required]);
        this.titleForm.markAsDirty();
        this.subscribeSaveDrawing = this.fireBaseService.saveDrawingEventListener().subscribe((result: ResponseResult) => {
            this.snackBar.open(result.message, 'Fermer', {
                duration: 4000,
                verticalPosition: 'top',
                panelClass: result.isSuccess ? ['sucess-snackbar'] : ['error-snackbar'],
            });
        });
    }

    ngOnDestroy(): void {
        this.subscribeSaveDrawing.unsubscribe();
    }

    uploadImage(): void {
        this.fireBaseService.name = this.titleForm.value;
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
        this.tagForm.reset('');
    }

    deleteTag(tag: string): void {
        const index = this.drawingTags.indexOf(tag);

        if (index >= 0) {
            this.drawingTags.splice(index, 1);
        }
    }

    isTitleInputEmpty(): boolean {
        return this.titleForm.value.length === 0;
    }

    isTagInputEmpty(): boolean {
        if (this.tagForm.value.length === 0) {
            this.tagForm.markAsPristine();
        }
        return this.tagForm.value.length === 0;
    }
}
