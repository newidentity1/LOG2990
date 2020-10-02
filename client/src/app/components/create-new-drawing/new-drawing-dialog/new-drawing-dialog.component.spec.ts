import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { NewDrawingDialogComponent } from './new-drawing-dialog.component';

describe('NewDrawingDialogComponent', () => {
    let component: NewDrawingDialogComponent;
    let fixture: ComponentFixture<NewDrawingDialogComponent>;
    let drawingServiceSpy: jasmine.SpyObj<DrawingService>;

    const mockDialogRef = {
        close: jasmine.createSpy('close'),
    };
    beforeEach(async(() => {
        drawingServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas', 'emitCreateNewDrawingEvent']);
        TestBed.configureTestingModule({
            declarations: [NewDrawingDialogComponent],
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
        fixture = TestBed.createComponent(NewDrawingDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('deleteCanvas should clear base Canvas, close dialog and emit CreateNewDrawing', () => {
        component.deleteCanvas();
        expect(drawingServiceSpy.clearCanvas).toHaveBeenCalledWith(drawingServiceSpy.baseCtx);
        expect(mockDialogRef.close).toHaveBeenCalled();
        expect(drawingServiceSpy.emitCreateNewDrawingEvent).toHaveBeenCalled();
    });

    it('cancel should close dialog', () => {
        component.cancel();
        expect(mockDialogRef.close).toHaveBeenCalled();
    });
});
