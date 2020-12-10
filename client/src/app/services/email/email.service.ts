import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResponseResult } from '@app/classes/response-result';
import { CommunicationService } from '@app/services/communication/communication.service';
import { Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class EmailService {
    sendEmailSubject: Subject<ResponseResult> = new Subject<ResponseResult>();
    constructor(private communicationService: CommunicationService) {}

    postEmail(emailAddress: string, image: Blob, filename: string): void {
        const formData = new FormData();

        formData.append('to', emailAddress);
        formData.append('payload', image, filename);

        this.communicationService.postEmail(formData).subscribe({
            next: (response) => {
                this.emitSendEmailSubjectEvent(new ResponseResult(true, response));
            },
            error: (error: HttpErrorResponse) => {
                const message = error.status === 0 ? "Une erreur s'est produite, le courriel n'a pas été envoyé!" : error.error;
                this.emitSendEmailSubjectEvent(new ResponseResult(false, message));
            },
        });
    }

    emitSendEmailSubjectEvent(response: ResponseResult): void {
        this.sendEmailSubject.next(response);
    }
    sendEmailEventListener(): Observable<ResponseResult> {
        return this.sendEmailSubject.asObservable();
    }
}
