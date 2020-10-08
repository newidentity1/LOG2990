import { TestBed } from '@angular/core/testing';
import { RectangleSelectService } from './rectangle-select.service';

describe('RectangleSelectService', () => {
    let service: RectangleSelectService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(RectangleSelectService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
