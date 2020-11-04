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
    drawingTitle: string = '';
    drawings: Drawing[] = [];
    drawingTags: string[] = [];
    tagToAdd: string = '';
    tagEmpty: boolean;
    tagForm: FormControl;
    titleForm: FormControl;

    constructor(public dialog: MatDialog, public fireBaseService: FireBaseService) {
        this.drawingTitle = '';
    }

    ngOnInit(): void {
        this.tagForm = new FormControl(this.tagToAdd, [Validators.pattern('^(\\d|[a-zA-ZÀ-ÿ]){0,15}$'), Validators.required]);
        this.titleForm = new FormControl(this.drawingTitle, [Validators.pattern('^[a-zA-ZÀ-ÿ](d|[a-zA-ZÀ-ÿ ]){0,20}$'), Validators.required]);
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
