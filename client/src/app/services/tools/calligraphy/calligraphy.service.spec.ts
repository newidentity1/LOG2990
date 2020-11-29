import { TestBed } from '@angular/core/testing';
import { CalligraphyService } from './calligraphy.service';

describe('CalligraphyService', () => {
    let service: CalligraphyService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(CalligraphyService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
