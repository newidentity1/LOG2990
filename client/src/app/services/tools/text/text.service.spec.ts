import { TestBed } from '@angular/core/testing';
import { ShortcutService } from '@app/services/shortcut/shortcut.service';
import { TextService } from './text.service';

describe('TextService', () => {
    let service: TextService;
    let shortcutServiceSpy: jasmine.SpyObj<ShortcutService>;

    beforeEach(() => {
        shortcutServiceSpy = jasmine.createSpyObj('ShortcutService', ['addShortcut']);
        TestBed.configureTestingModule({
            providers: [{ provide: ShortcutService, useValue: shortcutServiceSpy }],
        });
        service = TestBed.inject(TextService);
        shortcutServiceSpy = TestBed.inject(ShortcutService) as jasmine.SpyObj<ShortcutService>;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
