import { TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatDialogMock } from '@app/classes/mat-dialog-test-helper';
import { ShortcutService } from './shortcut.service';

describe('ShortcutService', () => {
    let service: ShortcutService;
    let matDialogMock: MatDialogMock;
    let event: KeyboardEvent;

    beforeEach(() => {
        matDialogMock = new MatDialogMock();

        TestBed.configureTestingModule({
            providers: [{ provide: MatDialog, useValue: matDialogMock }],
        });
        service = TestBed.inject(ShortcutService);

        event = new KeyboardEvent('keydown', { key: 'z' });
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('shortcut should trigger action if no dialogs are open', () => {
        const fakeObject = jasmine.createSpyObj('fakeObject', ['shortcutCallback']);
        // tslint:disable-next-line:no-empty / reason: creating a fake callback function to spy on
        fakeObject.shortcutCallback.and.callFake(() => {});

        service.addShortcut('z').subscribe(() => {
            fakeObject.shortcutCallback();
        });

        document.dispatchEvent(event);

        expect(fakeObject.shortcutCallback).toHaveBeenCalled();
    });

    it('shortcut should trigger action if no dialogs are open', () => {
        const fakeObject = jasmine.createSpyObj('fakeObject', ['shortcutCallback']);
        // tslint:disable-next-line:no-empty / reason: creating a fake callback function to spy on
        fakeObject.shortcutCallback.and.callFake(() => {});

        service.addShortcut('z').subscribe(() => {
            fakeObject.shortcutCallback();
        });

        // tslint:disable-next-line:no-any / reason: adding a mock MatDialogRef
        matDialogMock.openDialogs.push({} as MatDialogRef<any>);

        document.dispatchEvent(event);

        expect(fakeObject.shortcutCallback).not.toHaveBeenCalled();
    });
});
