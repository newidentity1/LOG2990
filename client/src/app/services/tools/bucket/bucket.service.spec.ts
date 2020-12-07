import { TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { Color } from '@app/classes/color/color';
import { Pixel } from '@app/classes/pixel';
import * as CONSTANTS from '@app/constants/constants';
import { ColorPickerService } from '@app/services/color-picker/color-picker.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { BehaviorSubject } from 'rxjs';
import { BucketService } from './bucket.service';

describe('BucketService', () => {
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let service: BucketService;
    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let mouseEventClickLeft: MouseEvent;
    let mouseEventClickRight: MouseEvent;
    let colorPickerServiceSpy: jasmine.SpyObj<ColorPickerService>;

    beforeEach(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas', 'setColor', 'setThickness']);
        colorPickerServiceSpy = jasmine.createSpyObj('ColorPickerService', ['swapColors', 'resetSelectedColor']);

        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawServiceSpy },
                { provide: ColorPickerService, useValue: colorPickerServiceSpy },
            ],
        });
        service = TestBed.inject(BucketService);

        colorPickerServiceSpy = TestBed.inject(ColorPickerService) as jasmine.SpyObj<ColorPickerService>;
        colorPickerServiceSpy.primaryColor = new BehaviorSubject<Color>(new Color(CONSTANTS.BLACK));
        colorPickerServiceSpy.secondaryColor = new BehaviorSubject<Color>(new Color(CONSTANTS.WHITE));

        // tslint:disable:no-string-literal
        const drawingCanvas = document.createElement('canvas');
        drawingCanvas.width = canvasTestHelper.canvas.width;
        drawingCanvas.height = canvasTestHelper.canvas.height;
        baseCtxStub = drawingCanvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = drawingCanvas.getContext('2d') as CanvasRenderingContext2D;
        service['drawingService'].baseCtx = baseCtxStub; // Jasmine doesnt copy properties with underlying data
        service['drawingService'].previewCtx = previewCtxStub;
        service['drawingService'].canvas = drawingCanvas;

        mouseEventClickLeft = {
            offsetX: 25,
            offsetY: 25,
            button: 0,
        } as MouseEvent;

        mouseEventClickRight = {
            offsetX: 25,
            offsetY: 25,
            button: 2,
        } as MouseEvent;
        service['width'] = drawingCanvas.width;
        service['height'] = drawingCanvas.height;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should be created', () => {
        const couleur: Color = new Color('RED');
        service.setColors(couleur, couleur);
        expect(drawServiceSpy.setColor).toHaveBeenCalled();
    });

    it('onMouseDown with a left click should call floodFillLeft algorithme', () => {
        // tslint:disable: no-any / reason: spying on private function
        drawServiceSpy.baseCtx.clearRect(0, 0, drawServiceSpy.canvas.width, drawServiceSpy.canvas.height);
        colorPickerServiceSpy.primaryColor = new BehaviorSubject<Color>(new Color('ff0000'));
        const floodFillLeftSpy = spyOn<any>(service, 'floodFillLeft').and.callThrough();
        service.onMouseDown(mouseEventClickLeft);

        expect(floodFillLeftSpy).toHaveBeenCalled();
        expect(service['image'].data[0]).toEqual(CONSTANTS.MAX_COLOR_VALUE);
        expect(service['image'].data[1]).toEqual(0);
        expect(service['image'].data[2]).toEqual(0);
        expect(service['image'].data[CONSTANTS.IMAGE_DATA_OPACITY_INDEX]).toEqual(CONSTANTS.MAX_COLOR_VALUE);
    });

    it('onMouseDown with a right click should call floodFillRight algorithme', () => {
        service['startPixelColor'] = service['drawingService'].baseCtx.getImageData(2, 2, 1, 1).data;
        const floodFillRightSpy = spyOn<any>(service, 'floodFillRight').and.callThrough();
        service.onMouseDown(mouseEventClickRight);
        expect(floodFillRightSpy).toHaveBeenCalled();
    });

    it('onMouseDown with a right click should call floodFillRight algorithme', () => {
        const floodFillRightSpy = spyOn<any>(service, 'floodFillRight').and.callThrough();
        service.onMouseDown(mouseEventClickRight);
        service['image'].data[0] = 1;
        service['image'].data[1] = 1;
        service['image'].data[2] = 1;
        service['image'].data[CONSTANTS.IMAGE_DATA_OPACITY_INDEX] = 1;
        service['drawingService'].baseCtx.putImageData(service['image'], 0, 0);
        service.onMouseDown(mouseEventClickRight);
        expect(floodFillRightSpy).toHaveBeenCalled();
    });

    it('onMouseUp should set mouse Down to false if mouse was down)', () => {
        service.mouseDown = true;
        service.onMouseUp();
        expect(service.mouseDown).toBeFalse();
    });

    it('onMouseUp should set mouseDown to false and emit a command', () => {
        const emitSpy = spyOn(service.executedCommand, 'emit');
        service.mouseDown = true;
        service.onMouseUp();
        expect(emitSpy).toHaveBeenCalled();
        expect(service.mouseDown).toEqual(false);
    });

    it('onMouseUp should do nothing if mouseDown was false', () => {
        const emitSpy = spyOn(service.executedCommand, 'emit');
        service.mouseDown = false;
        service.onMouseUp();
        expect(emitSpy).not.toHaveBeenCalled();
        expect(service.mouseDown).toEqual(false);
    });

    it('floodFillRight should change pixel if matching starting color', () => {
        drawServiceSpy.baseCtx.clearRect(0, 0, drawServiceSpy.canvas.width, drawServiceSpy.canvas.height);
        colorPickerServiceSpy.primaryColor = new BehaviorSubject<Color>(new Color('ff0000'));
        service.onMouseDown(mouseEventClickRight);
        expect(service['image'].data[0]).toEqual(CONSTANTS.MAX_COLOR_VALUE);
        expect(service['image'].data[1]).toEqual(0);
        expect(service['image'].data[2]).toEqual(0);
        expect(service['image'].data[CONSTANTS.IMAGE_DATA_OPACITY_INDEX]).toEqual(CONSTANTS.MAX_COLOR_VALUE);
    });

    it('setTolerance should change toleranceValue', () => {
        const expectedTolerance = 20;
        service.setTolerance(expectedTolerance);
        expect(service['tolerance']).toEqual(CONSTANTS.MAX_COLOR_VALUE * (expectedTolerance / CONSTANTS.MAX_PERCENTAGE));
    });

    it('setTolerance should change toleranceValue', () => {
        service.setTolerance(null);
        expect(service['tolerance']).toEqual(CONSTANTS.MAX_COLOR_VALUE * (1 / CONSTANTS.MAX_PERCENTAGE));
    });

    it('resetContext should reset all the current changes that the tool made', () => {
        service.resetContext();
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
    });

    it('checkColor should verify if the color have to change', () => {
        service.onMouseDown(mouseEventClickRight);
        service['startPixelColor'] = service['drawingService'].baseCtx.getImageData(2, 2, 1, 1).data;
        const p1: Pixel = { x: 2, y: 2, status: 1 };
        const index = (p1.y * drawServiceSpy.canvas.width + p1.x) * (CONSTANTS.IMAGE_DATA_OPACITY_INDEX + 1);
        expect(service['checkColor'](index)).toBeTrue();
    });

    it('checkColor should return false if pixel is out ', () => {
        // tslint:disable-next-line: no-empty / reason: spying on fake function to avoid performance issues during test
        spyOn<any>(service, 'floodFillLeft').and.callFake(() => {});
        service.onMouseDown(mouseEventClickLeft);
        service['startPixelColor'] = service['drawingService'].baseCtx.getImageData(2, 2, 1, 1).data;
        const p1: Pixel = { x: -1, y: -1, status: 0 };
        const index = (p1.y * drawServiceSpy.canvas.width + p1.x) * (CONSTANTS.IMAGE_DATA_OPACITY_INDEX + 1);
        expect(service['checkColor'](index)).toEqual(false);
    });

    it('colorPixel should change pixel to primary color ', () => {
        colorPickerServiceSpy.primaryColor = new BehaviorSubject<Color>(new Color('ff0000'));
        // tslint:disable-next-line: no-empty / reason: spying on fake function to avoid performance issues during test
        spyOn<any>(service, 'floodFillLeft').and.callFake(() => {});
        service.onMouseDown(mouseEventClickLeft);
        service['colorPixel'](0);
        expect(service['image'].data[0]).toEqual(CONSTANTS.MAX_COLOR_VALUE);
        expect(service['image'].data[1]).toEqual(0);
        expect(service['image'].data[2]).toEqual(0);
        expect(service['image'].data[CONSTANTS.IMAGE_DATA_OPACITY_INDEX]).toEqual(CONSTANTS.MAX_COLOR_VALUE);
    });

    it('clone should return a clone of the tool', () => {
        const bucket: BucketService = new BucketService(drawServiceSpy, service['colorPickerService']);
        const spyCopyBucket = spyOn(BucketService.prototype, 'copyBucket');
        const clone = bucket.clone();
        expect(spyCopyBucket).toHaveBeenCalled();
        expect(clone).toEqual(bucket);
    });

    it('copyBucket should copy the bucketService', () => {
        const bucket: BucketService = new BucketService(drawServiceSpy, service['colorPickerService']);
        bucket['startPixelColor'] = service['drawingService'].baseCtx.getImageData(2, 2, 1, 1).data;
        bucket['image'] = service['drawingService'].baseCtx.getImageData(0, 0, service['width'], service['height']);
        const bucketCopy: BucketService = new BucketService(drawServiceSpy, service['colorPickerService']);
        const spyCopyTool = spyOn(BucketService.prototype, 'copyTool');
        bucket.copyBucket(bucketCopy);
        expect(spyCopyTool).toHaveBeenCalled();
        expect(bucket).toEqual(bucketCopy);
    });

    it('changeTransparentToWhite should change pixel to white if transparent', () => {
        const pixel: Uint8ClampedArray = new Uint8ClampedArray([0, 0, 0, 0]);
        service['changeTransparentToWhite'](pixel);
        expect(pixel[0]).toEqual(CONSTANTS.MAX_COLOR_VALUE);
        expect(pixel[1]).toEqual(CONSTANTS.MAX_COLOR_VALUE);
        expect(pixel[2]).toEqual(CONSTANTS.MAX_COLOR_VALUE);
        expect(pixel[CONSTANTS.IMAGE_DATA_OPACITY_INDEX]).toEqual(CONSTANTS.MAX_COLOR_VALUE);
    });

    it('changeTransparentToWhite should not change pixel to white if not transparent', () => {
        const pixel: Uint8ClampedArray = new Uint8ClampedArray([CONSTANTS.MAX_COLOR_VALUE, 0, 0, CONSTANTS.MAX_COLOR_VALUE]);
        service['changeTransparentToWhite'](pixel);
        expect(pixel[0]).toEqual(CONSTANTS.MAX_COLOR_VALUE);
        expect(pixel[1]).toEqual(0);
        expect(pixel[2]).toEqual(0);
        expect(pixel[CONSTANTS.IMAGE_DATA_OPACITY_INDEX]).toEqual(CONSTANTS.MAX_COLOR_VALUE);
    });
});
