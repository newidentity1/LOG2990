import { TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { RectangleService } from './rectangle.service';

// tslint:disable:no-any
describe('RectangleService', () => {
    let service: RectangleService;
    let mouseEvent: MouseEvent;
    let keyboardEvent: KeyboardEvent;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;

    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let drawSpy: jasmine.Spy<any>;
    let isWidthSmallestSpy: jasmine.Spy<any>;

    beforeEach(() => {
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;

        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);
        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawServiceSpy }],
        });
        service = TestBed.inject(RectangleService);
        drawSpy = spyOn<any>(service, 'draw').and.callThrough();
        isWidthSmallestSpy = spyOn<any>(service, 'isWidthSmallest').and.callThrough();

        // Configuration du spy du service
        // tslint:disable:no-string-literal
        service['drawingService'].baseCtx = baseCtxStub; // Jasmine doesnt copy properties with underlying data
        service['drawingService'].previewCtx = previewCtxStub;
        service['drawingService'].canvas = canvasTestHelper.canvas;

        mouseEvent = {
            offsetX: 100,
            offsetY: 100,
            button: 0,
        } as MouseEvent;

        keyboardEvent = new KeyboardEvent('keyDown', { key: 'Shift' });
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it(' mouseDown should set startingX and startedY to correct position', () => {
        const expectedResult: Vec2 = { x: 100, y: 100 };
        service.onMouseDown(mouseEvent);
        expect(service.startingX).toEqual(expectedResult.x);
        expect(service.startingY).toEqual(expectedResult.y);
    });

    it(' onMouseUp should call draw if mouse was already down', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;

        service.onMouseUp(mouseEvent);
        expect(drawSpy).toHaveBeenCalled();
    });

    it(' onMouseUp should not call draw if mouse was not already down', () => {
        service.mouseDown = false;
        service.mouseDownCoord = { x: 0, y: 0 };

        service.onMouseUp(mouseEvent);
        expect(drawSpy).not.toHaveBeenCalled();
    });

    it(' onMouseUp should call isWidthSmallest if shift and mouse is down', () => {
        service.mouseDown = true;
        service.shiftDown = true;
        service.mouseDownCoord = { x: 0, y: 0 };

        service.onMouseUp(mouseEvent);
        expect(isWidthSmallestSpy).toHaveBeenCalled();
    });

    it(' onMouseUp should not call isWidthSmallest if shift is not down and mouse is down', () => {
        service.mouseDown = true;
        service.shiftDown = false;
        service.mouseDownCoord = { x: 0, y: 0 };

        service.onMouseUp(mouseEvent);
        expect(isWidthSmallestSpy).not.toHaveBeenCalled();
    });

    it(' onMouseMove should call draw if mouse was already down', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;

        service.onMouseMove(mouseEvent);
        expect(drawSpy).toHaveBeenCalled();
    });

    it(' onMouseMove should not call draw if mouse was not already down', () => {
        service.mouseDown = false;
        service.mouseDownCoord = { x: 0, y: 0 };

        service.onMouseUp(mouseEvent);
        expect(drawSpy).not.toHaveBeenCalled();
    });

    it(' onKeyDown should set shiftDown to true if shift is down', () => {
        service.shiftDown = false;
        service.onKeyDown(keyboardEvent);
        expect(service.shiftDown).toEqual(true);
    });

    it(' onKeyDown should keep the old shiftDown value if shift is not down', () => {
        service.shiftDown = false;
        keyboardEvent = new KeyboardEvent('keyup', { code: 'ArrowUp' });
        service.onKeyDown(keyboardEvent);
        expect(service.shiftDown).toEqual(false);
    });

    it(' onKeyUp should set shiftDown to false if shift is up', () => {
        service.shiftDown = true;
        keyboardEvent = new KeyboardEvent('keyup', { key: 'Shift' });
        service.onKeyUp(keyboardEvent);
        expect(service.shiftDown).toEqual(false);
    });

    it(' onKeyUp should keep the old shiftDown value if shift is not up', () => {
        service.shiftDown = true;
        keyboardEvent = new KeyboardEvent('keyup', { code: 'ArrowUp' });
        service.onKeyUp(keyboardEvent);
        expect(service.shiftDown).toEqual(true);
    });

    it(' computeDimensions should set the value of width and height correctly', () => {
        service.startingX = mouseEvent.offsetX;
        service.startingY = mouseEvent.offsetY;
        const fakeMousePosition: Vec2 = { x: 200, y: 200 };
        const expectedResult: Vec2 = { x: 100, y: 100 };
        service.computeDimensions(fakeMousePosition);
        expect(service.width).toEqual(expectedResult.x);
        expect(service.height).toEqual(expectedResult.y);
    });

    it(' isWidthSmallest should return true when the absolute width is smaller', () => {
        const negativePoint = { x: -1, y: -2 };
        service.width = negativePoint.x;
        service.height = negativePoint.y;
        expect(service.isWidthSmallest()).toEqual(true);
    });

    it(' isWidthSmallest should return false when the absolute width is higher', () => {
        const negativePoint = { x: -1, y: -2 };
        service.width = negativePoint.y;
        service.height = negativePoint.x;
        expect(service.isWidthSmallest()).toEqual(false);
    });

    it(' transformToSquare should return the a positive width and a positive height if the coords are on quadrant1', () => {
        const fakeRectangle: Vec2 = { x: 150, y: 200 };
        service.width = fakeRectangle.x;
        service.height = fakeRectangle.y;
        const expectedResult: Vec2 = { x: 150, y: 150 };

        expect(service.transformToSquare(fakeRectangle.x, fakeRectangle.y)).toEqual(expectedResult);
    });

    it(' transformToSquare should return the a negative width and a positive height if the coords are on quadrant2', () => {
        const fakeRectangle: Vec2 = { x: -150, y: 200 };
        service.width = fakeRectangle.x;
        service.height = fakeRectangle.y;
        const expectedResult: Vec2 = { x: -150, y: 150 };

        expect(service.transformToSquare(fakeRectangle.x, fakeRectangle.y)).toEqual(expectedResult);
    });

    it(' transformToSquare should return the a negative width and a negative height if the coords are on quadrant3', () => {
        const fakeRectangle: Vec2 = { x: -150, y: -200 };
        service.width = fakeRectangle.x;
        service.height = fakeRectangle.y;
        const expectedResult: Vec2 = { x: -150, y: -150 };

        expect(service.transformToSquare(fakeRectangle.x, fakeRectangle.y)).toEqual(expectedResult);
    });

    it(' transformToSquare should return the a positive width and a negative height if the coords are on quadrant4', () => {
        const fakeRectangle: Vec2 = { x: 150, y: -200 };
        service.width = fakeRectangle.x;
        service.height = fakeRectangle.y;
        const expectedResult: Vec2 = { x: 150, y: -150 };

        expect(service.transformToSquare(fakeRectangle.x, fakeRectangle.y)).toEqual(expectedResult);
    });
});
