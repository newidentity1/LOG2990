import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
//import { Drawing } from '@common/communication/drawing';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class EmailService {
    private emailUrl: string = 'http://localhost:3000/api/email/';
    constructor(private http: HttpClient) {}

    postEmail(photo: Image): Observable<string> {
        return this.http.post(this.emailUrl, photo, { responseType: 'text' });
    }
}
