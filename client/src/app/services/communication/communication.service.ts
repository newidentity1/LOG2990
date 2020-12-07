import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Drawing } from '@common/communication/drawing';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

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

    // post with formdata
    postEmail(form: FormData): Observable<string> {
        // POST request to Express Server
        // console.log(this.emailUrl, form.get('to'), form.get('payload'));
        let httpHeaders = new HttpHeaders({
            'Content-Type': 'multipart/form-data',
        });
        let options = {
            // responseType: 'text',
            headers: httpHeaders,
        };
        return this.http.post(this.emailUrl, form, options);
    }
}
