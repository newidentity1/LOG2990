import { TestBed } from '@angular/core/testing';

import { RotateSelectionService } from './rotate-selection.service';

describe('RotateSelectionService', () => {
    let service: RotateSelectionService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(RotateSelectionService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
