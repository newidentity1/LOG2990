import { TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { BasicShapeProperties } from '@app/classes/tools-properties/basic-shape-properties';
import { Vec2 } from '@app/classes/vec2';
import { DrawingType } from '@app/enums/drawing-type.enum';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { EllipseService } from './ellipse.service';

// tslint:disable:no-any
describe('EllipseService', () => {
    let service: EllipseService;
    let mouseEventLeftClick: MouseEvent;
    let mouseEventRightClick: MouseEvent;
    let keyboardEvent: KeyboardEvent;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let drawSpy: jasmine.Spy<any>;
    let transformToCirleSpy: jasmine.Spy<any>;
    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;

    beforeEach(() => {
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;

        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas', 'setThickness']);
        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawServiceSpy }],
        });
        service = TestBed.inject(EllipseService);
        drawSpy = spyOn<any>(service, 'drawEllipse').and.callThrough();
        transformToCirleSpy = spyOn<any>(service, 'transformToCircle').and.callThrough();

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

    it('onMouseDown should set pathStart to correct position if mouseDown is true', () => {
        service.pathStart = { x: 0, y: 0 };
        const expectedResult: Vec2 = { x: 100, y: 100 };
        service.onMouseDown(mouseEventLeftClick);
        expect(service.pathStart.x).toEqual(expectedResult.x);
        expect(service.pathStart.y).toEqual(expectedResult.y);
    });

    it('onMouseDown should not set pathStart if mouseDown is false ', () => {
        service.pathStart = { x: 0, y: 0 };
        const expectedResult: Vec2 = { x: 0, y: 0 };
        service.onMouseDown(mouseEventRightClick);
        expect(service.pathStart.x).toEqual(expectedResult.x);
        expect(service.pathStart.y).toEqual(expectedResult.y);
    });

    it('onMouseUp should call drawEllipse if mouse was already down', () => {
        service.pathStart = { x: 0, y: 0 };
        service.mouseDown = true;
        service.mouseDownCoord = { x: mouseEventLeftClick.x, y: mouseEventLeftClick.y };
        service.onMouseUp();
        expect(drawSpy).toHaveBeenCalled();
    });

    it('onMouseUp should not call draw if mouse was not already down', () => {
        service.mouseDown = false;
        service.mouseDownCoord = { x: 0, y: 0 };

        service.onMouseUp();
        expect(drawSpy).not.toHaveBeenCalled();
    });

    it('onKeyDown should set shiftDown to true if shift is down', () => {
        service.shiftDown = false;
        service.onKeyDown(keyboardEvent);
        expect(service.shiftDown).toEqual(true);
    });

    it('onKeyDown should keep the old shiftDown value if shift is not down', () => {
        service.shiftDown = false;
        keyboardEvent = new KeyboardEvent('keyup', { code: 'ArrowUp' });
        service.onKeyDown(keyboardEvent);
        expect(service.shiftDown).toEqual(false);
    });

    it('onKeyUp should set shiftDown to false if shift is up', () => {
        service.shiftDown = true;
        keyboardEvent = new KeyboardEvent('keyup', { key: 'Shift' });
        service.onKeyUp(keyboardEvent);
        expect(service.shiftDown).toEqual(false);
    });

    it('onKeyUp should keep the old shiftDown value if shift is not up', () => {
        service.shiftDown = true;
        keyboardEvent = new KeyboardEvent('keyup', { code: 'ArrowUp' });
        service.onKeyUp(keyboardEvent);
        expect(service.shiftDown).toEqual(true);
    });

    it('draw should call ctx.fill if DrawingType is Fill', () => {
        const properties = service.toolProperties as BasicShapeProperties;
        properties.currentType = DrawingType.Fill;
        const spyFill = spyOn(baseCtxStub, 'fill');
        service.drawEllipse(baseCtxStub);
        expect(spyFill).toHaveBeenCalled();
    });

    it('draw should call ctx.stroke if DrawingType is Stroke', () => {
        const properties = service.toolProperties as BasicShapeProperties;
        properties.currentType = DrawingType.Stroke;
        const spyStroke = spyOn(baseCtxStub, 'stroke');
        service.drawEllipse(baseCtxStub);
        expect(spyStroke).toHaveBeenCalled();
    });

    it('draw should call ctx.stroke and ctx.fill if DrawingType is FillAndStroke', () => {
        const properties = service.toolProperties as BasicShapeProperties;
        properties.currentType = DrawingType.FillAndStroke;
        const spyStroke = spyOn(baseCtxStub, 'stroke');
        const spyFill = spyOn(baseCtxStub, 'fill');
        service.drawEllipse(baseCtxStub);
        expect(spyStroke).toHaveBeenCalled();
        expect(spyFill).toHaveBeenCalled();
    });

    it('computeDimensions should return a positive width and a positive height if the coords are on quadrant1', () => {
        const fakeRectangle: Vec2 = { x: 150, y: 200 };
        service.width = fakeRectangle.x;
        service.height = fakeRectangle.y;
        const expectedResult: Vec2 = { x: 150, y: 150 };
        service.transformToCircle();
        console.log(service.height);
        expect({ x: service.width, y: service.height }).toEqual(expectedResult);
    });

    it('transformToCircle should return a negative width and a positive height if the coords are on quadrant2', () => {
        const fakeRectangle: Vec2 = { x: -150, y: 200 };
        service.width = fakeRectangle.x;
        service.height = fakeRectangle.y;
        const expectedResult: Vec2 = { x: -150, y: 150 };
        service.transformToCircle();
        expect({ x: service.width, y: service.height }).toEqual(expectedResult);
    });

    it('transformToCircle should return a negative width and a negative height if the coords are on quadrant3', () => {
        const fakeRectangle: Vec2 = { x: -150, y: -200 };
        service.width = fakeRectangle.x;
        service.height = fakeRectangle.y;
        const expectedResult: Vec2 = { x: -150, y: -150 };
        service.transformToCircle();
        expect({ x: service.width, y: service.height }).toEqual(expectedResult);
    });

    it('transformToCircle should return a positive width and a negative height if the coords are on quadrant4', () => {
        const fakeRectangle: Vec2 = { x: 150, y: -200 };
        service.width = fakeRectangle.x;
        service.height = fakeRectangle.y;
        const expectedResult: Vec2 = { x: 150, y: -150 };
        service.transformToCircle();
        expect({ x: service.width, y: service.height }).toEqual(expectedResult);
    });

    it('onMouseUp should call transformToCircle if shift and mouse is down', () => {
        service.mouseDown = true;
        service.shiftDown = true;
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDownCoord = { x: mouseEventLeftClick.x, y: mouseEventLeftClick.y };

        service.onMouseUp();
        expect(transformToCirleSpy).toHaveBeenCalled();
    });

    it('onMouseUp should not call transformToCircle if shift is not down and mouse is down', () => {
        service.mouseDown = true;
        service.shiftDown = false;
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDownCoord = { x: mouseEventLeftClick.x, y: mouseEventLeftClick.y };

        service.onMouseUp();
        expect(transformToCirleSpy).not.toHaveBeenCalled();
    });

    it('onMouseMove should call draw if mouse was already down', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;

        service.onMouseMove(mouseEventLeftClick);
        expect(drawSpy).toHaveBeenCalled();
    });

    it('onMouseMove should not call draw if mouse was not already down', () => {
        service.mouseDown = false;
        service.mouseDownCoord = { x: 0, y: 0 };

        service.onMouseMove(mouseEventLeftClick);
        expect(drawSpy).not.toHaveBeenCalled();
    });

    it('transformToSquare should return the same input if they are equal', () => {
        const fakeRectangle: Vec2 = { x: 150, y: 150 };
        service.width = fakeRectangle.x;
        service.height = fakeRectangle.y;
        const expectedResult: Vec2 = { x: 150, y: 150 };
        service.transformToCircle();
        expect({ x: service.width, y: service.height }).toEqual(expectedResult);
    });

    it('computeDimensions should set the value of width and height correctly', () => {
        service.pathStart = { x: mouseEventLeftClick.offsetX, y: mouseEventLeftClick.offsetY };
        service.mouseDownCoord = { x: 200, y: 200 };
        const expectedResult: Vec2 = { x: 100, y: 100 };
        service.computeDimensions();
        expect(service.width).toEqual(expectedResult.x);
        expect(service.height).toEqual(expectedResult.y);
    });

    it('setThickness should set the thickness of rectangleProperties to 1 when parameter is null and call setThickness of drawing service', () => {
        const value = null;
        service.setThickness(value);
        expect(service.toolProperties.thickness).toEqual(1);
        expect(drawServiceSpy.setThickness).toHaveBeenCalled();
    });

    it('setThickness should set the thickness of rectangleProperties to parameter if its a number and call setThickness of drawing service', () => {
        const value = 50;
        service.setThickness(value);
        expect(service.toolProperties.thickness).toEqual(value);
        expect(drawServiceSpy.setThickness).toHaveBeenCalled();
    });

    it('setTypeDrawing should set the currentType of rectangleProperties', () => {
        const properties = service.toolProperties as BasicShapeProperties;
        const value = properties.typesDrawing[0];
        service.setTypeDrawing(value);
        expect(properties.currentType).toEqual(properties.typesDrawing[0]);
    });

    it('adjustThickness should shrink the thickness when its not in fill mode bigger than the width or the height', () => {
        const properties = service.toolProperties as BasicShapeProperties;
        properties.currentType = DrawingType.Stroke;
        const value = 50;
        const radius: Vec2 = { x: 25, y: 25 };
        service.setThickness(value);
        service.drawEllipse(baseCtxStub);

        expect(service.adjustThickness(properties, radius)).toEqual(radius.x);
    });

    it('adjustThickness should keep the thickness when its not in fill mode and is smaller than the width or the height', () => {
        const properties = service.toolProperties as BasicShapeProperties;
        properties.currentType = DrawingType.Stroke;
        const value = 10;
        const radius: Vec2 = { x: 25, y: 25 };
        service.setThickness(value);
        service.drawEllipse(baseCtxStub);

        expect(service.adjustThickness(properties, radius)).toEqual(value);
    });

    it('adjustThickness should set the thickness to 1 when its in fill mode', () => {
        const properties = service.toolProperties as BasicShapeProperties;
        properties.currentType = DrawingType.Fill;
        const value = 50;
        const radius: Vec2 = { x: 25, y: 25 };
        service.setThickness(value);
        service.drawEllipse(baseCtxStub);

        expect(service.adjustThickness(properties, radius)).toEqual(1);
    });

    it('should not draw on escape key press', () => {
        service.escapeDown = true;
        const spyFill = spyOn(baseCtxStub, 'fill');
        const spyStroke = spyOn(baseCtxStub, 'stroke');
        service.drawEllipse(baseCtxStub);
        expect(spyFill).not.toHaveBeenCalled();
        expect(spyStroke).not.toHaveBeenCalled();
    });

    it('onKeyDown should set escapeDown to true if escape is down', () => {
        service.escapeDown = false;
        keyboardEvent = new KeyboardEvent('keyDown', { key: 'Escape' });
        service.onKeyDown(keyboardEvent);
        expect(service.escapeDown).toEqual(true);
    });

    it('onKeyDown should call drawEllipse if mouse is down', () => {
        service.mouseDown = true;
        keyboardEvent = new KeyboardEvent('keyDown', { key: 'Shift' });
        service.onKeyDown(keyboardEvent);
        expect(drawSpy).toHaveBeenCalled();
    });

    it('onKeyUp should call drawEllipse if mouse is down', () => {
        service.mouseDown = true;
        keyboardEvent = new KeyboardEvent('keyUp', { key: 'Shift' });
        service.onKeyUp(keyboardEvent);
        expect(drawSpy).toHaveBeenCalled();
    });

    it('onKeyDown should not call drawEllipse if mouse is not down', () => {
        service.mouseDown = false;
        keyboardEvent = new KeyboardEvent('keyDown', { key: 'Shift' });
        service.onKeyDown(keyboardEvent);
        expect(drawSpy).not.toHaveBeenCalled();
    });

    it('onKeyUp should not call drawEllipse if mouse is not down', () => {
        service.mouseDown = false;
        keyboardEvent = new KeyboardEvent('keyUp', { key: 'Shift' });
        service.onKeyUp(keyboardEvent);
        expect(drawSpy).not.toHaveBeenCalled();
    });
});
