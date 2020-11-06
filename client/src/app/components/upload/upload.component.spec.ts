import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UploadComponent } from './upload.component';

describe('UploadComponent', () => {
    let component: UploadComponent;
    let fixture: ComponentFixture<UploadComponent>;

    const mockDialog = {
        open: jasmine.createSpy('open'),
    };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [UploadComponent],
            providers: [
                { provide: MatDialog, useValue: mockDialog },
                { provide: MAT_DIALOG_DATA, useValue: [] },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(UploadComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should open dialog', () => {
        component.uploadImage();
        expect(component.dialog.open).toHaveBeenCalled();
    });
});
