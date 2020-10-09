import { TestBed } from '@angular/core/testing';
import { EllipseSelectService } from './ellipse-select.service';

describe('EllipseSelectService', () => {
    let service: EllipseSelectService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(EllipseSelectService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
