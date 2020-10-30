import { TestBed } from '@angular/core/testing';
import { AngularFireStorage } from '@angular/fire/storage';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { DeleteService } from './delete.service';

describe('DeleteService', () => {
    let service: DeleteService;
    let drawingServiceSpy: jasmine.SpyObj<DrawingService>;
    const angularFirestoreStub = {
        ref: (id: string) => {
            // return mocked collection here
        },
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawingServiceSpy },
                { provide: AngularFireStorage, useValue: angularFirestoreStub },
            ],
        });
        service = TestBed.inject(DeleteService);
        drawingServiceSpy = TestBed.inject(DrawingService) as jasmine.SpyObj<DrawingService>;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
