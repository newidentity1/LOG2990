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
    template: `
        <div id="window">
            <h2>Carrousel de dessins</h2>
            <div class="row">
                <ng-image-slider [images]="tab" (imageClick)="continueDraw($event)" [imagePopup]="false" #nav> </ng-image-slider>
            </div>
            <div id="buttons">
                <button id="open">Ouvrir</button>
                <button id="delete" (click)="deleteDraw()">Supprimer</button>
            </div>
        </div>
    `,
})
export class GalleryComponent implements OnInit {
    @ViewChild('nav') slider: NgImageSliderComponent;
    private drawingUrl: string = 'http://localhost:3000/api/drawings/';
    list: Drawing[] = [];
    tab: object[] = [];
    constructor(private http: HttpClient, private drawingService: DrawingService, private dialog: MatDialog) {
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
        const i = this.slider.visiableImageIndex;
        console.log(i);
        const draw: Drawing = this.list[i];
        const obs: Observable<Drawing> = this.http.delete<Drawing>(this.drawingUrl + draw._id);
        obs.subscribe((data) => {
            console.log(data);
            this.list = [];
            this.getDrawings();
        });
        // TODO
    }

    getDrawings(): void {
        const obs: Observable<Drawing[]> = this.http.get<Drawing[]>(this.drawingUrl);
        obs.subscribe((data) => {
            console.log(data);
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
