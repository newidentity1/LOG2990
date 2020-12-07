import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Drawing } from '@common/communication/drawing';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class CommunicationService {
    private drawingUrl: string = 'http://localhost:3000/api/drawings/';
    private emailUrl: string = 'http://localhost:3000/api/email/';

    constructor(private http: HttpClient) {}

    deleteDrawing(id: string): Observable<string> {
        return this.http.delete<string>(this.drawingUrl + id);
    }

    getDrawings(): Observable<Drawing[]> {
        return this.http.get<Drawing[]>(this.drawingUrl);
    }

    postDrawing(drawing: Drawing): Observable<string> {
        return this.http.post(this.drawingUrl, drawing, { responseType: 'text' });
    }

    postEmail(form: FormData): Observable<string> {
        return this.http.post(this.emailUrl, form, { responseType: 'text' });
    }
}
