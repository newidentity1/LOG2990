import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';

import { OpenGuideComponent } from './open-guide.component';

class MatDialogMock {
    // When the component calls this.dialog.open(...) we'll return an empty object
    open(): {} {
        return {};
    }
}

describe('OpenGuideComponent', () => {
    let component: OpenGuideComponent;
    let fixture: ComponentFixture<OpenGuideComponent>;
    // tslint:disable:no-any / reason: jasmine spy
    let dialogOpenSpy: jasmine.Spy<any>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [OpenGuideComponent],
            providers: [{ provide: MatDialog, useClass: MatDialogMock }],
        }).compileComponents();
        dialogOpenSpy = spyOn<any>(TestBed.inject(MatDialog), 'open').and.callThrough();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(OpenGuideComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('openPrimaryColorPicker should open dialog from menu', async(() => {
        component.inMenu = true;
        const button = fixture.debugElement.nativeElement.querySelector('button');
        button.click();
        fixture.whenStable().then(() => {
            expect(dialogOpenSpy).toHaveBeenCalled();
        });
    }));

    it('openPrimaryColorPicker should open dialog from drawing view', async(() => {
        component.inMenu = true;
        const button = fixture.debugElement.nativeElement.querySelector('button');
        button.click();
        fixture.whenStable().then(() => {
            expect(dialogOpenSpy).toHaveBeenCalled();
        });
    }));
});
