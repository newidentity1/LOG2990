import { TestBed } from '@angular/core/testing';
import { LineService } from './line.service';

describe('LineServiceService', () => {
    let service: LineService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(LineService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
