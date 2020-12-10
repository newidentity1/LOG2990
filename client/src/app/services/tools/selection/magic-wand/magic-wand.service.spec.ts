import { TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { IMAGE_DATA_OPACITY_INDEX, MAX_COLOR_VALUE } from '@app/constants/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { MagicWandService } from './magic-wand.service';

describe('MagicWandService', () => {
    let service: MagicWandService;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;

    beforeEach(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas', 'setThickness']);

        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawServiceSpy }],
        });
        service = TestBed.inject(MagicWandService);

        const canvas = document.createElement('canvas');
        canvas.width = canvasTestHelper.canvas.width;
        canvas.height = canvasTestHelper.canvas.height;
        // tslint:disable: no-string-literal / reason: accessing private member
        service['drawingService'].canvas = canvas;
        service['drawingService'].baseCtx = canvas.getContext('2d') as CanvasRenderingContext2D;
        service['drawingService'].previewCtx = canvas.getContext('2d') as CanvasRenderingContext2D;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('copyMagicSelection should call initializeSelectionProperties, drawOutline and copySelectionToPreviewCtx', () => {
        // tslint:disable: no-any / reason: spying on private function
        const initializeSelectionPropertiesSpy = spyOn<any>(service, 'initializeSelectionProperties');
        // tslint:disable: no-empty / reason: spying on fake function
        const drawOutlineSpy = spyOn<any>(service, 'drawOutline').and.callFake(() => {});
        const copySelectionToPreviewCtxSpy = spyOn<any>(service, 'copySelectionToPreviewCtx').and.callFake(() => {});
        spyOn<any>(service, 'copyMagicSelectionLeft').and.callFake(() => {});
        // tslint:disable: no-string-literal / reason: accessing private members
        service.copyMagicSelection({ x: 0, y: 0 }, true);

        expect(initializeSelectionPropertiesSpy).toHaveBeenCalled();
        expect(drawOutlineSpy).toHaveBeenCalled();
        expect(copySelectionToPreviewCtxSpy).toHaveBeenCalled();
    });

    it('copyMagicSelection should call initializeSelectionProperties, drawOutline and copySelectionToPreviewCtx', () => {
        spyOn<any>(service, 'initializeSelectionProperties');
        spyOn<any>(service, 'drawOutline').and.callFake(() => {});
        spyOn<any>(service, 'copySelectionToPreviewCtx').and.callFake(() => {});
        const copyMagicSelectionLeftSpy = spyOn<any>(service, 'copyMagicSelectionLeft').and.callFake(() => {});
        service.copyMagicSelection({ x: 0, y: 0 }, true);
        expect(copyMagicSelectionLeftSpy).toHaveBeenCalled();
    });

    it('copyMagicSelection should call initializeSelectionProperties, drawOutline and copySelectionToPreviewCtx', () => {
        spyOn<any>(service, 'initializeSelectionProperties');
        spyOn<any>(service, 'drawOutline').and.callFake(() => {});
        spyOn<any>(service, 'copySelectionToPreviewCtx').and.callFake(() => {});
        const copyMagicSelectionRightSpy = spyOn<any>(service, 'copyMagicSelectionRight').and.callFake(() => {});
        service.copyMagicSelection({ x: 0, y: 0 }, false);
        expect(copyMagicSelectionRightSpy).toHaveBeenCalled();
    });

    it('initializeSelectionProperties should reset properties, and check if starting color is transparent', () => {
        // tslint:disable: no-any / reason: spying on private function
        const changeTransparentToWhiteSpy = spyOn<any>(service, 'changeTransparentToWhite');
        // tslint:disable: no-string-literal / reason: accessing private members
        service['initializeSelectionProperties']({ x: 0, y: 0 });
        expect(service.startingPosition).toEqual({ x: drawServiceSpy.canvas.width, y: drawServiceSpy.canvas.height });
        expect(service['shapeOutlineIndexes'].length).toEqual(0);
        expect(service['selectionSize']).toEqual({ x: 0, y: 0 });
        expect(changeTransparentToWhiteSpy).toHaveBeenCalled();
    });

    it('copyMagicSelectionRight should select all pixels that match starting color', () => {
        const canvas = document.createElement('canvas');
        canvas.width = canvasTestHelper.canvas.width;
        canvas.height = canvasTestHelper.canvas.height;
        service['drawingService'].previewCtx = canvas.getContext('2d') as CanvasRenderingContext2D;

        drawServiceSpy.baseCtx.clearRect(0, 0, drawServiceSpy.canvas.width, drawServiceSpy.canvas.height);
        drawServiceSpy.baseCtx.fillStyle = 'black';

        // tslint:disable: no-magic-numbers / reason : using random numbers for tests
        drawServiceSpy.baseCtx.fillRect(0, 0, 10, 10);
        drawServiceSpy.baseCtx.fillRect(50, 50, 10, 10);
        drawServiceSpy.baseCtx.fillStyle = 'red';
        drawServiceSpy.baseCtx.fillRect(20, 20, 10, 10);

        service.copyMagicSelection({ x: 0, y: 0 }, false);

        // should not select red
        let imageData = drawServiceSpy.previewCtx.getImageData(20, 20, 1, 1).data;
        expect(imageData[0]).toEqual(0);
        expect(imageData[1]).toEqual(0);
        expect(imageData[2]).toEqual(0);
        expect(imageData[IMAGE_DATA_OPACITY_INDEX]).toEqual(0);

        // should select black only
        imageData = drawServiceSpy.previewCtx.getImageData(5, 5, 1, 1).data;
        expect(imageData[0]).toEqual(0);
        expect(imageData[1]).toEqual(0);
        expect(imageData[2]).toEqual(0);
        expect(imageData[IMAGE_DATA_OPACITY_INDEX]).toEqual(MAX_COLOR_VALUE);

        imageData = drawServiceSpy.previewCtx.getImageData(55, 55, 1, 1).data;
        expect(imageData[0]).toEqual(0);
        expect(imageData[1]).toEqual(0);
        expect(imageData[2]).toEqual(0);
        expect(imageData[IMAGE_DATA_OPACITY_INDEX]).toEqual(MAX_COLOR_VALUE);
        // tslint:enable: no-magic-numbers
    });

    it('copyMagicSelectionRight should color all transparent pixel to white if starting color is transparent', () => {
        const canvas = document.createElement('canvas');
        canvas.width = canvasTestHelper.canvas.width;
        canvas.height = canvasTestHelper.canvas.height;
        service['drawingService'].previewCtx = canvas.getContext('2d') as CanvasRenderingContext2D;
        drawServiceSpy.baseCtx.clearRect(0, 0, drawServiceSpy.canvas.width, drawServiceSpy.canvas.height);

        service.copyMagicSelection({ x: 0, y: 0 }, false);

        // tslint:disable: no-magic-numbers / reason : using random numbers for tests
        const imageData = drawServiceSpy.previewCtx.getImageData(20, 20, 1, 1).data;

        // should be white
        expect(imageData[0]).toEqual(MAX_COLOR_VALUE);
        expect(imageData[1]).toEqual(MAX_COLOR_VALUE);
        expect(imageData[2]).toEqual(MAX_COLOR_VALUE);
        expect(imageData[IMAGE_DATA_OPACITY_INDEX]).toEqual(MAX_COLOR_VALUE);
    });

    it('copyMagicSelectionLeft should select all pixels that match starting color', () => {
        const canvas = document.createElement('canvas');
        canvas.width = canvasTestHelper.canvas.width;
        canvas.height = canvasTestHelper.canvas.height;
        service['drawingService'].previewCtx = canvas.getContext('2d') as CanvasRenderingContext2D;

        drawServiceSpy.baseCtx.clearRect(0, 0, drawServiceSpy.canvas.width, drawServiceSpy.canvas.height);
        drawServiceSpy.baseCtx.fillStyle = 'black';

        // tslint:disable: no-magic-numbers / reason : using random numbers for tests
        drawServiceSpy.baseCtx.fillRect(0, 0, 10, 10);
        drawServiceSpy.baseCtx.fillRect(50, 50, 10, 10);
        drawServiceSpy.baseCtx.fillStyle = 'red';
        drawServiceSpy.baseCtx.fillRect(20, 20, 10, 10);

        service.copyMagicSelection({ x: 0, y: 0 }, true);

        // should not select red
        let imageData = drawServiceSpy.previewCtx.getImageData(20, 20, 1, 1).data;
        expect(imageData[0]).toEqual(0);
        expect(imageData[1]).toEqual(0);
        expect(imageData[2]).toEqual(0);
        expect(imageData[IMAGE_DATA_OPACITY_INDEX]).toEqual(0);

        // should select black only
        imageData = drawServiceSpy.previewCtx.getImageData(5, 5, 1, 1).data;
        expect(imageData[0]).toEqual(0);
        expect(imageData[1]).toEqual(0);
        expect(imageData[2]).toEqual(0);
        expect(imageData[IMAGE_DATA_OPACITY_INDEX]).toEqual(MAX_COLOR_VALUE);

        // should not select non adjacent black pixels
        imageData = drawServiceSpy.previewCtx.getImageData(55, 55, 1, 1).data;
        expect(imageData[0]).toEqual(0);
        expect(imageData[1]).toEqual(0);
        expect(imageData[2]).toEqual(0);
        expect(imageData[IMAGE_DATA_OPACITY_INDEX]).toEqual(0);
        // tslint:enable: no-magic-numbers
    });

    it('generatePixelMatrix should initialize a matrix containing all pixels of canvas with status of 0', () => {
        const returnedMatrix = service['generatePixelMatrix']();
        expect(returnedMatrix.length).toEqual(drawServiceSpy.canvas.width);
        expect(returnedMatrix[0].length).toEqual(drawServiceSpy.canvas.height);
        expect(returnedMatrix[0][0].status).toEqual(0);
    });

    it('changeTransparentToWhite should change pixel to white if transparent', () => {
        const pixel: Uint8ClampedArray = new Uint8ClampedArray([0, 0, 0, 0]);
        service['changeTransparentToWhite'](pixel);
        expect(pixel[0]).toEqual(MAX_COLOR_VALUE);
        expect(pixel[1]).toEqual(MAX_COLOR_VALUE);
        expect(pixel[2]).toEqual(MAX_COLOR_VALUE);
        expect(pixel[IMAGE_DATA_OPACITY_INDEX]).toEqual(MAX_COLOR_VALUE);
    });

    it('isColorMatchingStartingColor should return true if colors match', () => {
        const pixel: Uint8ClampedArray = new Uint8ClampedArray([MAX_COLOR_VALUE, 0, 0, MAX_COLOR_VALUE]);
        const startingColor: Uint8ClampedArray = new Uint8ClampedArray([MAX_COLOR_VALUE, 0, 0, MAX_COLOR_VALUE]);
        const returnedValue = service['isColorMatchingStartingColor'](pixel, startingColor);
        expect(returnedValue).toBeTrue();
    });

    it('isColorMatchingStartingColor should return false if colors do not match', () => {
        const pixel: Uint8ClampedArray = new Uint8ClampedArray([0, 0, 0, MAX_COLOR_VALUE]);
        const startingColor: Uint8ClampedArray = new Uint8ClampedArray([MAX_COLOR_VALUE, 0, 0, MAX_COLOR_VALUE]);
        const returnedValue = service['isColorMatchingStartingColor'](pixel, startingColor);
        expect(returnedValue).toBeFalse();
    });

    it('isColorMatchingStartingColor should return true if comparing white and transparent pixel', () => {
        const pixel: Uint8ClampedArray = new Uint8ClampedArray([0, 0, 0, 0]);
        const startingColor: Uint8ClampedArray = new Uint8ClampedArray([MAX_COLOR_VALUE, MAX_COLOR_VALUE, MAX_COLOR_VALUE, MAX_COLOR_VALUE]);
        const returnedValue = service['isColorMatchingStartingColor'](pixel, startingColor);
        expect(returnedValue).toBeTrue();
    });

    it('drawOutline should color imageData at given indexes', () => {
        service['imgData'] = drawServiceSpy.baseCtx.getImageData(0, 0, 1, 1);
        service['shapeOutlineIndexes'] = [0];
        service['drawOutline']();
        expect(service['imgDataWithOutline'].data[IMAGE_DATA_OPACITY_INDEX]).not.toEqual(0);
    });

    it('copySelectionToPreviewCtx should resize and reposition preview canvas', () => {
        const expectedValue = 10;
        service['selectionSize'] = { x: expectedValue, y: expectedValue };
        service['startingPosition'] = { x: expectedValue, y: expectedValue };
        service['imgDataWithOutline'] = drawServiceSpy.baseCtx.getImageData(0, 0, drawServiceSpy.canvas.width, drawServiceSpy.canvas.height);
        service['imgData'] = drawServiceSpy.baseCtx.getImageData(0, 0, drawServiceSpy.canvas.width, drawServiceSpy.canvas.height);
        service['areaToClear'] = drawServiceSpy.baseCtx.getImageData(0, 0, drawServiceSpy.canvas.width, drawServiceSpy.canvas.height);

        service['copySelectionToPreviewCtx']();

        expect(drawServiceSpy.previewCtx.canvas.width).toEqual(expectedValue);
        expect(drawServiceSpy.previewCtx.canvas.width).toEqual(expectedValue);
        expect(drawServiceSpy.previewCtx.canvas.style.left).toEqual(expectedValue + 'px');
        expect(drawServiceSpy.previewCtx.canvas.style.top).toEqual(expectedValue + 'px');
    });
});
