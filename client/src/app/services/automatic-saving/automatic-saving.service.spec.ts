import { TestBed } from '@angular/core/testing';

import { AutomaticSavingService } from './automatic-saving.service';

describe('AutomaticSavingService', () => {
    let service: AutomaticSavingService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(AutomaticSavingService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
