import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ResponseResult } from '@app/classes/response-result';
import { CommunicationService } from '@app/services/communication/communication.service';
import { of, throwError } from 'rxjs';
import { EmailService } from './email.service';

describe('EmailService', () => {
    let service: EmailService;
    let communicationServiceSpy: jasmine.SpyObj<CommunicationService>;

    beforeEach(() => {
        communicationServiceSpy = jasmine.createSpyObj('CommunicationService', ['postEmail']);
        TestBed.configureTestingModule({
            providers: [{ provide: CommunicationService, useValue: communicationServiceSpy }],
        });
        communicationServiceSpy = TestBed.inject(CommunicationService) as jasmine.SpyObj<CommunicationService>;
        service = TestBed.inject(EmailService);
        communicationServiceSpy.postEmail.and.returnValue(of(''));
    });

    it('postDrawing should send new email to server and emit a success', () => {
        const email = 'test@hotmail.com';
        const image = new Blob();
        const fileName = 'text.png';
        const spyEmitSendEmailSubjectEvent = spyOn(service.sendEmailSubject, 'next').and.callFake(() => {
            return;
        });
        service.postEmail(email, image, fileName);
        expect(communicationServiceSpy.postEmail).toHaveBeenCalled();
        expect(spyEmitSendEmailSubjectEvent).toHaveBeenCalled();
        expect(spyEmitSendEmailSubjectEvent.calls.mostRecent().args[0]?.isSuccess).toEqual(true);
    });

    it('postDrawing postDrawing should emit an error with status 0 ', () => {
        const email = '';
        const image = new Blob();
        const fileName = '';
        const errorMessage = 'error';
        communicationServiceSpy.postEmail.and.callFake(() => {
            return throwError({ status: 0, error: errorMessage } as HttpErrorResponse);
        });
        const spyEmitSendEmailSubjectEvent = spyOn(service.sendEmailSubject, 'next').and.callFake(() => {
            return;
        });
        service.postEmail(email, image, fileName);
        expect(communicationServiceSpy.postEmail).toHaveBeenCalled();
        expect(spyEmitSendEmailSubjectEvent).toHaveBeenCalled();
        expect(spyEmitSendEmailSubjectEvent.calls.mostRecent().args[0]?.isSuccess).toEqual(false);
        expect(spyEmitSendEmailSubjectEvent.calls.mostRecent().args[0]?.message).toEqual(
            "Une erreur s'est produite, le courriel n'a pas été envoyé!",
        );
    });

    it('postDrawing postDrawing should emit an error with status 0 ', () => {
        const email = '';
        const image = new Blob();
        const fileName = '';
        const errorMessage = 'error';
        communicationServiceSpy.postEmail.and.callFake(() => {
            return throwError({ status: 400, error: errorMessage } as HttpErrorResponse);
        });
        const spyEmitSendEmailSubjectEvent = spyOn(service.sendEmailSubject, 'next').and.callFake(() => {
            return;
        });
        service.postEmail(email, image, fileName);
        expect(communicationServiceSpy.postEmail).toHaveBeenCalled();
        expect(spyEmitSendEmailSubjectEvent).toHaveBeenCalled();
        expect(spyEmitSendEmailSubjectEvent.calls.mostRecent().args[0]?.isSuccess).toEqual(false);
        expect(spyEmitSendEmailSubjectEvent.calls.mostRecent().args[0]?.message).toEqual(errorMessage);
    });

    it('emitSendEmailSubjectEventshould emit the response result', () => {
        spyOn(service.sendEmailSubject, 'next').and.callFake(() => {
            return;
        });
        const response = new ResponseResult(true, '');
        service.emitSendEmailSubjectEvent(response);
        expect(service.sendEmailSubject.next).toHaveBeenCalledWith(response);
    });

    it('sendEmailEventListener should return the saveDrawingSubject as an observable', () => {
        spyOn(service.sendEmailSubject, 'asObservable').and.callThrough();

        service.sendEmailEventListener();
        expect(service.sendEmailSubject.asObservable).toHaveBeenCalled();
    });
});
