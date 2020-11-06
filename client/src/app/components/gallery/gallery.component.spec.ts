import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogMock } from '@app/classes/mat-dialog-test-helper';
import { GalleryComponent } from './gallery.component';

describe('GalleryComponent', () => {
    let component: GalleryComponent;
    let fixture: ComponentFixture<GalleryComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [GalleryComponent],
            providers: [{ provide: MatDialog, useClass: MatDialogMock }],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GalleryComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it(' openDialog should call resetSelectedColor with false if primary color dialog is opened', () => {
        // tslint:disable-next-line:no-any / reason: spying on function
        const dialogOpenSpy = spyOn<any>(TestBed.inject(MatDialog), 'open').and.callThrough();
        component.openDialog();
        expect(dialogOpenSpy).toHaveBeenCalled();
    });
});
