import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommunicationService } from '@app/services/communication/communication.service';
import { Email } from '@common/communication/email';

@Injectable({
    providedIn: 'root',
})
export class EmailService implements OnInit {
    private emailUrl: string = 'http://localhost:3000/api/email/';
    apiKey: string = 'f6cd41ef-636d-45ae-9e07-47dd97cff25e';
    address: string = '';
    data: ImageData;
    emailUploadForm: FormGroup;
    constructor(private formBuilder: FormBuilder, private http: HttpClient, private communicationService: CommunicationService) {}

    ngOnInit(): void {
        this.emailUploadForm = this.formBuilder.group({ profile: [''] });
    }

    onSubmit(email: Email): void {
        // body
        const formData = new FormData();

        formData.append('to', email.emailAddress);
        formData.append('payload', email.image);

        // Will be used for Server to API
        // axios.post('http://httpbin.org/post', data);

        const httpHeaders = new HttpHeaders({ 'Content-Type': 'multipart/form-data', 'X-Team-Key': this.apiKey });

        // can be passed this way
        // const options = { headers: httpHeaders };

        // post request
        // formData is body
        this.http.post(this.emailUrl, formData, { headers: httpHeaders });

        this.communicationService.postEmail(email).subscribe({
            next: (response: string) => {
                console.log(response);
                // this.isDrawingSaving = false;
                // this.emitSaveDrawingSubjectEvent(new ResponseResult(true, 'Votre dessin a été enregistré avec succès'));
            },
            error: (error: HttpErrorResponse) => {
                console.log(error);
                // const message = error.status === 0 ? "Le serveur est indisponible, le courriel n'a pas ete envoye!" : error.error;

                // this.emitSaveDrawingSubjectEvent(new ResponseResult(false, message));
                // this.isDrawingSaving = false;
            },
        });
    }
}
