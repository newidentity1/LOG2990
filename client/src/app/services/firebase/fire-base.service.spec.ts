import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { CommunicationService } from '@app/services/communication/communication.service';
import { of } from 'rxjs';
import { FireBaseService } from './fire-base.service';

describe('FireBaseService', () => {
    let service: FireBaseService;
    let angularFireStorageSpy: jasmine.SpyObj<AngularFireStorage>;
    let communicationServiceSpy: jasmine.SpyObj<CommunicationService>;
    let refMock: jasmine.SpyObj<AngularFireStorageReference>;

    beforeEach(() => {
        angularFireStorageSpy = jasmine.createSpyObj('AngularFireStorage', ['ref']);
        communicationServiceSpy = jasmine.createSpyObj('CommunicationService', ['postDrawing']);
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

        service.drawingService.canvas = canvasTestHelper.canvas;
        refMock = jasmine.createSpyObj('AngularFireStorageReference', ['delete', 'put', 'getDownloadURL']);
        angularFireStorageSpy.ref.and.returnValue(refMock);
        communicationServiceSpy.postDrawing.and.returnValue(of(''));
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('postDraw should add new draw to the MongoDB', () => {
        service.id = 'test';
        const url = 'test';
        service.postDraw(url);
        expect(communicationServiceSpy.postDrawing).toHaveBeenCalled();
    });

    it('UploadCanvas should upload the current canvas', () => {
        const spyToBlob = spyOn(service.drawingService.canvas, 'toBlob').and.callFake(() => {
            return;
        });

        service.uploadCanvas();
        expect(spyToBlob).toHaveBeenCalledWith(service.uploadBlob);
    });

    it('uploadBlob should upload the current canvas and call downloadCanvasURL', () => {
        const taskMock: jasmine.SpyObj<AngularFireUploadTask> = jasmine.createSpyObj('AngularFireUploadTask', ['snapshotChanges']);

        angularFireStorageSpy.ref.and.returnValue(refMock);
        refMock.put.and.returnValue(taskMock);

        const eventMock: jasmine.SpyObj<firebase.storage.UploadTaskSnapshot> = jasmine.createSpyObj('firebase.storage.UploadTaskSnapshot', ['']);
        eventMock.state = 'success';
        taskMock.snapshotChanges.and.returnValue(of(eventMock));

        const spyDownloadCanvasURL = spyOn(service, 'downloadCanvasURL').and.callFake(() => {
            return;
        });

        service.uploadBlob(null);
        expect(angularFireStorageSpy.ref).toHaveBeenCalled();
        expect(refMock.put).toHaveBeenCalled();
        expect(taskMock.snapshotChanges).toHaveBeenCalled();
        expect(spyDownloadCanvasURL).toHaveBeenCalled();
    });

    it('uploadBlob should upload the current canvas and not call downloadCanvasURL', () => {
        const taskMock: jasmine.SpyObj<AngularFireUploadTask> = jasmine.createSpyObj('AngularFireUploadTask', ['snapshotChanges']);

        angularFireStorageSpy.ref.and.returnValue(refMock);
        refMock.put.and.returnValue(taskMock);

        const eventMock: jasmine.SpyObj<firebase.storage.UploadTaskSnapshot> = jasmine.createSpyObj('firebase.storage.UploadTaskSnapshot', ['']);
        taskMock.snapshotChanges.and.returnValue(of(eventMock));

        const spyDownloadCanvasURL = spyOn(service, 'downloadCanvasURL').and.callFake(() => {
            return;
        });

        service.uploadBlob(null);
        expect(angularFireStorageSpy.ref).toHaveBeenCalled();
        expect(refMock.put).toHaveBeenCalled();
        expect(taskMock.snapshotChanges).toHaveBeenCalled();
        expect(spyDownloadCanvasURL).not.toHaveBeenCalled();
    });

    it('DownloadURL should get the back URL from firebase', () => {
        const url = 'testURL';
        refMock.getDownloadURL.and.returnValue(of(url));
        const spyPostDraw = spyOn(service, 'postDraw').and.callFake(() => {
            return;
        });
        const spyReset = spyOn(service, 'reset').and.callThrough();

        service.ref = refMock;
        service.downloadCanvasURL();
        expect(refMock.getDownloadURL).toHaveBeenCalled();
        expect(spyPostDraw).toHaveBeenCalledWith(url);
        expect(spyReset).toHaveBeenCalled();
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
});
