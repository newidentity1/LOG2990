import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { ResponseResult } from '@app/classes/response-result';
import { CommunicationService } from '@app/services/communication/communication.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { of, Subject, throwError } from 'rxjs';
import { FireBaseService } from './fire-base.service';

describe('FireBaseService', () => {
    let service: FireBaseService;
    let angularFireStorageSpy: jasmine.SpyObj<AngularFireStorage>;
    let communicationServiceSpy: jasmine.SpyObj<CommunicationService>;
    let drawingServiceSpy: jasmine.SpyObj<DrawingService>;
    let refMock: jasmine.SpyObj<AngularFireStorageReference>;

    beforeEach(() => {
        angularFireStorageSpy = jasmine.createSpyObj('AngularFireStorage', ['ref']);
        communicationServiceSpy = jasmine.createSpyObj('CommunicationService', ['postDrawing']);
        drawingServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas', 'setColor', 'setFillColor', 'setStrokeColor', 'setThickness']);
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                { provide: AngularFireStorage, useValue: angularFireStorageSpy },
                { provide: CommunicationService, useValue: communicationServiceSpy },
            ],
        });
        service = TestBed.inject(FireBaseService);
        angularFireStorageSpy = TestBed.inject(AngularFireStorage) as jasmine.SpyObj<AngularFireStorage>;
        communicationServiceSpy = TestBed.inject(CommunicationService) as jasmine.SpyObj<CommunicationService>;
        drawingServiceSpy = TestBed.inject(DrawingService) as jasmine.SpyObj<DrawingService>;
        drawingServiceSpy.canvas = canvasTestHelper.canvas;
        drawingServiceSpy.baseCtx = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        drawingServiceSpy.previewCtx = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;

        refMock = jasmine.createSpyObj('AngularFireStorageReference', ['delete', 'put', 'getDownloadURL']);
        angularFireStorageSpy.ref.and.returnValue(refMock);
        communicationServiceSpy.postDrawing.and.returnValue(of(''));
        service.saveDrawingSubject = new Subject<ResponseResult>();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('postDrawing should add new draw to the MongoDB and emit a success', () => {
        service.id = 'test';
        const url = 'test';
        const spyEmitSaveDrawingSubjectEvent = spyOn(service, 'emitSaveDrawingSubjectEvent').and.callFake(() => {
            return;
        });
        service.postDrawing(url);
        expect(communicationServiceSpy.postDrawing).toHaveBeenCalled();
        expect(spyEmitSaveDrawingSubjectEvent).toHaveBeenCalled();
        expect(service.isDrawingSaving).toEqual(false);
        expect(spyEmitSaveDrawingSubjectEvent.calls.mostRecent().args[0].isSuccess).toEqual(true);
    });

    it('postDrawing should emit an error with status 0 ', () => {
        service.id = 'test';
        const url = 'test';
        const errorMessage = 'error';
        communicationServiceSpy.postDrawing.and.callFake(() => {
            return throwError({ status: 0, error: errorMessage } as HttpErrorResponse);
        });
        const spyEmitSaveDrawingSubjectEvent = spyOn(service, 'emitSaveDrawingSubjectEvent').and.callFake(() => {
            return;
        });
        service.postDrawing(url);
        expect(communicationServiceSpy.postDrawing).toHaveBeenCalled();
        expect(spyEmitSaveDrawingSubjectEvent).toHaveBeenCalled();
        expect(service.isDrawingSaving).toEqual(false);
        expect(spyEmitSaveDrawingSubjectEvent.calls.mostRecent().args[0].isSuccess).toEqual(false);
        expect(spyEmitSaveDrawingSubjectEvent.calls.mostRecent().args[0].message).toEqual('Le serveur est indisponible!');
    });

    it('postDrawing should emit an error with status not 0 ', () => {
        service.id = 'test';
        const url = 'test';
        const errorMessage = 'error';
        communicationServiceSpy.postDrawing.and.callFake(() => {
            return throwError({ status: 400, error: errorMessage } as HttpErrorResponse);
        });
        const spyEmitSaveDrawingSubjectEvent = spyOn(service, 'emitSaveDrawingSubjectEvent').and.callFake(() => {
            return;
        });
        service.postDrawing(url);
        expect(communicationServiceSpy.postDrawing).toHaveBeenCalled();
        expect(spyEmitSaveDrawingSubjectEvent).toHaveBeenCalled();
        expect(service.isDrawingSaving).toEqual(false);
        expect(spyEmitSaveDrawingSubjectEvent.calls.mostRecent().args[0].isSuccess).toEqual(false);
        expect(spyEmitSaveDrawingSubjectEvent.calls.mostRecent().args[0].message).toEqual(errorMessage);
    });

    it('postDrawing should add new draw to the MongoDB', () => {
        service.id = 'test';
        const url = 'test';
        service.postDrawing(url);
        expect(communicationServiceSpy.postDrawing).toHaveBeenCalled();
    });

    it('UploadCanvas should upload the current canvas', () => {
        const spyToBlob = spyOn(service.drawingService.canvas, 'toBlob').and.callFake(() => {
            return;
        });

        service.uploadCanvas();
        expect(spyToBlob).toHaveBeenCalled();
    });

    it('uploadBlob should upload the current canvas,call downloadCanvasURL and restore the canvas', () => {
        const taskMock: jasmine.SpyObj<AngularFireUploadTask> = jasmine.createSpyObj('AngularFireUploadTask', ['snapshotChanges']);

        angularFireStorageSpy.ref.and.returnValue(refMock);
        refMock.put.and.returnValue(taskMock);

        const eventMock: jasmine.SpyObj<firebase.storage.UploadTaskSnapshot> = jasmine.createSpyObj('firebase.storage.UploadTaskSnapshot', ['']);
        eventMock.state = 'success';
        taskMock.snapshotChanges.and.returnValue(of(eventMock));

        const spyDownloadCanvasURL = spyOn(service, 'downloadCanvasURL').and.callFake(() => {
            return;
        });

        const spyRestoreCanvas = spyOn(service, 'restoreCanvas').and.callFake(() => {
            return;
        });

        service.uploadBlob(null);
        expect(angularFireStorageSpy.ref).toHaveBeenCalled();
        expect(refMock.put).toHaveBeenCalled();
        expect(taskMock.snapshotChanges).toHaveBeenCalled();
        expect(spyDownloadCanvasURL).toHaveBeenCalled();
        expect(spyRestoreCanvas).toHaveBeenCalled();
    });

    it('uploadBlob should not upload the current canvas and has a canceled state', () => {
        const taskMock: jasmine.SpyObj<AngularFireUploadTask> = jasmine.createSpyObj('AngularFireUploadTask', ['snapshotChanges']);

        angularFireStorageSpy.ref.and.returnValue(refMock);
        refMock.put.and.returnValue(taskMock);

        const eventMock: jasmine.SpyObj<firebase.storage.UploadTaskSnapshot> = jasmine.createSpyObj('firebase.storage.UploadTaskSnapshot', ['']);
        eventMock.state = 'canceled';
        taskMock.snapshotChanges.and.returnValue(of(eventMock));

        const spyRestoreCanvas = spyOn(service, 'restoreCanvas').and.callFake(() => {
            return;
        });
        const spyDownloadCanvasURL = spyOn(service, 'downloadCanvasURL').and.callFake(() => {
            return;
        });

        service.uploadBlob(null);
        expect(angularFireStorageSpy.ref).toHaveBeenCalled();
        expect(refMock.put).toHaveBeenCalled();
        expect(taskMock.snapshotChanges).toHaveBeenCalled();
        expect(spyDownloadCanvasURL).not.toHaveBeenCalled();
        expect(spyRestoreCanvas).toHaveBeenCalled();
    });

    it('uploadBlob should not upload the current canvas aand has a error state', () => {
        const taskMock: jasmine.SpyObj<AngularFireUploadTask> = jasmine.createSpyObj('AngularFireUploadTask', ['snapshotChanges']);

        angularFireStorageSpy.ref.and.returnValue(refMock);
        refMock.put.and.returnValue(taskMock);

        const eventMock: jasmine.SpyObj<firebase.storage.UploadTaskSnapshot> = jasmine.createSpyObj('firebase.storage.UploadTaskSnapshot', ['']);
        eventMock.state = 'error';
        taskMock.snapshotChanges.and.returnValue(of(eventMock));

        const spyRestoreCanvas = spyOn(service, 'restoreCanvas').and.callFake(() => {
            return;
        });
        const spyDownloadCanvasURL = spyOn(service, 'downloadCanvasURL').and.callFake(() => {
            return;
        });

        service.uploadBlob(null);
        expect(angularFireStorageSpy.ref).toHaveBeenCalled();
        expect(refMock.put).toHaveBeenCalled();
        expect(taskMock.snapshotChanges).toHaveBeenCalled();
        expect(spyDownloadCanvasURL).not.toHaveBeenCalled();
        expect(spyRestoreCanvas).toHaveBeenCalled();
    });

    it('uploadBlob should not upload the current canvas and and has an undefined state', () => {
        const taskMock: jasmine.SpyObj<AngularFireUploadTask> = jasmine.createSpyObj('AngularFireUploadTask', ['snapshotChanges']);

        angularFireStorageSpy.ref.and.returnValue(refMock);
        refMock.put.and.returnValue(taskMock);

        const eventMock: jasmine.SpyObj<firebase.storage.UploadTaskSnapshot> = jasmine.createSpyObj('firebase.storage.UploadTaskSnapshot', ['']);
        taskMock.snapshotChanges.and.returnValue(of(eventMock));

        const spyRestoreCanvas = spyOn(service, 'restoreCanvas').and.callFake(() => {
            return;
        });
        const spyDownloadCanvasURL = spyOn(service, 'downloadCanvasURL').and.callFake(() => {
            return;
        });

        service.uploadBlob(null);
        expect(angularFireStorageSpy.ref).toHaveBeenCalled();
        expect(refMock.put).toHaveBeenCalled();
        expect(taskMock.snapshotChanges).toHaveBeenCalled();
        expect(spyDownloadCanvasURL).not.toHaveBeenCalled();
        expect(spyRestoreCanvas).toHaveBeenCalled();
    });

    it('uploadBlob should not upload the current canvas andand has another state', () => {
        const taskMock: jasmine.SpyObj<AngularFireUploadTask> = jasmine.createSpyObj('AngularFireUploadTask', ['snapshotChanges']);

        angularFireStorageSpy.ref.and.returnValue(refMock);
        refMock.put.and.returnValue(taskMock);

        const eventMock: jasmine.SpyObj<firebase.storage.UploadTaskSnapshot> = jasmine.createSpyObj('firebase.storage.UploadTaskSnapshot', ['']);
        eventMock.state = '';
        taskMock.snapshotChanges.and.returnValue(of(eventMock));

        const spyRestoreCanvas = spyOn(service, 'restoreCanvas').and.callFake(() => {
            return;
        });
        const spyDownloadCanvasURL = spyOn(service, 'downloadCanvasURL').and.callFake(() => {
            return;
        });

        service.uploadBlob(null);
        expect(angularFireStorageSpy.ref).toHaveBeenCalled();
        expect(refMock.put).toHaveBeenCalled();
        expect(taskMock.snapshotChanges).toHaveBeenCalled();
        expect(spyDownloadCanvasURL).not.toHaveBeenCalled();
        expect(spyRestoreCanvas).toHaveBeenCalled();
    });

    it('restoreCanvas should restore the old image data', () => {
        const spyClearRect = spyOn(service.drawingService.baseCtx, 'clearRect').and.callFake(() => {
            return;
        });
        const spyPutImageData = spyOn(service.drawingService.baseCtx, 'putImageData').and.callFake(() => {
            return;
        });
        service.canvasData = new ImageData(1, 1);
        service.restoreCanvas();
        expect(spyClearRect).toHaveBeenCalledWith(0, 0, service.drawingService.canvas.width, service.drawingService.canvas.height);
        expect(spyPutImageData).toHaveBeenCalled();
    });

    it('DownloadCanvasURL should get the back URL from firebase', () => {
        const url = 'testURL';
        refMock.getDownloadURL.and.returnValue(of(url));
        const spyPostDrawing = spyOn(service, 'postDrawing').and.callFake(() => {
            return;
        });
        const spyReset = spyOn(service, 'reset').and.callThrough();

        service.ref = refMock;
        service.downloadCanvasURL();
        expect(refMock.getDownloadURL).toHaveBeenCalled();
        expect(spyPostDrawing).toHaveBeenCalledWith(url);
        expect(spyReset).toHaveBeenCalled();
    });

    it('DownloadCanvasURL should emitSaveDrawingSubjectEvent on error', () => {
        const errorMessage = 'error';
        refMock.getDownloadURL.and.callFake(() => {
            return throwError(new Error(errorMessage));
        });

        const spyReset = spyOn(service, 'reset').and.callThrough();
        const spyEmitSaveDrawingSubjectEvent = spyOn(service, 'emitSaveDrawingSubjectEvent').and.callFake(() => {
            return;
        });
        service.isDrawingSaving = true;
        service.ref = refMock;
        service.downloadCanvasURL();
        expect(refMock.getDownloadURL).toHaveBeenCalled();
        expect(spyReset).toHaveBeenCalled();
        expect(spyEmitSaveDrawingSubjectEvent).toHaveBeenCalled();
        expect(service.isDrawingSaving).toEqual(false);
    });

    it('DeleteImage should delete the image on the fireBase data', () => {
        const spyReset = spyOn(service, 'reset');

        service.deleteImage('0');
        expect(service.ref).toBeDefined();
        expect(refMock.delete).toHaveBeenCalled();
        expect(spyReset).toHaveBeenCalled();
    });

    it('Reset should reset the url and the id ', () => {
        service.reset();
        expect(service.id).toEqual('');
    });

    it('emitSaveDrawingSubjectEvent should emit the response result', () => {
        const spySaveDrawingSubject = spyOn(service.saveDrawingSubject, 'next').and.callFake(() => {
            return;
        });
        const response = new ResponseResult(true, '');
        service.emitSaveDrawingSubjectEvent(response);
        expect(spySaveDrawingSubject).toHaveBeenCalledWith(response);
    });

    it('saveDrawingEventListener should return the saveDrawingSubject as an observable', () => {
        const spySaveDrawingSubject = spyOn(service.saveDrawingSubject, 'asObservable').and.callThrough();

        service.saveDrawingEventListener();
        expect(spySaveDrawingSubject).toHaveBeenCalled();
    });
});
