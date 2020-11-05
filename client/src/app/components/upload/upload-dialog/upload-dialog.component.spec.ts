import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ResponseResult } from '@app/classes/response-result';
import { FireBaseService } from '@app/services/firebase/fire-base.service';
import { of } from 'rxjs';
import { UploadDialogComponent } from './upload-dialog.component';

describe('UploadDialogComponent', () => {
    let component: UploadDialogComponent;
    let fixture: ComponentFixture<UploadDialogComponent>;
    let fireBaseServiceSpy: jasmine.SpyObj<FireBaseService>;

    const mockDialog = {
        close: jasmine.createSpy('close'),
    };

    const mockSnackbar = {
        open: jasmine.createSpy('open'),
    };

    beforeEach(async(() => {
        fireBaseServiceSpy = jasmine.createSpyObj('FireBaseService', ['uploadCanvas', 'saveDrawingEventListener']);
        TestBed.configureTestingModule({
            imports: [MatSnackBarModule],
            declarations: [UploadDialogComponent],
            providers: [
                { provide: FireBaseService, useValue: fireBaseServiceSpy },
                { provide: MatDialog, useValue: mockDialog },
                { provide: MAT_DIALOG_DATA, useValue: [] },
                { provide: MatSnackBar, useValue: mockSnackbar },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
        fireBaseServiceSpy = TestBed.inject(FireBaseService) as jasmine.SpyObj<FireBaseService>;
        fireBaseServiceSpy.saveDrawingEventListener.and.returnValue(of(new ResponseResult(true, '')));
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
