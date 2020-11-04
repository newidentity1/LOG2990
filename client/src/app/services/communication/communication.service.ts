import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Drawing } from '@common/communication/drawing';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class CommunicationService {
    private drawingUrl: string = 'http://localhost:3000/api/drawings/';
    constructor(private http: HttpClient) {}

    deleteDraw(id: string): Observable<Drawing> {
        const deleteDrawing: Observable<Drawing> = this.http.delete<Drawing>(this.drawingUrl + id);
        deleteDrawing.subscribe(() => {
            console.log('TEST GET DRAWINGS');
            this.getDrawings();
        });
        return deleteDrawing;
    }

    getDrawings(): Observable<Drawing[]> {
        return this.http.get<Drawing[]>(this.drawingUrl);
    }

    postDraw(draw: Drawing): Observable<string> {
        const postDrawing: Observable<string> = this.http.post(this.drawingUrl, draw, { responseType: 'text' });
        postDrawing.subscribe({
            // tslint:disable-next-line: no-any
            next: (data: any) => {
                console.log(data);
            },
            // tslint:disable-next-line: no-any
            error: (error: any) => {
                console.log(error);
            },
        });
        return postDrawing;
    }
}
