import { TestBed } from '@angular/core/testing';
import { WritingTextService } from './writing-text.service';

describe('WritingTextService', () => {
    let service: WritingTextService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(WritingTextService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
