import { TestBed } from '@angular/core/testing';
import { MagicWandService } from './magic-wand.service';

fdescribe('MagicWandService', () => {
    let service: MagicWandService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(MagicWandService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
