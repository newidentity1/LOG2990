import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
//import { Drawing } from '@common/communication/drawing';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { OnInit } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class EmailService implements OnInit {
    private emailUrl: string = 'http://localhost:3000/api/email/';
    address: string = '';
    data: ImageData;
    emailUploadForm: FormGroup;
    constructor(private formBuilder: FormBuilder, private http: HttpClient) {}

    ngOnInit() {
        this.emailUploadForm = this.formBuilder.group({ profile: [''] });
    }

    onSubmit() {
        const formData = new FormData();
        formData.append('email', this.emailUploadForm.get('').value);
        this.http.post(this.emailUrl, formData, { responseType: 'text' });
    }

    postEmail(photo: Image): Observable<string> {
        return this.http.post(this.emailUrl, photo, { responseType: 'text' });
    }
}
