import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CommunicationService } from '@app/services/communication/communication.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { FireBaseService } from '@app/services/firebase/fire-base.service';
import { Drawing } from '@common/communication/drawing';
import { NgImageSliderComponent } from 'ng-image-slider';
import { Observable } from 'rxjs';
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

    constructor(
        private drawingService: DrawingService,
        private dialog: MatDialog,
        private fireBaseService: FireBaseService,
        private communicationService: CommunicationService,
    ) {}

    ngOnInit(): void {
        this.tagForm = new FormControl(this.tagToAdd, [Validators.pattern('^(\\d|[a-zA-ZÀ-ÿ]){0,15}$'), Validators.required]);
    }

    ngAfterViewInit(): void {
        this.getDrawings();
    }

    updateDrawings(totalDrawings: Drawing[]): void {
        this.tab = [];
        for (const image of totalDrawings) {
            const obj = {
                image: image.url,
                thumbImage: image.url,
                title: image.name + '\ntags: ' + this.getDrawingTagsToString(image),
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

    continueDraw(event: number): void {
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
    }

    deleteDraw(): void {
        if (this.drawings.length !== 0) {
            const i = this.slider.visiableImageIndex;
            const draw: Drawing = this.drawings[i];
            this.fireBaseService.deleteImage(draw._id);
            this.communicationService.deleteDraw(draw._id);
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
        for (const draw of data) {
            this.drawings.push(draw);
        }
        console.log(this.drawings);
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
