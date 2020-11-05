import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CommunicationService } from '@app/services/communication/communication.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { FireBaseService } from '@app/services/firebase/fire-base.service';
import { Drawing } from '@common/communication/drawing';
import { NgImageSliderComponent } from 'ng-image-slider';
import { Observable } from 'rxjs';
import { WarningDialogComponent } from './warning/warning-dialog.component';
@Component({
    selector: 'app-gallery',
    styleUrls: ['./gallery.component.scss'],
    templateUrl: './gallery.component.html',
})
export class GalleryComponent implements OnInit, AfterViewInit {
    @ViewChild('imageSlider', { static: false }) slider: NgImageSliderComponent;
    drawings: Drawing[] = [];
    tab: object[] = [];
    drawingTags: string[] = [];
    tagToAdd: string = '';
    isDrawing: boolean = false;
    tagForm: FormControl;
    isCanvasEmpty: boolean = true;
    constructor(
        private drawingService: DrawingService,
        private dialog: MatDialog,
        private fireBaseService: FireBaseService,
        private communicationService: CommunicationService,
        public dialogRef: MatDialogRef<WarningDialogComponent>,
    ) {}

    ngOnInit(): void {
        this.tagForm = new FormControl(this.tagToAdd, [Validators.pattern('^(\\d|[a-zA-ZÀ-ÿ]){0,15}$'), Validators.required]);
    }

    ngAfterViewInit(): void {
        this.getDrawings();
    }

    openDialog(): void {
        this.dialog.open(GalleryComponent, {
            height: '55%',
        });
    }

    updateDrawings(totalDrawings: Drawing[]): void {
        this.tab = [];
        this.slider.images.length = 0;
        for (const image of totalDrawings) {
            const obj = {
                image: image.url,
                thumbImage: image.url,
                title: image.name + '\nétiquette: ' + this.getDrawingTagsToString(image),
                alt: image.name,
            };
            this.tab.push(obj);
        }
        this.slider.setSliderImages(this.tab);
        this.isDrawing = this.tab.length > 0;
    }

    getDrawingTagsToString(drawing: Drawing): string {
        let tags = '';
        for (const tag of drawing.tags) {
            tags += tag + ',';
        }
        return tags.length > 0 ? tags.substring(0, tags.length - 1) : tags;
    }

    continueDrawing(event: number): void {
        const isCanvasEmpty = this.drawingService.canvasEmpty(this.drawingService.baseCtx, this.drawingService.canvas);
        if (isCanvasEmpty) {
            const image = new Image();
            image.crossOrigin = '';
            image.src = this.drawings[event].url;
            image.onload = () => {
                const ctx = this.drawingService.canvas.getContext('2d') as CanvasRenderingContext2D;
                this.drawingService.clearCanvas(ctx as CanvasRenderingContext2D);
                this.drawingService.baseCtx.canvas.width = image.width;
                this.drawingService.baseCtx.canvas.height = image.height;
                this.drawingService.previewCtx.canvas.width = image.width;
                this.drawingService.previewCtx.canvas.height = image.height;
                ctx.drawImage(image, 0, 0);
                this.dialog.closeAll();
            };
        } else {
            this.warningCanvas(this.drawings[event]);
        }
    }

    warningCanvas(d: Drawing): void {
        WarningDialogComponent.drawing = d;
        this.dialog.open(WarningDialogComponent);
    }
    deleteDrawing(): void {
        if (this.drawings.length !== 0) {
            const i = this.slider.visiableImageIndex;
            const draw: Drawing = this.drawings[i];
            this.fireBaseService.deleteImage(draw._id);
            this.communicationService.deleteDrawing(draw._id).subscribe(() => {
                this.getDrawings();
            });
        }
    }

    getDrawings(): Observable<Drawing[]> {
        const obs: Observable<Drawing[]> = this.communicationService.getDrawings();
        obs.subscribe((data) => {
            this.transformData(data);
        });
        return obs;
    }

    transformData(data: Drawing[]): void {
        this.drawings = [];
        for (const draw of data) {
            this.drawings.push(draw);
        }
        this.updateDrawings(this.drawings);
        if (this.drawings.length > 0) {
            this.isDrawing = true; // je vais test ca
        } else {
            this.isDrawing = false;
        }
    }

    addTag(tag: string): void {
        this.drawingTags.push(tag);
        this.updateDrawingsBydrawingTags();
    }

    deleteTag(tag: string): void {
        const index = this.drawingTags.indexOf(tag);

        if (index >= 0) {
            this.drawingTags.splice(index, 1);
            this.updateDrawingsBydrawingTags();
        }
    }

    drawingsFilteredBydrawingTags(): Drawing[] {
        if (this.drawingTags.length === 0) return this.drawings;
        const filteredDrawing: Drawing[] = [];

        for (const drawing of this.drawings) {
            for (const tag of this.drawingTags) {
                if (drawing.tags.includes(tag)) {
                    filteredDrawing.push(drawing);
                    break;
                }
            }
        }
        return filteredDrawing;
    }

    updateDrawingsBydrawingTags(): void {
        const drawingsFiltered = this.drawingsFilteredBydrawingTags();
        this.updateDrawings(drawingsFiltered);
    }

    validateTag(tag: string): boolean {
        return tag.length > 0 && !this.drawingTags.includes(tag) && !this.tagForm.invalid;
    }
}
