import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { DeleteService } from '@app/services/firebase/delete/delete.service';
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
    list: Drawing[] = [];
    tab: object[] = [];
    constructor(private http: HttpClient, private drawingService: DrawingService, private dialog: MatDialog, private deleteService: DeleteService) {
        this.getDrawings();
    }

    updateDraws(): void {
        this.tab.length = 0;
        this.slider.images.length = 0;
        for (const image of this.list) {
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
        image.src = this.list[event].url;
        const ctx = this.drawingService.canvas.getContext('2d');
        this.drawingService.canvas.width = image.width;
        this.drawingService.canvas.height = image.height;
        ctx?.drawImage(image, 0, 0);
        this.dialog.closeAll();
        console.log(event);
    }

    deleteDraw(): void {
        if (this.list.length !== 0) {
            const i = this.slider.visiableImageIndex;
            console.log(i);
            const draw: Drawing = this.list[i];
            this.deleteService.deleteImage(draw._id);
            const obs: Observable<Drawing> = this.http.delete<Drawing>(this.drawingUrl + draw._id);
            obs.subscribe((data) => {
                this.list.length = 0;
                this.getDrawings();
            });
        }
        // TODO
    }

    getDrawings(): void {
        const obs: Observable<Drawing[]> = this.http.get<Drawing[]>(this.drawingUrl);
        obs.subscribe((data) => {
            for (const draw of data) {
                this.list.push(draw);
                this.updateDraws();
            }
        });
    }

    ngOnInit(): void {
        // TODO
    }
}
