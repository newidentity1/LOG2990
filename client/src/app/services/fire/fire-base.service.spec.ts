import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AngularFireStorage } from '@angular/fire/storage';
import { FireBaseService } from './fire-base.service';

describe('FireBaseService', () => {
    let service: FireBaseService;
    const angularFirestoreStub = {
        ref: (id: string) => {
            // return mocked collection here
        },
    };
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [{ provide: AngularFireStorage, useValue: angularFirestoreStub }],
        });
        service = TestBed.inject(FireBaseService);
        const drawingCanvas = document.createElement('canvas');
        service.drawingService.canvas = drawingCanvas;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    // it('postDraw should add new draw to the MongoDB', () => {
    //     service.id = 'test';
    //     service.url = 'test';
    //     service.postDraw();
    //     // tslint:disable-next-line:no-string-literal
    //     const spy = spyOn(service['communicationService'], 'postDraw');
    //     expect(spy).not.toHaveBeenCalled();
    // });

    it('UploadCanvas should upload the current canvas', () => {
        // tslint:disable-next-line: no-any
        const spy = spyOn<any>(service, 'downloadCanvasURL');
        service.uploadCanvas();
        expect(spy).not.toHaveBeenCalled();
    });

    // it('DownloadURL should get the back URL from firebase', () => {
    //     // tslint:disable-next-line:quotemark
    //     const spy = spyOn(service, 'reset');
    //     // tslint:disable-next-line: no-string-literal
    //     service.ref = service['afStorage'].ref('test');
    //     service.downloadCanvasURL();
    //     expect(spy).toHaveBeenCalled();
    // });

    it('DeleteImage should delete the image on the fireBase data', () => {
        // tslint:disable-next-line:no-any
        const spy = spyOn<any>(service, 'reset');
        service.uploadCanvas();
        service.deleteImage(service.id);
        expect(spy).toHaveBeenCalled();
    });

    it('Reset should reset the url and the id ', () => {
        service.reset();
        expect(service.id).toEqual('');
        expect(service.url).toEqual('');
    });
});
