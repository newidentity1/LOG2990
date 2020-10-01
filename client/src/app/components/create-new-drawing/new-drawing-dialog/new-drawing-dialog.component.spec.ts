import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NewDrawingDialogComponent } from './new-drawing-dialog.component';

describe('NewDrawingDialogComponent', () => {
    let component: NewDrawingDialogComponent;
    let fixture: ComponentFixture<NewDrawingDialogComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [NewDrawingDialogComponent],
            providers: [
                { provide: MatDialogRef, useValue: {} },
                { provide: MAT_DIALOG_DATA, useValue: [] },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(NewDrawingDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
