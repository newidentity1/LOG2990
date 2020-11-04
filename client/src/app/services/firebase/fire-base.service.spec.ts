import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AngularFireStorage, AngularFireStorageReference } from '@angular/fire/storage';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { FireBaseService } from './fire-base.service';

describe('FireBaseService', () => {
    let service: FireBaseService;
    let angularFireStorageSpy: jasmine.SpyObj<AngularFireStorage>;

    beforeEach(() => {
        angularFireStorageSpy = jasmine.createSpyObj('AngularFireStorage', ['ref']);
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [{ provide: AngularFireStorage, useValue: angularFireStorageSpy }],
        });
        service = TestBed.inject(FireBaseService);
        angularFireStorageSpy = TestBed.inject(AngularFireStorage) as jasmine.SpyObj<AngularFireStorage>;
        service.drawingService.canvas = canvasTestHelper.canvas;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('postDraw should add new draw to the MongoDB', () => {
        service.id = 'test';
        service.url = 'test';
        service.postDraw();
        // tslint:disable-next-line:no-string-literal
        const spy = spyOn(service['communicationService'], 'postDraw');
        expect(spy).not.toHaveBeenCalled();
    });

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
        const refMock: AngularFireStorageReference = jasmine.createSpyObj('AngularFireStorageReference', ['delete']);
        angularFireStorageSpy.ref.and.returnValue(refMock);
        const spyReset = spyOn(service, 'reset');

        service.deleteImage('0');
        expect(service.ref).toBeDefined();
        expect(refMock.delete).toHaveBeenCalled();
        expect(spyReset).toHaveBeenCalled();
    });

    it('Reset should reset the url and the id ', () => {
        service.reset();
        expect(service.id).toEqual('');
        expect(service.url).toEqual('');
    });
});
