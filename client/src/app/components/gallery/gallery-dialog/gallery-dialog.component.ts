import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Command } from '@app/classes/commands/command';
import { ImageGallery } from '@app/classes/image-gallery';
import { WarningDialogComponent } from '@app/components/gallery/warning/warning-dialog.component';
import { CommunicationService } from '@app/services/communication/communication.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { FireBaseService } from '@app/services/fire-base/fire-base.service';
import { ResizeService } from '@app/services/resize/resize.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { Drawing } from '@common/communication/drawing';
import { NgImageSliderComponent } from 'ng-image-slider';
import { Observable, Subscription } from 'rxjs';
@Component({
    selector: 'app-gallery-dialog',
    styleUrls: ['./gallery-dialog.component.scss'],
    templateUrl: './gallery-dialog.component.html',
})
export class GalleryDialogComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('imageSlider', { static: false }) slider: NgImageSliderComponent;
    drawings: Drawing[] = [];
    tab: ImageGallery[] = [];
    drawingTags: string[] = [];
    isDrawing: boolean = false;
    tagForm: FormControl;
    private subscribeExecutedCommand: Subscription;

    constructor(
        private drawingService: DrawingService,
        private dialog: MatDialog,
        private fireBaseService: FireBaseService,
        private communicationService: CommunicationService,
        private undoRedoService: UndoRedoService,
        private resizeService: ResizeService,
    ) {}

    ngOnInit(): void {
        this.tagForm = new FormControl('', [Validators.pattern('^(\\d|[a-zA-ZÀ-ÿ]){0,15}$'), Validators.required]);
        this.resizeService = new ResizeService(this.drawingService);
        this.subscribeExecutedCommand = this.resizeService.executedCommand.subscribe((command: Command) => {
            this.undoRedoService.addCommand(command);
        });
    }

    ngOnDestroy(): void {
        this.subscribeExecutedCommand.unsubscribe();
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.getDrawings();
        }, 0);
    }

    private updateDrawings(totalDrawings: Drawing[]): void {
        this.tab = [{} as ImageGallery];
        this.slider.images.length = 0;
        for (const image of totalDrawings) {
            const prefix = image.tags.length ? '\nÉtiquette: ' : '';
            const obj = {
                image: image.url,
                thumbImage: image.url,
                title: 'Titre: ' + image.name + prefix + this.getDrawingTagsToString(image),
                alt: image.name,
            };
            this.tab.push(obj);
        }
        this.slider.setSliderImages(this.tab);
        this.slider.next();
    }

    private getDrawingTagsToString(drawing: Drawing): string {
        let tags = '';
        for (const tag of drawing.tags) {
            tags += tag + ',';
        }
        return tags.length > 0 ? tags.substring(0, tags.length - 1) : tags;
    }

    continueDrawing(event: number): void {
        if (this.drawingService.canvasEmpty(this.drawingService.baseCtx)) {
            const image = new Image();
            image.crossOrigin = '';
            image.src = this.drawings[event - 1].url;
            image.onload = () => {
                this.drawingService.clearCanvas(this.drawingService.baseCtx);
                this.undoRedoService.resetUndoRedo();
                this.resizeService.resizeFromImage(image);
                this.dialog.closeAll();
            };
        } else {
            this.openWarningDialog(this.drawings[event - 1]);
        }
    }

    private openWarningDialog(drawing: Drawing): void {
        this.dialog.open(WarningDialogComponent, { data: { drawing } });
    }

    deleteDrawing(): void {
        if (this.drawings.length !== 0) {
            const imageIndex = this.drawings.length > 1 ? this.slider.visiableImageIndex + 1 : this.slider.visiableImageIndex;
            const draw: Drawing = this.drawings[imageIndex];
            this.fireBaseService.deleteImage(draw._id);
            this.communicationService.deleteDrawing(draw._id).subscribe(() => {
                this.getDrawings();
            });
        }
    }

    private getDrawings(): Observable<Drawing[]> {
        const obs: Observable<Drawing[]> = this.communicationService.getDrawings();
        obs.subscribe((data) => {
            this.transformData(data);
        });
        return obs;
    }

    private transformData(data: Drawing[]): void {
        this.drawings = [];
        for (const draw of data) {
            const image = new Image();
            image.src = draw.url;
            image.onload = () => {
                this.drawings.push(draw);
                this.updateDrawings(this.drawings);
                this.isDrawing = this.drawings.length > 0 ? true : false;
            };
        }
    }

    addTag(tag: string): void {
        this.drawingTags.push(tag);
        this.updateDrawingsBydrawingTags();
        this.tagForm.reset('');
    }

    deleteTag(tag: string): void {
        const index = this.drawingTags.indexOf(tag);

        if (index >= 0) {
            this.drawingTags.splice(index, 1);
            this.updateDrawingsBydrawingTags();
        }
    }

    private drawingsFilteredBydrawingTags(): Drawing[] {
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

    private updateDrawingsBydrawingTags(): void {
        const drawingsFiltered = this.drawingsFilteredBydrawingTags();
        this.updateDrawings(drawingsFiltered);
    }

    validateTag(tag: string): boolean {
        return tag.length > 0 && !this.drawingTags.includes(tag) && !this.tagForm.invalid;
    }

    isTagInputEmpty(): boolean {
        return this.tagForm.value.length === 0;
    }
}
