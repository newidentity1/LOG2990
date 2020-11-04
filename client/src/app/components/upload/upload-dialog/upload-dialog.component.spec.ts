import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FireBaseService } from '@app/services/firebase/fire-base.service';
import { UploadDialogComponent } from './upload-dialog.component';

describe('UploadDialogComponent', () => {
    let component: UploadDialogComponent;
    let fixture: ComponentFixture<UploadDialogComponent>;
    let fireBaseServiceSpy: jasmine.SpyObj<FireBaseService>;

    const mockDialog = {
        close: jasmine.createSpy('close'),
    };

    beforeEach(async(() => {
        fireBaseServiceSpy = jasmine.createSpyObj('FireBaseService', ['uploadCanvas']);
        TestBed.configureTestingModule({
            declarations: [UploadDialogComponent],
            providers: [
                { provide: FireBaseService, useValue: fireBaseServiceSpy },
                { provide: MatDialog, useValue: mockDialog },
                { provide: MAT_DIALOG_DATA, useValue: [] },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
        fireBaseServiceSpy = TestBed.inject(FireBaseService) as jasmine.SpyObj<FireBaseService>;
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(UploadDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
