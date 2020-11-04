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
        service.deleteDraw('test');
        const requests = httpMock.match(url + 'test');
        expect(requests.length).toBe(1);
    });

    it('getDrawings should receive all the drawings present on the server', () => {
        service.getDrawings();
        const requests = httpMock.match(url);
        expect(requests.length).toBe(0);
    });

    it('PostDraw should send drawing to the server', () => {
        const fakeDrawing1: Drawing = { _id: 'test', name: 'test', tags: [], url: 'test' };
        service.postDraw(fakeDrawing1);
        const requests = httpMock.match(url);
        expect(requests.length).toBe(1);
    });
});
