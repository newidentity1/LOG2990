import { TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { ANGLE_180, ANGLE_360_RAD, ANGLE_90_RAD, DEFAULT_ROTATION_ANGLE } from '@app/constants/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { RotateSelectionService } from '@app/services/tools/selection/rotate-selection/rotate-selection.service';

// tslint:disable:no-string-literal / reason : access private members
describe('RotateSelectionService', () => {
    let service: RotateSelectionService;
    let drawingServiceSpy: jasmine.SpyObj<DrawingService>;

    beforeEach(() => {
        drawingServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas', 'setStrokeColor', 'setThickness', 'canvasEmpty']);

        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawingServiceSpy }],
        });
        service = TestBed.inject(RotateSelectionService);
        drawingServiceSpy = TestBed.inject(DrawingService) as jasmine.SpyObj<DrawingService>;

        const canvas = document.createElement('canvas');
        canvas.width = canvasTestHelper.canvas.width;
        canvas.height = canvasTestHelper.canvas.height;
        // tslint:disable: no-string-literal / reason: accessing private member
        service['drawingService'].canvas = canvas;
        service['drawingService'].baseCtx = canvas.getContext('2d') as CanvasRenderingContext2D;

        const previewCanvas = document.createElement('canvas');
        previewCanvas.width = canvasTestHelper.canvas.width;
        previewCanvas.height = canvasTestHelper.canvas.height;
        service['drawingService'].previewCtx = previewCanvas.getContext('2d') as CanvasRenderingContext2D;

        service.initializeRotation();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('initializeRotation should initialize properties', () => {
        const getImageDataSpy = spyOn(drawingServiceSpy.previewCtx, 'getImageData');
        service.initializeRotation();
        expect(service.originalWidth).toEqual(drawingServiceSpy.previewCtx.canvas.width);
        expect(service.originalHeight).toEqual(drawingServiceSpy.previewCtx.canvas.height);
        expect(service.originalOffsetLeft).toEqual(drawingServiceSpy.previewCtx.canvas.offsetLeft);
        expect(service.originalOffsetTop).toEqual(drawingServiceSpy.previewCtx.canvas.offsetTop);
        expect(service.angle).toEqual(0);
        expect(getImageDataSpy).toHaveBeenCalledWith(0, 0, service.originalWidth, service.originalHeight);
    });

    it('scroll up should increment the angle of 15 if alt is not down', () => {
        const scrollEvent = { deltaY: 1 } as WheelEvent;
        const rotateImageSpy = spyOn(service, 'rotateImage').and.callFake(() => {
            return;
        });
        service.scroll(scrollEvent, new ImageData(1, 1), false);
        const expectedAngle = (DEFAULT_ROTATION_ANGLE * Math.PI) / ANGLE_180;
        expect(service.angle).toEqual(expectedAngle);
        expect(rotateImageSpy).toHaveBeenCalled();
    });

    it('scroll up should increment the angle of 1 if alt is down', () => {
        const scrollEvent = { deltaY: 1 } as WheelEvent;
        const rotateImageSpy = spyOn(service, 'rotateImage').and.callFake(() => {
            return;
        });
        service.scroll(scrollEvent, new ImageData(1, 1), true);
        const expectedAngle = (1 * Math.PI) / ANGLE_180;
        expect(service.angle).toEqual(expectedAngle);
        expect(rotateImageSpy).toHaveBeenCalled();
    });

    it('scroll down should decrement the angle of 15 if alt is not down', () => {
        const scrollEvent = { deltaY: -1 } as WheelEvent;
        const rotateImageSpy = spyOn(service, 'rotateImage').and.callFake(() => {
            return;
        });
        service.scroll(scrollEvent, new ImageData(1, 1), false);
        const expectedAngle = ANGLE_360_RAD - (DEFAULT_ROTATION_ANGLE * Math.PI) / ANGLE_180;
        expect(service.angle).toEqual(expectedAngle);
        expect(rotateImageSpy).toHaveBeenCalled();
    });

    it('scroll up should decrement the angle of 1 if alt is down', () => {
        const scrollEvent = { deltaY: -1 } as WheelEvent;
        const rotateImageSpy = spyOn(service, 'rotateImage').and.callFake(() => {
            return;
        });
        service.scroll(scrollEvent, new ImageData(1, 1), true);
        const expectedAngle = ANGLE_360_RAD - (1 * Math.PI) / ANGLE_180;
        expect(service.angle).toEqual(expectedAngle);
        expect(rotateImageSpy).toHaveBeenCalled();
    });

    it('rotateImage should resize preview canvas correctly when rotation is less than 90 degrees', () => {
        service.rotateImage(new ImageData(1, 1));
        const width = service.originalWidth;
        const height = service.originalHeight;
        const diagonale = Math.sqrt(width * width + height * height);
        const diagonaleStartingAngle = Math.atan(height / width);

        const newWidth = (diagonale / 2) * Math.cos(diagonaleStartingAngle - (service.angle % ANGLE_90_RAD)) * 2;
        const newHeight = (diagonale / 2) * Math.sin(diagonaleStartingAngle + (service.angle % ANGLE_90_RAD)) * 2;

        expect(Math.floor(service.leftOffset)).toEqual(Math.floor((newWidth - width) / 2));
        expect(Math.floor(service.topOffset)).toEqual(Math.floor((newHeight - height) / 2));
        expect(Math.floor(service['drawingService'].previewCtx.canvas.width)).toEqual(Math.floor(newWidth));
        expect(Math.floor(service['drawingService'].previewCtx.canvas.height)).toEqual(Math.floor(newHeight));
    });

    it('rotateImage should resize preview canvas correctly when rotation is more than 90 degrees and less than 180', () => {
        const angleValue = 95;
        service.angle = (angleValue * Math.PI) / ANGLE_180;
        service.rotateImage(new ImageData(1, 1));
        const width = service.originalWidth;
        const height = service.originalHeight;
        const diagonale = Math.sqrt(width * width + height * height);
        const diagonaleStartingAngle = Math.atan(height / width);

        let newWidth = (diagonale / 2) * Math.cos(diagonaleStartingAngle - (service.angle % ANGLE_90_RAD)) * 2;
        let newHeight = (diagonale / 2) * Math.sin(diagonaleStartingAngle + (service.angle % ANGLE_90_RAD)) * 2;
        [newWidth, newHeight] = [newHeight, newWidth];

        expect(Math.floor(service.leftOffset)).toEqual(Math.floor((newWidth - width) / 2));
        expect(Math.floor(service.topOffset)).toEqual(Math.floor((newHeight - height) / 2));
        expect(Math.floor(service['drawingService'].previewCtx.canvas.width)).toEqual(Math.floor(newWidth));
        expect(Math.floor(service['drawingService'].previewCtx.canvas.height)).toEqual(Math.floor(newHeight));
    });

    it('rotateImage should resize preview canvas correctly when rotation is more than 270 degrees and less than 360', () => {
        const angleValue = 275;
        service.angle = (angleValue * Math.PI) / ANGLE_180;
        service.rotateImage(new ImageData(1, 1));
        const width = service.originalWidth;
        const height = service.originalHeight;
        const diagonale = Math.sqrt(width * width + height * height);
        const diagonaleStartingAngle = Math.atan(height / width);

        let newWidth = (diagonale / 2) * Math.cos(diagonaleStartingAngle - (service.angle % ANGLE_90_RAD)) * 2;
        let newHeight = (diagonale / 2) * Math.sin(diagonaleStartingAngle + (service.angle % ANGLE_90_RAD)) * 2;
        [newWidth, newHeight] = [newHeight, newWidth];

        expect(Math.floor(service.leftOffset)).toEqual(Math.floor((newWidth - width) / 2));
        expect(Math.floor(service.topOffset)).toEqual(Math.floor((newHeight - height) / 2));
        expect(Math.floor(service['drawingService'].previewCtx.canvas.width)).toEqual(Math.floor(newWidth));
        expect(Math.floor(service['drawingService'].previewCtx.canvas.height)).toEqual(Math.floor(newHeight));
    });
});
