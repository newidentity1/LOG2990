import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResponseResult } from '@app/classes/response-result';
import { CommunicationService } from '@app/services/communication/communication.service';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class EmailService {
    sendEmailSubject: Subject<ResponseResult> = new Subject<ResponseResult>();
    constructor(private communicationService: CommunicationService) {}

    setupPost(emailAddress: string, image: Blob, filename: string): void {
        // Creates Form
        const formData = new FormData();

        formData.append('to', emailAddress);
        formData.append('payload', image, filename);

        // Send for POST request
        this.communicationService.postEmail(formData).subscribe({
            next: (response: string) => {
                console.log(response);
                // this.emitSendEmailSubjectEvent(new ResponseResult(true, 'Votre courriel a été envoyé avec succès'));
            },
            error: (error: HttpErrorResponse) => {
                console.log(error);
                // const message = error.status === 0 ? "Une erreur s'est produite, le courriel n'a pas été envoyé!" : error.error;

                // this.emitSendEmailSubjectEvent(new ResponseResult(false, message));
            },
        });
    }

    // emitSendEmailSubjectEvent(response: ResponseResult): void {
    //     this.sendEmailSubject.next(response);
    // }
}
