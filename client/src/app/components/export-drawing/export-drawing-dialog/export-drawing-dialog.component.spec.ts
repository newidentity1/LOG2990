import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ExportDrawingDialogComponent } from './export-drawing-dialog.component';

describe('ExportDrawingDialogComponent', () => {
    let component: ExportDrawingDialogComponent;
    let fixture: ComponentFixture<ExportDrawingDialogComponent>;
    let drawingServiceSpy: jasmine.SpyObj<DrawingService>;

    const mockDialog = {
        close: jasmine.createSpy('close'),
    };
    beforeEach(async(() => {
        drawingServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas', 'setStrokeColor']);
        TestBed.configureTestingModule({
            declarations: [ExportDrawingDialogComponent],
            providers: [
                { provide: MatDialog, useValue: mockDialog },
                { provide: MAT_DIALOG_DATA, useValue: [] },
                { provide: DrawingService, useValue: drawingServiceSpy },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
        drawingServiceSpy = TestBed.inject(DrawingService) as jasmine.SpyObj<DrawingService>;
        drawingServiceSpy.canvas = canvasTestHelper.canvas;
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ExportDrawingDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
