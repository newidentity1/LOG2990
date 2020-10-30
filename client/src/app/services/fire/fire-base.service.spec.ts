import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AngularFireStorage } from '@angular/fire/storage';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { FireBaseService } from './fire-base.service';

describe('FireBaseService', () => {
    let service: FireBaseService;
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
        service = TestBed.inject(FireBaseService);
        drawingServiceSpy = TestBed.inject(DrawingService) as jasmine.SpyObj<DrawingService>;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
