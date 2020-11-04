import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { MAX_COLOR_VALUE, MAX_PREVIEW_SIZE } from '@app/constants/constants';
import { ExportFilterType } from '@app/enums/export-filter.enum';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ExportDrawingDialogComponent } from './export-drawing-dialog.component';

describe('ExportDrawingDialogComponent', () => {
    let component: ExportDrawingDialogComponent;
    let fixture: ComponentFixture<ExportDrawingDialogComponent>;
    let drawingServiceSpy: jasmine.SpyObj<DrawingService>;

    const mockDialogRef = {
        close: jasmine.createSpy('close'),
    };

    beforeEach(async(() => {
        drawingServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas', 'setStrokeColor']);
        TestBed.configureTestingModule({
            declarations: [ExportDrawingDialogComponent],
            imports: [ReactiveFormsModule, FormsModule, MatFormFieldModule, MatInputModule, BrowserAnimationsModule],
            providers: [
                { provide: MatDialogRef, useValue: mockDialogRef },
                { provide: MAT_DIALOG_DATA, useValue: [] },
                { provide: DrawingService, useValue: drawingServiceSpy },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
        drawingServiceSpy = TestBed.inject(DrawingService) as jasmine.SpyObj<DrawingService>;
        drawingServiceSpy.canvas = canvasTestHelper.canvas;
        drawingServiceSpy.baseCtx = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ExportDrawingDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('setInitialCanvasSize should call setPreviewSize', () => {
        // tslint:disable:no-any / reason: accessing private members
        const setPreviewSizeSpy = spyOn<any>(component, 'setPreviewSize').and.callThrough();
        // tslint:disable:no-string-literal / reason: accessing private members
        component['setInitialCanvasSize']();
        expect(setPreviewSizeSpy).toHaveBeenCalled();
    });

    it('setExportSize should change export canvas size to drawing service canvas size', () => {
        // tslint:disable:no-magic-numbers / reason: using random numbers
        component.exportCanvas.nativeElement.width = 10;
        component.exportCanvas.nativeElement.width = 10;
        component['setExportSize']();
        expect(component.exportCanvas.nativeElement.width).toEqual(drawingServiceSpy.canvas.width);
        expect(component.exportCanvas.nativeElement.height).toEqual(drawingServiceSpy.canvas.height);
    });

    it('setPreviewSize should set preview canvas width to max preview size if both width and height are bigger than max preview size and width is smaller than height', () => {
        drawingServiceSpy.canvas.width = MAX_PREVIEW_SIZE * 2;
        drawingServiceSpy.canvas.height = MAX_PREVIEW_SIZE + 1;
        component['setPreviewSize']();
        expect(component.previewCanvas.nativeElement.width).toEqual(MAX_PREVIEW_SIZE);
    });

    it('setPreviewSize should set preview canvas height to max preview size if both width and height are bigger than max preview size and width is bigger than height', () => {
        drawingServiceSpy.canvas.width = MAX_PREVIEW_SIZE + 1;
        drawingServiceSpy.canvas.height = MAX_PREVIEW_SIZE * 2;
        component['setPreviewSize']();
        expect(component.previewCanvas.nativeElement.height).toEqual(MAX_PREVIEW_SIZE);
    });

    it('setPreviewSize should change previewCanvas size if both width and height are bigger than max preview size', () => {
        drawingServiceSpy.canvas.width = MAX_PREVIEW_SIZE + 1;
        drawingServiceSpy.canvas.height = MAX_PREVIEW_SIZE / 2;
        component['setPreviewSize']();
        expect(component.previewCanvas.nativeElement.width).toEqual(MAX_PREVIEW_SIZE);
    });

    it('setPreviewSize should change previewCanvas size if both width and height are bigger than max preview size', () => {
        drawingServiceSpy.canvas.width = MAX_PREVIEW_SIZE / 2;
        drawingServiceSpy.canvas.height = MAX_PREVIEW_SIZE + 1;
        component['setPreviewSize']();
        expect(component.previewCanvas.nativeElement.height).toEqual(MAX_PREVIEW_SIZE);
    });

    it('setPreviewSize should not change previewCanvas size if both width and height are smaller than max preview size', () => {
        drawingServiceSpy.canvas.width = MAX_PREVIEW_SIZE / 2;
        drawingServiceSpy.canvas.height = MAX_PREVIEW_SIZE / 2;
        component['setPreviewSize']();
        expect(component.previewCanvas.nativeElement.width).toEqual(MAX_PREVIEW_SIZE / 2);
        expect(component.previewCanvas.nativeElement.height).toEqual(MAX_PREVIEW_SIZE / 2);
    });

    it('setWhiteBackground should fill canvas with white', () => {
        component.exportCtx.fillStyle = '#000000';
        component.exportCtx.fillRect(0, 0, component.exportCtx.canvas.width, component.exportCtx.canvas.height);
        component['setWhiteBackground'](component.exportCtx);
        const imageData = component.exportCtx.getImageData(0, 0, 1, 1);
        expect(imageData.data[0]).toEqual(MAX_COLOR_VALUE);
    });

    it('setFilterPercentage should change percentage value and call setPreviewFilter ', () => {
        const setPreviewFilterSpy = spyOn<any>(component, 'setPreviewFilter').and.callThrough();
        const expectedValue = 0.5;
        component.setFilterPercentage(expectedValue);
        expect(component.percentage).toEqual(expectedValue);
        expect(setPreviewFilterSpy).toHaveBeenCalled();
    });

    it('setPreviewFilter should call drawImage and setWhiteBackground on previewCtx', () => {
        const setWhiteBackgroundSpy = spyOn<any>(component, 'setWhiteBackground').and.callThrough();
        const drawImageSpy = spyOn<any>(component.previewCtx, 'drawImage').and.callThrough();
        component.setPreviewFilter();
        expect(setWhiteBackgroundSpy).toHaveBeenCalledWith(component.previewCtx);
        expect(drawImageSpy).toHaveBeenCalled();
    });

    it('setPreviewFilter should set exportFilter to blur if selected filter is blur and slider should not be disabled', () => {
        component.selectedFilter = ExportFilterType.Blur;
        component.setPreviewFilter();
        expect(component.sliderIsVisible).toBeTrue();
        expect(component['exportFilter']).toContain('blur');
    });

    it('setPreviewFilter should set exportFilter to brightness if selected filter is brightness and slider should not be disabled', () => {
        component.selectedFilter = ExportFilterType.Brightness;
        component.setPreviewFilter();
        expect(component.sliderIsVisible).toBeTrue();
        expect(component['exportFilter']).toContain('brightness');
    });

    it('setPreviewFilter should set exportFilter to saturation if selected filter is saturation and slider should not be disabled', () => {
        component.selectedFilter = ExportFilterType.Saturation;
        component.setPreviewFilter();
        expect(component.sliderIsVisible).toBeTrue();
        expect(component['exportFilter']).toContain('saturate');
    });

    it('setPreviewFilter should set exportFilter to hue-rotate if selected filter is hue and slider should not be disabled', () => {
        component.selectedFilter = ExportFilterType.Hue;
        component.setPreviewFilter();
        expect(component.sliderIsVisible).toBeTrue();
        expect(component['exportFilter']).toContain('hue-rotate');
    });

    it('setPreviewFilter should set exportFilter to sepia if selected filter is sepia and slider should be disabled', () => {
        component.selectedFilter = ExportFilterType.Sepia;
        component.setPreviewFilter();
        expect(component.sliderIsVisible).toBeFalse();
        expect(component['exportFilter']).toContain('sepia');
    });

    it('setPreviewFilter should set exportFilter to invert if selected filter is invert and slider should be disabled', () => {
        component.selectedFilter = ExportFilterType.Invert;
        component.setPreviewFilter();
        expect(component.sliderIsVisible).toBeFalse();
        expect(component['exportFilter']).toContain('invert');
    });

    it('setImageUrl should set image url of drawingImageContainer', () => {
        component.drawingImageContainer.nativeElement.href = '';
        component['setImageUrl']();
        expect(component.drawingImageContainer.nativeElement.href).not.toEqual('');
    });

    it('onFormatChange should call setImageUrl', () => {
        const setImageUrlSpy = spyOn<any>(component, 'setImageUrl').and.callThrough();
        component['onFormatChange']();
        expect(setImageUrlSpy).toHaveBeenCalled();
    });

    it('downloadImage should call drawImage and setWhiteBackground on exportCtx', () => {
        const setWhiteBackgroundSpy = spyOn<any>(component, 'setWhiteBackground').and.callThrough();
        const drawImageSpy = spyOn<any>(component.exportCtx, 'drawImage').and.callThrough();
        // tslint:disable-next-line:no-empty / reason: calling fake function to avoid automatic image download
        spyOn<any>(component.drawingImageContainer.nativeElement, 'click').and.callFake(() => {});
        component['downloadImage']();
        expect(setWhiteBackgroundSpy).toHaveBeenCalledWith(component.exportCtx);
        expect(drawImageSpy).toHaveBeenCalled();
    });

    it('downloadImage should set image url and download image', () => {
        const setImageUrlSpy = spyOn<any>(component, 'setImageUrl').and.callThrough();
        // tslint:disable-next-line:no-empty / reason: calling fake function to avoid automatic image download
        const clickSpy = spyOn<any>(component.drawingImageContainer.nativeElement, 'click').and.callFake(() => {});
        component['downloadImage']();
        expect(setImageUrlSpy).toHaveBeenCalled();
        expect(clickSpy).toHaveBeenCalled();
        expect(mockDialogRef.close).toHaveBeenCalled();
    });
});
