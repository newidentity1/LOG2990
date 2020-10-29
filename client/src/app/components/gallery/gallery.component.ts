import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { Drawing } from '@common/communication/drawing';
import { NgImageSliderComponent } from 'ng-image-slider';
import { Observable } from 'rxjs';
@Component({
    selector: 'app-gallery',
    styleUrls: ['./gallery.component.scss'],
    templateUrl: './gallery.component.html',
})
export class GalleryComponent implements OnInit {
    @ViewChild('nav') slider: NgImageSliderComponent;
    private drawingUrl: string = 'http://localhost:3000/api/drawings/';
    drawings: Drawing[] = [];
    tab: object[] = [];
    tags: string[] = ['blablabla'];
    tagToAdd: string = '';

    constructor(private http: HttpClient, private drawingService: DrawingService, private dialog: MatDialog) {}
    ngOnInit(): void {
        // TODO
        this.getDrawings();
    }

    updateDrawings(totalDrawings: Drawing[]): void {
        this.tab.length = 0;
        this.slider.images.length = 0;
        for (const image of totalDrawings) {
            const obj = {
                image: image.url,
                thumbImage: image.url,
                title: image.name,
                alt: image.name,
            };
            this.tab.push(obj);
        }
    }

    continueDraw(event: number): void {
        const image = new Image();
        image.src = this.drawings[event].url;
        const ctx = this.drawingService.canvas.getContext('2d');
        this.drawingService.canvas.width = image.width;
        this.drawingService.canvas.height = image.height;
        ctx?.drawImage(image, 0, 0);
        this.dialog.closeAll();
        console.log(event);
    }

    deleteDraw(): void {
        const i = this.slider.visiableImageIndex;
        console.log(i);
        const draw: Drawing = this.drawings[i];
        const obs: Observable<Drawing> = this.http.delete<Drawing>(this.drawingUrl + draw._id);
        obs.subscribe((data) => {
            console.log(data);
            this.drawings = [];
            this.getDrawings();
        });
    }

    getDrawings(): void {
        const obs: Observable<Drawing[]> = this.http.get<Drawing[]>(this.drawingUrl);
        obs.subscribe((data) => {
            console.log(data);
            for (const draw of data) {
                this.drawings.push(draw);
            }
            this.updateDrawings(this.drawings);
        });
    }

    addTag(tag: string): void {
        this.tags.push(tag);
        this.tags = [...this.tags];
        this.updateDrawingsByTags();
        console.log(this.tags);
    }

    deleteTag(tag: string): void {
        const index = this.tags.indexOf(tag);

        if (index >= 0) {
            this.tags.splice(index, 1);
            this.updateDrawingsByTags();
        }
    }

    drawingsFilteredByTags(): Drawing[] {
        const filteredDrawing = [];

        for (const drawing of this.drawings) {
            for (const tag of this.tags) {
                if (drawing.tags.includes(tag)) {
                    filteredDrawing.push(drawing);
                    break;
                }
            }
        }
        return filteredDrawing;
    }

    updateDrawingsByTags(): void {
        const drawingsFiltered = this.drawingsFilteredByTags();
        this.updateDrawings(drawingsFiltered);
    }

    validateTag(tag: string): boolean {
        return tag.length > 0 && !this.tags.includes(tag);
    }
}
