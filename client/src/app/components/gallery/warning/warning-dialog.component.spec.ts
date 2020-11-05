import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { Drawing } from '@common/communication/drawing';
import { WarningDialogComponent } from './warning-dialog.component';

describe('WarningDialogComponent', () => {
    let component: WarningDialogComponent;
    let fixture: ComponentFixture<WarningDialogComponent>;
    let drawingServiceSpy: jasmine.SpyObj<DrawingService>;
    // let canvasSpy: jasmine.SpyObj<HTMLCanvasElement>;
    WarningDialogComponent.drawing = {} as Drawing;

    const mockDialogRef = {
        close: jasmine.createSpy('close'),
    };
    beforeEach(async(() => {
        drawingServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas', 'emitCreateNewDrawingEvent']);
        // canvasSpy = jasmine.createSpyObj('DrawingService', ['getContext']);
        TestBed.configureTestingModule({
            declarations: [WarningDialogComponent],
            providers: [
                { provide: MatDialogRef, useValue: mockDialogRef },
                { provide: MAT_DIALOG_DATA, useValue: [] },
                { provide: DrawingService, useValue: drawingServiceSpy },
                // { provide: HTMLCanvasElement, useValue: canvasSpy },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
        drawingServiceSpy = TestBed.inject(DrawingService) as jasmine.SpyObj<DrawingService>;
        // canvasSpy = TestBed.inject(HTMLCanvasElement) as jasmine.SpyObj<HTMLCanvasElement>;
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
        // component.drawingService.canvas = canvasTestHelper.canvas;
        const spyLoadImage = spyOn(component, 'loadImage');
        component.deleteCanvas();
        expect(spyLoadImage).not.toHaveBeenCalled();
    });

    // it('loadImage should set the image on the canvas and close the dialogue', () => {
    //     component.drawingService.canvas = canvasTestHelper.canvas;
    //     // tslint:disable: prefer-const
    //     let baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
    //     let previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
    //     drawingServiceSpy.baseCtx = baseCtxStub; // Jasmine doesnt copy properties with underlying data
    //     drawingServiceSpy.previewCtx = previewCtxStub;
    //     const spyCancel = spyOn(component, 'cancel');
    //     component.loadImage();
    //     expect(spyCancel).toHaveBeenCalled();
    // });

    it('cancel should close dialog', () => {
        component.cancel();
        expect(mockDialogRef.close).toHaveBeenCalled();
    });
});
