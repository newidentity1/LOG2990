import { TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { BasicShapeProperties } from '@app/classes/tools-properties/basic-shape-properties';
import { Vec2 } from '@app/classes/vec2';
import { DASHED_SEGMENTS } from '@app/constants/constants';
import { DrawingType } from '@app/enums/drawing-type.enum';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { EllipseService } from './ellipse.service';

// tslint:disable:no-any
describe('EllipseService', () => {
    let service: EllipseService;
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
        service = TestBed.inject(EllipseService);
        drawSpy = spyOn<any>(service, 'draw').and.callThrough();
        transformToCirleSpy = spyOn<any>(service, 'transformToCircle').and.callThrough();

        // Configuration du spy du service
        // tslint:disable:no-string-literal
        service['drawingService'].baseCtx = baseCtxStub; // Jasmine doesnt copy properties with underlying data
        service['drawingService'].previewCtx = previewCtxStub;
        service['drawingService'].canvas = canvasTestHelper.canvas;
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

    it('onMouseUp should call draw if mouse was already down', () => {
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
        service.draw(baseCtxStub);
        expect(spyFill).toHaveBeenCalled();
    });

    it('drawShape should call ctx.stroke if DrawingType is Stroke', () => {
        const properties = service.toolProperties as BasicShapeProperties;
        properties.currentType = DrawingType.Stroke;
        const spyStroke = spyOn(baseCtxStub, 'stroke');
        service.draw(baseCtxStub);
        expect(spyStroke).toHaveBeenCalled();
    });

    it('drawShape should call ctx.stroke and ctx.fill if DrawingType is FillAndStroke', () => {
        const properties = service.toolProperties as BasicShapeProperties;
        properties.currentType = DrawingType.FillAndStroke;
        const spyStroke = spyOn(baseCtxStub, 'stroke');
        const spyFill = spyOn(baseCtxStub, 'fill');
        service.draw(baseCtxStub);
        expect(spyStroke).toHaveBeenCalled();
        expect(spyFill).toHaveBeenCalled();
    });

    it('signOf should return 1 if number is positive', () => {
        // tslint:disable:no-magic-numbers / reason: using random numbers
        const result = service['signOf'](10);
        expect(result).toEqual(1);
    });

    it('signOf should return -1 if number is negative', () => {
        const result = service['signOf'](-10);
        expect(result).toEqual(-1);
    });

    it('drawBoxGuide should call stroke twice and setLineDash if mouse was down', () => {
        service.mouseDown = true;
        const spyStroke = spyOn(baseCtxStub, 'stroke');
        const spyLineDash = spyOn(baseCtxStub, 'setLineDash');
        service['drawBoxGuide'](baseCtxStub);
        expect(spyStroke).toHaveBeenCalledTimes(2);
        expect(spyLineDash).toHaveBeenCalledWith([DASHED_SEGMENTS]);
    });

    it('drawBoxGuide should not call stroke and setLineDash if mouse was not down', () => {
        service.mouseDown = false;
        const spyStroke = spyOn(baseCtxStub, 'stroke');
        const spyLineDash = spyOn(baseCtxStub, 'setLineDash');
        service['drawBoxGuide'](baseCtxStub);
        expect(spyStroke).not.toHaveBeenCalled();
        expect(spyLineDash).not.toHaveBeenCalled();
    });

    it('adjustThickness should shrink the thickness when its not in fill mode bigger than the width or the height', () => {
        const value = 50;
        const radius: Vec2 = { x: 25, y: 25 };
        service.width = radius.x * 2;
        service.height = radius.y * 2;
        service.setTypeDrawing(DrawingType.FillAndStroke);
        service.setThickness(value);
        service.adjustThickness();
        expect(service.adjustThickness()).toEqual(radius.x);
    });

    it('adjustThickness should keep the thickness when its not in fill mode and is smaller than the width or the height', () => {
        const value = 10;
        const radius: Vec2 = { x: 25, y: 25 };
        service.width = radius.x * 2;
        service.height = radius.y * 2;
        service.setTypeDrawing(DrawingType.Stroke);
        service.setThickness(value);

        expect(service.adjustThickness()).toEqual(value);
    });

    it('adjustThickness should set the thickness to 1 when its in fill mode', () => {
        const value = 50;
        const radius: Vec2 = { x: 25, y: 25 };
        service.width = radius.x * 2;
        service.height = radius.y * 2;
        service.setTypeDrawing(DrawingType.Fill);
        service.setThickness(value);
        service.adjustThickness();

        expect(service.adjustThickness()).toEqual(0);
    });

    it('should not draw on escape key press', () => {
        service.escapeDown = true;
        const spyFill = spyOn(baseCtxStub, 'fill');
        const spyStroke = spyOn(baseCtxStub, 'stroke');
        service.draw(baseCtxStub);
        expect(spyFill).not.toHaveBeenCalled();
        expect(spyStroke).not.toHaveBeenCalled();
    });

    it('onKeyDown should set escapeDown to true if escape is down', () => {
        service.escapeDown = false;
        keyboardEvent = new KeyboardEvent('keyDown', { key: 'Escape' });
        service.onKeyDown(keyboardEvent);
        expect(service.escapeDown).toEqual(true);
    });

    it('onKeyDown should call draw if mouse is down', () => {
        service.mouseDown = true;
        keyboardEvent = new KeyboardEvent('keyDown', { key: 'Shift' });
        service.onKeyDown(keyboardEvent);
        expect(drawSpy).toHaveBeenCalled();
    });

    it('onKeyUp should call draw if mouse is down', () => {
        service.mouseDown = true;
        keyboardEvent = new KeyboardEvent('keyUp', { key: 'Shift' });
        service.onKeyUp(keyboardEvent);
        expect(drawSpy).toHaveBeenCalled();
    });

    it('onKeyDown should not call draw if mouse is not down', () => {
        service.mouseDown = false;
        keyboardEvent = new KeyboardEvent('keyDown', { key: 'Shift' });
        service.onKeyDown(keyboardEvent);
        expect(drawSpy).not.toHaveBeenCalled();
    });

    it('onKeyUp should not call draw if mouse is not down', () => {
        service.mouseDown = false;
        keyboardEvent = new KeyboardEvent('keyUp', { key: 'Shift' });
        service.onKeyUp(keyboardEvent);
        expect(drawSpy).not.toHaveBeenCalled();
    });

    it('resetContext should reset all the current changes that the tool made', () => {
        service.mouseDown = true;
        service.shiftDown = true;
        service.escapeDown = true;
        service.resetContext();
        expect(service.mouseDown).toEqual(false);
        expect(service.shiftDown).toEqual(false);
        expect(service.escapeDown).toEqual(false);
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalledWith(drawServiceSpy.previewCtx);
    });
});
