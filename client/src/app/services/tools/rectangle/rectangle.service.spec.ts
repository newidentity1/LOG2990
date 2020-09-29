import { TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { BasicShapeProperties } from '@app/classes/tools-properties/basic-shape-properties';
import { Vec2 } from '@app/classes/vec2';
import { DrawingType } from '@app/enums/drawing-type.enum';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { RectangleService } from './rectangle.service';

describe('RectangleService', () => {
    let service: RectangleService;
    let mouseEventLeftClick: MouseEvent;
    let mouseEventRightClick: MouseEvent;
    let keyboardEvent: KeyboardEvent;
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

        keyboardEvent = new KeyboardEvent('keyDown', { key: 'Shift' });
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it(' onMouseDown should set startingX and startedY to correct position on mouse left click', () => {
        service.startingX = 0;
        service.startingY = 0;
        const expectedResult: Vec2 = { x: 100, y: 100 };
        service.onMouseDown(mouseEventLeftClick);
        expect(service.startingX).toEqual(expectedResult.x);
        expect(service.startingY).toEqual(expectedResult.y);
    });

    it(' onMouseDown should not set startingX and startedY on mouse right click ', () => {
        service.startingX = 0;
        service.startingY = 0;
        const expectedResult: Vec2 = { x: 0, y: 0 };
        service.onMouseDown(mouseEventRightClick);
        expect(service.startingX).toEqual(expectedResult.x);
        expect(service.startingY).toEqual(expectedResult.y);
    });

    it(' onMouseUp should call draw if mouse was already down', () => {
        const drawSpy = spyOn(service, 'draw').and.callThrough();
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;
        service.currentMousePosition = { x: mouseEventLeftClick.x, y: mouseEventLeftClick.y };
        service.onMouseUp();
        expect(drawSpy).toHaveBeenCalled();
    });

    it(' onMouseUp should not call draw if mouse was not already down', () => {
        const drawSpy = spyOn(service, 'draw').and.callThrough();
        service.mouseDown = false;
        service.mouseDownCoord = { x: 0, y: 0 };

        service.onMouseUp();
        expect(drawSpy).not.toHaveBeenCalled();
    });

    it(' onMouseUp should call transformToSquare if shift and mouse is down', () => {
        const transformToSquareSpy = spyOn(service, 'transformToSquare').and.callThrough();
        service.mouseDown = true;
        service.shiftDown = true;
        service.startingX = 0;
        service.startingY = 0;
        service.mouseDownCoord = { x: 0, y: 0 };
        service.currentMousePosition = { x: mouseEventLeftClick.x, y: mouseEventLeftClick.y };

        service.onMouseUp();
        expect(transformToSquareSpy).toHaveBeenCalled();
    });

    it(' onMouseUp should not call transformToSquare if shift is not down and mouse is down', () => {
        const transformToSquareSpy = spyOn(service, 'transformToSquare').and.callThrough();
        service.mouseDown = true;
        service.shiftDown = false;
        service.mouseDownCoord = { x: 0, y: 0 };
        service.currentMousePosition = { x: mouseEventLeftClick.x, y: mouseEventLeftClick.y };

        service.onMouseUp();

        expect(transformToSquareSpy).not.toHaveBeenCalled();
    });

    it(' onMouseMove should call draw if mouse was already down', () => {
        const drawSpy = spyOn(service, 'draw').and.callThrough();
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;

        service.onMouseMove(mouseEventLeftClick);
        expect(drawSpy).toHaveBeenCalled();
    });

    it(' onMouseMove should not call draw if mouse was not already down', () => {
        const drawSpy = spyOn(service, 'draw').and.callThrough();
        service.mouseDown = false;
        service.mouseDownCoord = { x: 0, y: 0 };

        service.onMouseMove(mouseEventLeftClick);
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

    it('draw should call drawFillRect if DrawingType is Fill', () => {
        const properties = service.toolProperties as BasicShapeProperties;
        properties.currentType = DrawingType.Fill;
        const spyFill = spyOn(service, 'drawFillRect');
        service.draw(baseCtxStub);
        expect(spyFill).toHaveBeenCalled();
    });

    it('draw should call drawStrokeRect if DrawingType is Stroke', () => {
        const properties = service.toolProperties as BasicShapeProperties;
        properties.currentType = DrawingType.Stroke;
        const spyStroke = spyOn(service, 'drawStrokeRect');
        service.draw(baseCtxStub);
        expect(spyStroke).toHaveBeenCalled();
    });

    it('draw should call drawFillStrokeRect if DrawingType is FillStroke', () => {
        const properties = service.toolProperties as BasicShapeProperties;
        properties.currentType = DrawingType.FillAndStroke;
        const spyFillStroke = spyOn(service, 'drawFillStrokeRect');
        service.draw(baseCtxStub);
        expect(spyFillStroke).toHaveBeenCalled();
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

    it(' transformToSquare should return the same input if they are equal', () => {
        const fakeRectangle: Vec2 = { x: 150, y: 150 };
        service.width = fakeRectangle.x;
        service.height = fakeRectangle.y;
        const expectedResult: Vec2 = { x: 150, y: 150 };

        expect(service.transformToSquare(fakeRectangle.x, fakeRectangle.y)).toEqual(expectedResult);
    });

    it(' computeDimensions should set the value of width and height correctly', () => {
        service.startingX = mouseEventLeftClick.offsetX;
        service.startingY = mouseEventLeftClick.offsetY;
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

    it(' setThickness should set the thickness of rectangleProperties and call setThickness of drawing service', () => {
        const value = null;
        service.setThickness(value);
        expect(service.toolProperties.thickness).toEqual(1);
        expect(drawServiceSpy.setThickness).toHaveBeenCalled();
    });

    it(' setTypeDrawing should set the currentType of rectangleProperties', () => {
        const properties = service.toolProperties as BasicShapeProperties;
        const value = properties.typesDrawing[0];
        service.setTypeDrawing(value);
        expect(properties.currentType).toEqual(properties.typesDrawing[0]);
    });

    it('drawFill should call fillRect of context', () => {
        const spy = spyOn(baseCtxStub, 'fillRect');
        service.drawFillRect(baseCtxStub, 1, 1);
        expect(spy).toHaveBeenCalled();
    });

    it('drawStroke should call strokeRect of context', () => {
        const spy = spyOn(baseCtxStub, 'strokeRect');
        service.drawStrokeRect(baseCtxStub, 1, 1);
        expect(spy).toHaveBeenCalled();
    });

    it(' drawFillStrokeRect should call drawFillRect and drawStrokeRect', () => {
        const spyFill = spyOn(service, 'drawFillRect');
        const spyStroke = spyOn(service, 'drawStrokeRect');
        service.drawFillStrokeRect(baseCtxStub, 0, 0);
        expect(spyFill).toHaveBeenCalled();
        expect(spyStroke).toHaveBeenCalled();
    });
});
