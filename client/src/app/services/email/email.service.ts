import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommunicationService } from '@app/services/communication/communication.service';
import { Email } from '@common/communication/email';

@Injectable({
    providedIn: 'root',
})
export class EmailService implements OnInit {
    emailUploadForm: FormGroup;
    constructor(private formBuilder: FormBuilder, private communicationService: CommunicationService) {}

    ngOnInit(): void {
        this.emailUploadForm = this.formBuilder.group({ profile: [''] });
    }

    // Send an Email to Express Server
    setupPost(address: string, img: Blob): void {
        // setup email

        const email: Email = {
            emailAddress: address,
            image: img,
        };

        // Send for POST request
        this.communicationService.postEmail(email).subscribe({
            next: (response: string) => {
                console.log(response);
                // this.emitSaveDrawingSubjectEvent(new ResponseResult(true, 'Votre dessin a été enregistré avec succès'));
            },
            error: (error: HttpErrorResponse) => {
                console.log(error);
                // const message = error.status === 0 ? "Le serveur est indisponible, le courriel n'a pas ete envoye!" : error.error;

                // this.emitSaveDrawingSubjectEvent(new ResponseResult(false, message));
            },
        });
    }

    // Send a FormData to Express Server
    // setupPost(emailAddress: string, image: Blob): void {
    //     // Creates Form
    //     const formData = new FormData();

    //     formData.append('to', emailAddress);
    //     formData.append('payload', image);

    //     // Send for POST request
    //     this.communicationService.postEmail(formData).subscribe({
    //         next: (response: string) => {
    //             console.log(response);
    //             // this.emitSaveDrawingSubjectEvent(new ResponseResult(true, 'Votre dessin a été enregistré avec succès'));
    //         },
    //         error: (error: HttpErrorResponse) => {
    //             console.log(error);
    //             // const message = error.status === 0 ? "Le serveur est indisponible, le courriel n'a pas ete envoye!" : error.error;

    //             // this.emitSaveDrawingSubjectEvent(new ResponseResult(false, message));
    //         },
    //     });
    // }
}
