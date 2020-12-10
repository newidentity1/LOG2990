import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ResponseResult } from '@app/classes/response-result';
import { FireBaseService } from '@app/services/fire-base/fire-base.service';
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
            imports: [MatSnackBarModule, ReactiveFormsModule, FormsModule],
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
        fireBaseServiceSpy.uploadCanvas.and.callFake(() => {
            return;
        });
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(UploadDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should open snackbar with ResponseResult true', () => {
        component.ngOnInit();
        expect(fireBaseServiceSpy.saveDrawingEventListener).toHaveBeenCalled();
        expect(mockSnackbar.open).toHaveBeenCalled();
    });

    it('should open snackbar with ResponseResult false', () => {
        fireBaseServiceSpy.saveDrawingEventListener.and.returnValue(of(new ResponseResult(false, '')));
        component.ngOnInit();
        expect(fireBaseServiceSpy.saveDrawingEventListener).toHaveBeenCalled();
        expect(mockSnackbar.open).toHaveBeenCalled();
    });

    it(' uploadImage should call uploadCanvas of firebaseService ', () => {
        component.titleForm.setValue('test');
        component.drawingTags = ['test1'];
        component.uploadImage();
        expect(fireBaseServiceSpy.name).toEqual('test');
        expect(fireBaseServiceSpy.drawingTags).toEqual(['test1']);
        expect(fireBaseServiceSpy.uploadCanvas).toHaveBeenCalled();
    });

    it(' validateTitle should return true when title is valid ', () => {
        component.titleForm.setValue('validTitle');
        expect(component.validateTitle('validTitle')).toEqual(true);
    });

    it(' validateTag should return true when tag is valid ', () => {
        component.tagForm.setValue('validTag');
        expect(component.validateTag('validTag')).toEqual(true);
    });

    it(' addTag should add the tag ', () => {
        component.addTag('validTag');
        expect(component.drawingTags.length).toEqual(1);
        expect(component.drawingTags[0]).toEqual('validTag');
    });

    it(' deleteTag should delete the tag if it exist', () => {
        component.addTag('validTag');
        component.deleteTag('validTag');
        expect(component.drawingTags.length).toEqual(0);
    });

    it(' deleteTag should not delete the tag if it doesnt exist', () => {
        component.addTag('validTag');
        component.deleteTag('invalidTag');
        expect(component.drawingTags.length).toEqual(1);
        expect(component.drawingTags[0]).toEqual('validTag');
    });

    it(' isTitleInputEmpty should return true if current title is empty', () => {
        component.titleForm.setValue('');
        expect(component.isTitleInputEmpty()).toEqual(true);
    });

    it(' isTitleInputEmpty should return false if current title is not empty', () => {
        component.titleForm.setValue('title');
        expect(component.isTitleInputEmpty()).toEqual(false);
    });

    it(' isTagInputEmpty should return true if current tag is empty', () => {
        component.tagForm.setValue('');
        expect(component.isTagInputEmpty()).toEqual(true);
    });

    it(' isTagInputEmpty should return false if current tag is not empty', () => {
        component.tagForm.setValue('tag');
        expect(component.isTagInputEmpty()).toEqual(false);
    });
});
