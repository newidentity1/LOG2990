import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Drawing } from '@common/communication/drawing';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-gallery',
    templateUrl: './gallery.component.html',
    styleUrls: ['./gallery.component.scss'],
})
export class GalleryComponent implements OnInit {
    private drawingUrl: string = 'http://localhost:3000/api/drawings';
    list: Drawing[] = [];
    tab: object[] = [];
    constructor(private http: HttpClient) {
        const obs: Observable<Drawing[]> = this.http.get<Drawing[]>(this.drawingUrl);
        obs.subscribe((data) => {
            for (const draw of data) {
                this.list.push(draw);
            }
            this.updateDraws();
        });
    }

    updateDraws(): void {
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

    ngOnInit(): void {
        // TODO
    }
}
