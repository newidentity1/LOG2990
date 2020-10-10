import { TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { RectangleService } from './rectangle.service';

describe('RectangleService', () => {
    let service: RectangleService;
    let mouseEventLeftClick: MouseEvent;
    let mouseEventRightClick: MouseEvent;
    let keyboardEventShift: KeyboardEvent;
    let keyboardEventEscape: KeyboardEvent;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;

    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;

    beforeEach(() => {
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;

        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas', 'setThickness']);
        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawServiceSpy }],
        });
        service = TestBed.inject(RectangleService);

        // Configuration du spy du service
        // tslint:disable:no-string-literal
        service['drawingService'].baseCtx = baseCtxStub; // Jasmine doesnt copy properties with underlying data
        service['drawingService'].previewCtx = previewCtxStub;
        service['drawingService'].canvas = canvasTestHelper.canvas;

        mouseEventLeftClick = {
            offsetX: 100,
            offsetY: 100,
            button: 0,
        } as MouseEvent;

        mouseEventRightClick = {
            offsetX: 100,
            offsetY: 100,
            button: 1,
        } as MouseEvent;

        keyboardEventShift = new KeyboardEvent('keyDown', { key: 'Shift' });
        keyboardEventEscape = new KeyboardEvent('keyDown', { key: 'Escape' });
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it(' onMouseDown should set escapeDown to false, mouseDownCoord to the click pos and pathStart to correct position on mouse left click', () => {
        service.escapeDown = true;
        const positionFromMouseSpy = spyOn(service, 'getPositionFromMouse').and.callThrough();
        service.pathStart = { x: 0, y: 0 };
        const expectedResult: Vec2 = { x: mouseEventLeftClick.offsetX, y: mouseEventLeftClick.offsetY };
        service.onMouseDown(mouseEventLeftClick);
        expect(service.escapeDown).toEqual(false);
        expect(positionFromMouseSpy).toHaveBeenCalledWith(mouseEventLeftClick);
        expect(service.mouseDownCoord).toEqual(expectedResult);
        expect(service.pathStart).toEqual(expectedResult);
    });

    it(' onMouseDown should not set pathStart on mouse right click ', () => {
        service.escapeDown = true;
        const positionFromMouseSpy = spyOn(service, 'getPositionFromMouse').and.callThrough();
        service.pathStart = { x: 0, y: 0 };
        const expectedResult: Vec2 = { x: 0, y: 0 };
        service.onMouseDown(mouseEventRightClick);
        expect(service.escapeDown).not.toEqual(false);
        expect(positionFromMouseSpy).not.toHaveBeenCalled();
        expect(service.mouseDownCoord).toBeUndefined();
        expect(service.pathStart).toEqual(expectedResult);
    });

    it(' onMouseUp should call computeDimensions, clear preview canvas, set mouseDown to false and draw if mouse was already down', () => {
        const computeDimensionsSpy = spyOn(service, 'computeDimensions').and.callThrough();
        const drawSpy = spyOn(service, 'draw').and.callThrough();
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;
        service.mouseDownCoord = { x: mouseEventLeftClick.x, y: mouseEventLeftClick.y };

        service.onMouseUp();
        expect(computeDimensionsSpy).toHaveBeenCalled();
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalledWith(previewCtxStub);
        expect(drawSpy).toHaveBeenCalled();
        expect(service.mouseDown).toEqual(false);
    });

    it(' onMouseUp should not call computeDimensions, not call clear preview canvas, set mouseDown to false and draw if mouse was not down', () => {
        const computeDimensionsSpy = spyOn(service, 'computeDimensions').and.callThrough();
        const drawSpy = spyOn(service, 'draw').and.callThrough();
        service.mouseDown = false;

        service.onMouseUp();
        expect(computeDimensionsSpy).not.toHaveBeenCalled();
        expect(drawServiceSpy.clearCanvas).not.toHaveBeenCalled();
        expect(drawSpy).not.toHaveBeenCalled();
        expect(service.mouseDown).toEqual(false);
    });

    it(' onMouseMove should call getPositionFromMouse and drawPreview if mouse was already down', () => {
        const getPositionFromMouseSpy = spyOn(service, 'getPositionFromMouse').and.callThrough();
        const drawPreviewSpy = spyOn(service, 'drawPreview').and.callThrough();
        service.mouseDown = true;
        const expectedResult: Vec2 = { x: mouseEventLeftClick.offsetX, y: mouseEventLeftClick.offsetY };

        service.onMouseMove(mouseEventLeftClick);
        expect(getPositionFromMouseSpy).toHaveBeenCalledWith(mouseEventLeftClick);
        expect(service.mouseDownCoord).toEqual(expectedResult);
        expect(drawPreviewSpy).toHaveBeenCalled();
    });

    it(' onMouseMove should not call getPositionFromMouse and drawPreview if mouse was already down', () => {
        const getPositionFromMouseSpy = spyOn(service, 'getPositionFromMouse').and.callThrough();
        const drawPreviewSpy = spyOn(service, 'drawPreview').and.callThrough();
        service.mouseDown = false;

        service.onMouseMove(mouseEventLeftClick);
        expect(getPositionFromMouseSpy).not.toHaveBeenCalled();
        expect(service.mouseDownCoord).toBeUndefined();
        expect(drawPreviewSpy).not.toHaveBeenCalled();
    });

    it(' onKeyDown should set shiftDown to true if shift is down', () => {
        service.shiftDown = false;
        service.escapeDown = false;
        service.onKeyDown(keyboardEventShift);
        expect(service.shiftDown).toEqual(true);
        expect(service.escapeDown).toEqual(false);
    });

    it(' onKeyDown should set escape to true if escape is down', () => {
        service.shiftDown = false;
        service.escapeDown = false;
        service.onKeyDown(keyboardEventEscape);
        expect(service.escapeDown).toEqual(true);
        expect(service.shiftDown).toEqual(false);
    });

    it(' onKeyDown should call drawPreview when mouse is down', () => {
        service.mouseDown = true;
        const drawPreviewSpy = spyOn(service, 'drawPreview').and.callFake(() => {
            return;
        });
        const keyboardEvent = new KeyboardEvent('keyup', { code: 'ArrowUp' });

        service.onKeyDown(keyboardEvent);
        expect(drawPreviewSpy).toHaveBeenCalled();
        expect(service.escapeDown).toEqual(false);
        expect(service.shiftDown).toEqual(false);
    });

    it(' onKeyDown should not call drawPreview when mouse is not down', () => {
        service.mouseDown = false;
        const drawPreviewSpy = spyOn(service, 'drawPreview').and.callFake(() => {
            return;
        });
        const keyboardEvent = new KeyboardEvent('keyup', { code: 'ArrowUp' });

        service.onKeyDown(keyboardEvent);
        expect(drawPreviewSpy).not.toHaveBeenCalled();
        expect(service.escapeDown).toEqual(false);
        expect(service.shiftDown).toEqual(false);
    });

    it(' onKeyUp should set shiftDown to false if shift is up', () => {
        service.shiftDown = true;
        service.onKeyUp(keyboardEventShift);
        expect(service.shiftDown).toEqual(false);
    });

    it(' onKeyUp should keep the old shiftDown value if shift is not up', () => {
        const keyboardEvent = new KeyboardEvent('keyup', { code: 'ArrowUp' });
        service.shiftDown = true;
        service.onKeyUp(keyboardEvent);
        expect(service.shiftDown).toEqual(true);

        service.shiftDown = false;
        service.onKeyUp(keyboardEvent);
        expect(service.shiftDown).toEqual(false);
    });

    it(' onKeyUp should call drawPreview when mouse is down', () => {
        service.mouseDown = true;
        const drawPreviewSpy = spyOn(service, 'drawPreview').and.callFake(() => {
            return;
        });
        const keyboardEvent = new KeyboardEvent('keyup', { code: 'ArrowUp' });

        service.onKeyUp(keyboardEvent);
        expect(drawPreviewSpy).toHaveBeenCalled();
    });

    it(' onKeyUp should not call drawPreview when mouse is not down', () => {
        service.mouseDown = false;
        const drawPreviewSpy = spyOn(service, 'drawPreview').and.callFake(() => {
            return;
        });
        const keyboardEvent = new KeyboardEvent('keyup', { code: 'ArrowUp' });

        service.onKeyUp(keyboardEvent);
        expect(drawPreviewSpy).not.toHaveBeenCalled();
    });

    it(' transformToSquare should return the a positive width and a positive height if the coords are on quadrant1', () => {
        const fakeRectangle: Vec2 = { x: 150, y: 200 };
        service.width = fakeRectangle.x;
        service.height = fakeRectangle.y;
        const expectedResult: Vec2 = { x: 150, y: 150 };
        service.transformToSquare();
        expect(service.width).toEqual(expectedResult.x);
        expect(service.height).toEqual(expectedResult.y);
    });

    it(' transformToSquare should return the a negative width and a positive height if the coords are on quadrant2', () => {
        const fakeRectangle: Vec2 = { x: -150, y: 200 };
        service.width = fakeRectangle.x;
        service.height = fakeRectangle.y;
        const expectedResult: Vec2 = { x: -150, y: 150 };

        service.transformToSquare();
        expect(service.width).toEqual(expectedResult.x);
        expect(service.height).toEqual(expectedResult.y);
    });

    it(' transformToSquare should return the a negative width and a negative height if the coords are on quadrant3', () => {
        const fakeRectangle: Vec2 = { x: -150, y: -200 };
        service.width = fakeRectangle.x;
        service.height = fakeRectangle.y;
        const expectedResult: Vec2 = { x: -150, y: -150 };

        service.transformToSquare();
        expect(service.width).toEqual(expectedResult.x);
        expect(service.height).toEqual(expectedResult.y);
    });

    it(' transformToSquare should return the a positive width and a negative height if the coords are on quadrant4', () => {
        const fakeRectangle: Vec2 = { x: 150, y: -200 };
        service.width = fakeRectangle.x;
        service.height = fakeRectangle.y;
        const expectedResult: Vec2 = { x: 150, y: -150 };

        service.transformToSquare();
        expect(service.width).toEqual(expectedResult.x);
        expect(service.height).toEqual(expectedResult.y);
    });

    it(' transformToSquare should return the same input if they are equal', () => {
        const fakeRectangle: Vec2 = { x: 150, y: 150 };
        service.width = fakeRectangle.x;
        service.height = fakeRectangle.y;
        const expectedResult: Vec2 = { x: 150, y: 150 };

        service.transformToSquare();
        expect(service.width).toEqual(expectedResult.x);
        expect(service.height).toEqual(expectedResult.y);
    });

    it(' computeDimensions should set the value of width and height correctly', () => {
        service.pathStart.x = mouseEventLeftClick.offsetX;
        service.pathStart.y = mouseEventLeftClick.offsetY;
        service.mouseDownCoord = { x: 200, y: 200 };
        const expectedResult: Vec2 = { x: mouseEventLeftClick.offsetX, y: mouseEventLeftClick.offsetY };
        service.computeDimensions();
        expect(service.width).toEqual(expectedResult.x);
        expect(service.height).toEqual(expectedResult.y);
    });

    it(' computeDimensions should call transformToSquare when shift is down', () => {
        service.pathStart.x = mouseEventLeftClick.offsetX;
        service.pathStart.y = mouseEventLeftClick.offsetY;
        service.mouseDownCoord = { x: 200, y: 200 };
        const transformToSquareSpy = spyOn(service, 'transformToSquare').and.callFake(() => {
            return;
        });
        service.shiftDown = true;
        service.computeDimensions();

        expect(transformToSquareSpy).toHaveBeenCalled();
    });

    it(' computeDimensions should not call transformToSquare when shift is not down', () => {
        service.pathStart.x = mouseEventLeftClick.offsetX;
        service.pathStart.y = mouseEventLeftClick.offsetY;
        service.mouseDownCoord = { x: 200, y: 200 };
        const transformToSquareSpy = spyOn(service, 'transformToSquare').and.callFake(() => {
            return;
        });
        service.shiftDown = false;
        service.computeDimensions();

        expect(transformToSquareSpy).not.toHaveBeenCalled();
    });

    it(' drawPreview should call computeDimensions, clearCanvas and draw', () => {
        const computeDimensionsSpy = spyOn(service, 'computeDimensions').and.callFake(() => {
            return;
        });
        const drawSpy = spyOn(service, 'draw').and.callFake(() => {
            return;
        });
        service.drawPreview();
        expect(computeDimensionsSpy).toHaveBeenCalled();
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalledWith(previewCtxStub);
        expect(drawSpy).toHaveBeenCalledWith(previewCtxStub);
    });

    it('draw should not draw if escape is down', () => {
        const contextRectSpy = spyOn(baseCtxStub, 'rect');
        service.escapeDown = true;
        service.draw(baseCtxStub);
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalledWith(previewCtxStub);
        expect(contextRectSpy).not.toHaveBeenCalled();
    });

    // it('drawStroke should call strokeRect of context', () => {
    //     const spy = spyOn(baseCtxStub, 'strokeRect');
    //     service.drawStrokeRect(baseCtxStub, 1, 1);
    //     expect(spy).toHaveBeenCalled();
    // });

    // it(' drawFillStrokeRect should call drawFillRect and drawStrokeRect', () => {
    //     const spyFill = spyOn(service, 'drawFillRect');
    //     const spyStroke = spyOn(service, 'drawStrokeRect');
    //     service.drawFillStrokeRect(baseCtxStub, 0, 0);
    //     expect(spyFill).toHaveBeenCalled();
    //     expect(spyStroke).toHaveBeenCalled();
    // });
});
