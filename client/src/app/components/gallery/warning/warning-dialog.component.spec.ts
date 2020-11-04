import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { Drawing } from '@common/communication/drawing';
import { WarningDialogComponent } from './warning-dialog.component';

describe('WarningDialogComponent', () => {
    let component: WarningDialogComponent;
    let fixture: ComponentFixture<WarningDialogComponent>;
    let drawingServiceSpy: jasmine.SpyObj<DrawingService>;
    WarningDialogComponent.drawing = {} as Drawing;

    const mockDialogRef = {
        close: jasmine.createSpy('close'),
    };
    beforeEach(async(() => {
        drawingServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas', 'emitCreateNewDrawingEvent']);
        TestBed.configureTestingModule({
            declarations: [WarningDialogComponent],
            providers: [
                { provide: MatDialogRef, useValue: mockDialogRef },
                { provide: MAT_DIALOG_DATA, useValue: [] },
                { provide: DrawingService, useValue: drawingServiceSpy },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
        drawingServiceSpy = TestBed.inject(DrawingService) as jasmine.SpyObj<DrawingService>;
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(WarningDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('deleteCanvas should clear base Canvas, close dialog and emit CreateNewDrawing', () => {
        component.deleteCanvas();
        expect(drawingServiceSpy.clearCanvas).not.toHaveBeenCalled();
    });

    it('cancel should close dialog', () => {
        component.cancel();
        expect(mockDialogRef.close).toHaveBeenCalled();
    });
});
