import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Drawing } from '@common/communication/drawing';
// import { Drawing } from '@common/communication/drawing';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class CommunicationService {
    private drawingUrl: string = 'http://localhost:3000/api/drawings/';
    constructor(private http: HttpClient) {}

    deleteDraw(id: string): Observable<Drawing> {
        const obs: Observable<Drawing> = this.http.delete<Drawing>(this.drawingUrl + id);
        obs.subscribe((data) => {
            this.getDrawings();
        });
        return obs;
    }

    getDrawings(): Observable<Drawing[]> {
        const obs: Observable<Drawing[]> = this.http.get<Drawing[]>(this.drawingUrl);
        return obs;
    }

    postDraw(draw: Drawing): void {
        const obs: Observable<string> = this.http.post(this.drawingUrl, draw, { responseType: 'text' });
        obs.subscribe({
            // tslint:disable-next-line: no-any
            next: (data: any) => {
                console.log(data);
            },
            // tslint:disable-next-line: no-any
            error: (error: any) => {
                console.log(error);
            },
        });
    }
}
