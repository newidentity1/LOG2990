import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AngularFireStorage } from '@angular/fire/storage';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { UploadService } from './upload.service';

describe('UploadService', () => {
    let service: UploadService;
    let drawingServiceSpy: jasmine.SpyObj<DrawingService>;
    const angularFirestoreStub = {
        ref: (id: string) => {
            // return mocked collection here
        },
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                { provide: DrawingService, useValue: drawingServiceSpy },
                { provide: AngularFireStorage, useValue: angularFirestoreStub },
            ],
        });
        service = TestBed.inject(UploadService);
        drawingServiceSpy = TestBed.inject(DrawingService) as jasmine.SpyObj<DrawingService>;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
