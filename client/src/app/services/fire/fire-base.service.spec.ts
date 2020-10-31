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

    // it('UploadCanvas should upload the current canvas', () => {
    //     service.uploadCanvas();
    //     expect(canvasSpy.toDataURL).not.toHaveBeenCalled();
    // });

    // it('DownloadURL should get the back URL from firebase', () => {
    //     // tslint:disable-next-line:quotemark
    //     const ref: AngularFireStorageReference = service[`afStorage`].ref('t');
    //     service.ref = ref;
    //     const spy = spyOn(service.ref.getDownloadURL(), 'subscribe');
    //     service.downloadCanvasURL();
    //     expect(spy).toHaveBeenCalled();
    // });

    // it('DeleteImage should delete the image on the fireBase data', () => {
    //     service.deleteImage('test');
    //     expect(service.id).toEqual('');
    // });

    it('Reset should reset the url and the id ', () => {
        service.reset();
        expect(service.id).toEqual('');
        expect(service.url).toEqual('');
    });
});
