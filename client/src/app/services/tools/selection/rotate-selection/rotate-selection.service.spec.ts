import { TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { ANGLE_180, DEFAULT_ROTATION_ANGLE, ANGLE_360_RAD } from '@app/constants/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { RotateSelectionService } from '@app/services/tools/selection/rotate-selection/rotate-selection.service';

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

        drawingServiceSpy.canvas = canvasTestHelper.canvas;
        drawingServiceSpy.baseCtx = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        drawingServiceSpy.previewCtx = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
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

    it('rotateImage resize preview canvas correctly when rotation is less than 90 degrees', () => {
        service.rotateImage(new ImageData(1, 1));
        // const diagonaleStartingAngle = Math.atan(service.originalHeight / service.originalWidth);

        // let newWidth = (diagonale / 2) * Math.cos(diagonaleStartingAngle - (this.angle % ANGLE_90_RAD)) * 2;
        // let newHeight = (diagonale / 2) * Math.sin(diagonaleStartingAngle + (this.angle % ANGLE_90_RAD)) * 2;
    });
});
