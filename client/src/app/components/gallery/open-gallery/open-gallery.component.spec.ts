import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogMock } from '@app/classes/mat-dialog-test-helper';
import { OpenGalleryComponent } from './open-gallery.component';

describe('OpenGalleryComponent', () => {
    let component: OpenGalleryComponent;
    let fixture: ComponentFixture<OpenGalleryComponent>;
    // tslint:disable:no-any / reason: jasmine spy
    let dialogOpenSpy: jasmine.Spy<any>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [OpenGalleryComponent],
            providers: [{ provide: MatDialog, useClass: MatDialogMock }],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
        dialogOpenSpy = spyOn<any>(TestBed.inject(MatDialog), 'open').and.callThrough();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(OpenGalleryComponent);
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
