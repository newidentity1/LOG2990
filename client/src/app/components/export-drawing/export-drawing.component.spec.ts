import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogMock } from '@app/classes/mat-dialog-test-helper';
import { ExportDrawingComponent } from './export-drawing.component';

describe('ExportDrawingComponent', () => {
    let component: ExportDrawingComponent;
    let fixture: ComponentFixture<ExportDrawingComponent>;

    let dialog: MatDialog;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ExportDrawingComponent],
            providers: [
                { provide: MatDialog, useClass: MatDialogMock },
                { provide: MAT_DIALOG_DATA, useValue: [] },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();

        dialog = TestBed.inject(MatDialog);
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ExportDrawingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('exportDrawing should open dialog', () => {
        spyOn(dialog, 'open').and.callThrough();
        component.exportDrawing();
        expect(dialog.open).toHaveBeenCalled();
    });
});
