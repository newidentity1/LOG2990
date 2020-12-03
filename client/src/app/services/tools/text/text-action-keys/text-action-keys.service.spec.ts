import { TestBed } from '@angular/core/testing';
import { TextActionKeysService } from './text-action-keys.service';

describe('TextActionKeysService', () => {
    let service: TextActionKeysService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(TextActionKeysService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
