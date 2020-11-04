import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Drawing } from '@common/communication/drawing';
import { CommunicationService } from './communication.service';

describe('CommunicationService', () => {
    let service: CommunicationService;
    let httpMock: HttpTestingController;
    const url = 'http://localhost:3000/api/drawings/';

    beforeEach(() => {
        TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
        service = TestBed.inject(CommunicationService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('DeleteDrawing should delete the specific drawing (ID) on the server', () => {
        service.deleteDrawing('test').subscribe((result) => {
            expect(result).toEqual('deleted');
        });
        const request = httpMock.expectOne(url + 'test');
        expect(request.request.method).toEqual('DELETE');
        request.flush('deleted');
    });

    it('getDrawings should receive all the drawings present on the server', () => {
        const fakeDrawing: Drawing = { _id: 'test', name: 'test', tags: [], url: 'test' };
        service.getDrawings().subscribe((result) => {
            expect(result[0]).toEqual(fakeDrawing);
        });
        const request = httpMock.expectOne(url);
        expect(request.request.method).toEqual('GET');
        request.flush([fakeDrawing]);
    });

    it('postDrawing should send drawing to the server', () => {
        const fakeDrawing: Drawing = { _id: 'test', name: 'test', tags: [], url: 'test' };
        service.postDrawing(fakeDrawing).subscribe((result) => {
            expect(result).toEqual('Created');
        });
        const request = httpMock.expectOne(url);
        expect(request.request.method).toEqual('POST');
        request.flush('Created');
    });
});
