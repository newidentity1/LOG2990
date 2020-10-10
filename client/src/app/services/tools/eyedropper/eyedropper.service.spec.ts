import { TestBed } from '@angular/core/testing';
import { EyedropperService } from './eyedropper.service';

describe('EyedropperService', () => {
    let service: EyedropperService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(EyedropperService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
