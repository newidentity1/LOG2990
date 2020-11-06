import { TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { ShapeTool } from '@app/classes/tool/shape-tool';
import { BasicShapeProperties } from '@app/classes/tools-properties/basic-shape-properties';
import { PolygonProperties } from '@app/classes/tools-properties/polygon-properties';
import { Vec2 } from '@app/classes/vec2';
import { DASHED_SEGMENTS, MAXIMUM_SIDES, MINIMUM_SIDES } from '@app/constants/constants';
import { DrawingType } from '@app/enums/drawing-type.enum';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { PolygonService } from './polygon.service';

describe('PolygonService', () => {
    let service: PolygonService;
    let drawingServiceSpy: jasmine.SpyObj<DrawingService>;

    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;

    beforeEach(() => {
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;

        drawingServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas', 'setThickness']);
        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawingServiceSpy }],
        });
        service = TestBed.inject(PolygonService);
        // tslint:disable:no-string-literal
        service['drawingService'].baseCtx = baseCtxStub;
        service['drawingService'].previewCtx = previewCtxStub;
        service['drawingService'].canvas = canvasTestHelper.canvas;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    it(' onKeyDown should stop drawing if escape is down ', () => {
        const keyboardEvent = new KeyboardEvent('keyDown', { key: 'Escape' });
        service.mouseDown = true;
        service.onKeyDown(keyboardEvent);

        expect(service.mouseDown).toBeFalse();
        expect(drawingServiceSpy.clearCanvas).toHaveBeenCalledWith(drawingServiceSpy.previewCtx);
    });

    it(' onKeyDown should not stop drawing if escape is not down and if mouse was already down', () => {
        service.mouseDown = true;
        const keyboardEvent = new KeyboardEvent('keyup', { code: 'ArrowUp' });
        service.onKeyDown(keyboardEvent);

        expect(service.mouseDown).toBeTrue();
        expect(drawingServiceSpy.clearCanvas).not.toHaveBeenCalled();
    });

    it(' onKeyUp should not stop drawing', () => {
        service.mouseDown = true;
        const keyboardEvent = new KeyboardEvent('keyup', { key: 'ArrowUp' });
        service.onKeyUp(keyboardEvent);
        expect(service.mouseDown).toBeTrue();
        expect(drawingServiceSpy.clearCanvas).not.toHaveBeenCalled();
    });

    it('computeDimensions should set the value of width and height correctly when width and height are positive', () => {
        service.mouseDownCoord = { x: 200, y: 250 };
        service.currentMousePosition = { x: 300, y: 300 };
        const expectedResult: Vec2 = { x: 50, y: 50 };
        // tslint:disable-next-line:no-string-literal / reason: accessing private member
        service.computeDimensions();
        expect(service.width).toEqual(expectedResult.x);
        expect(service.height).toEqual(expectedResult.y);
    });

    it('computeDimensions should set the value of width and height correctly when width is negative and height is positive', () => {
        service.mouseDownCoord = { x: 300, y: 250 };
        service.currentMousePosition = { x: 200, y: 300 };
        const expectedResult: Vec2 = { x: -50, y: 50 };
        // tslint:disable-next-line:no-string-literal / reason: accessing private member
        service.computeDimensions();
        expect(service.width).toEqual(expectedResult.x);
        expect(service.height).toEqual(expectedResult.y);
    });

    it('computeDimensions should set the value of width and height correctly when width is positive and height is negative', () => {
        service.mouseDownCoord = { x: 200, y: 300 };
        service.currentMousePosition = { x: 300, y: 250 };
        const expectedResult: Vec2 = { x: 50, y: -50 };
        // tslint:disable-next-line:no-string-literal / reason: accessing private member
        service.computeDimensions();
        expect(service.width).toEqual(expectedResult.x);
        expect(service.height).toEqual(expectedResult.y);
    });

    it('computeDimensions should set the value of width and height correctly when width and height are negative', () => {
        service.mouseDownCoord = { x: 300, y: 300 };
        service.currentMousePosition = { x: 200, y: 250 };
        const expectedResult: Vec2 = { x: -50, y: -50 };
        // tslint:disable-next-line:no-string-literal / reason: accessing private member
        service.computeDimensions();
        expect(service.width).toEqual(expectedResult.x);
        expect(service.height).toEqual(expectedResult.y);
    });

    it('draw should call adjustThickness, setThickness and drawBoxGuide', () => {
        const adjustThicknessSpy = spyOn(service, 'adjustThickness');
        const drawBoxGuideSpy = spyOn(service, 'drawBoxGuide');

        service.draw(baseCtxStub);
        expect(adjustThicknessSpy).toHaveBeenCalled();
        expect(drawingServiceSpy.setThickness).toHaveBeenCalled();
        expect(drawBoxGuideSpy).toHaveBeenCalled();
    });

    it('draw should call drawFillRect if DrawingType is Fill', () => {
        const properties = service.toolProperties as BasicShapeProperties;
        properties.currentType = DrawingType.Fill;
        const spyFill = spyOn(baseCtxStub, 'fill');
        service.draw(baseCtxStub);
        expect(spyFill).toHaveBeenCalled();
    });

    it('draw should call drawStrokeRect if DrawingType is Stroke', () => {
        const properties = service.toolProperties as BasicShapeProperties;
        properties.currentType = DrawingType.Stroke;
        const spyStroke = spyOn(baseCtxStub, 'stroke');
        service.draw(baseCtxStub);
        expect(spyStroke).toHaveBeenCalled();
    });

    it('draw should call drawFillStrokeRect if DrawingType is FillStroke', () => {
        const properties = service.toolProperties as BasicShapeProperties;
        properties.currentType = DrawingType.FillAndStroke;
        const spyFill = spyOn(baseCtxStub, 'fill');
        const spyStroke = spyOn(baseCtxStub, 'stroke');
        service.draw(baseCtxStub);
        expect(spyFill).toHaveBeenCalled();
        expect(spyStroke).toHaveBeenCalled();
    });

    it('setNumberOfSides should set the number of sides of toolProperties if it has a value', () => {
        const properties = service.toolProperties as PolygonProperties;
        service.setNumberOfSides(MAXIMUM_SIDES);
        expect(properties.numberOfSides).toEqual(MAXIMUM_SIDES);
    });

    it('setNumberOfSides should set the number of sides of toolProperties if it its null', () => {
        const properties = service.toolProperties as PolygonProperties;
        service.setNumberOfSides(null);
        expect(properties.numberOfSides).toEqual(MINIMUM_SIDES);
    });

    it('drawBoxGuide should call stroke twice and setLineDash if mouse was down', () => {
        service.mouseDown = true;
        const spyStroke = spyOn(previewCtxStub, 'stroke');
        const spyLineDash = spyOn(previewCtxStub, 'setLineDash');
        service.drawBoxGuide();
        expect(spyStroke).toHaveBeenCalledTimes(2);
        expect(spyLineDash).toHaveBeenCalledWith([DASHED_SEGMENTS]);
    });

    it('drawBoxGuide should not call stroke and setLineDash if mouse was not down', () => {
        service.mouseDown = false;
        const spyStroke = spyOn(previewCtxStub, 'stroke');
        const spyLineDash = spyOn(previewCtxStub, 'setLineDash');
        service.drawBoxGuide();
        expect(spyStroke).not.toHaveBeenCalled();
        expect(spyLineDash).not.toHaveBeenCalled();
    });

    it('clone should return a clone of the tool', () => {
        const spyCopyShape = spyOn(ShapeTool.prototype, 'copyShape');
        const clone = service.clone();
        expect(spyCopyShape).toHaveBeenCalled();
        expect(clone).toEqual(service);
    });
});
