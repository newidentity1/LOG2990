import { TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { Tool } from '@app/classes/tool/tool';
import { Vec2 } from '@app/classes/vec2';
import {
    DEFAULT_CALLIGRAPHY_LINE_LENGTH,
    DEFAULT_ROTATION_ANGLE,
    IMAGE_DATA_OPACITY_INDEX,
    MAXIMUM_ROTATION_ANGLE,
    MAX_COLOR_VALUE,
} from '@app/constants/constants';
import { MouseButton } from '@app/enums/mouse-button.enum';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { PencilService } from '@app/services/tools/pencil/pencil.service';
import { CalligraphyService } from './calligraphy.service';

describe('CalligraphyService', () => {
    let service: CalligraphyService;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;

    // tslint:disable:no-any / reason: spying on function
    let drawCursorSpy: jasmine.Spy<any>;
    let mouseEvent: MouseEvent;

    beforeEach(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas', 'setThickness']);

        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawServiceSpy }],
        });
        service = TestBed.inject(CalligraphyService);

        drawCursorSpy = spyOn<any>(service, 'drawCursor').and.callThrough();

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

        mouseEvent = {
            clientX: 25,
            clientY: 25,
            button: MouseButton.Left,
        } as MouseEvent;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('onKeyDown should set altDown to true if alt was pressed', () => {
        service['atlDown'] = false;
        const keyboardEvent = new KeyboardEvent('keyDown', { key: 'Alt' });
        service.onKeyDown(keyboardEvent);
        expect(service['atlDown']).toBeTrue();
    });

    it('onKeyDown should not change altDown if alt was not pressed', () => {
        service['atlDown'] = false;
        const keyboardEvent = new KeyboardEvent('keyDown', { key: '' });
        service.onKeyDown(keyboardEvent);
        expect(service['atlDown']).toBeFalse();
    });

    it('onKeyUp should set altDown to false if alt was released', () => {
        service['atlDown'] = true;
        const keyboardEvent = new KeyboardEvent('keyDown', { key: 'Alt' });
        service.onKeyUp(keyboardEvent);
        expect(service['atlDown']).toBeFalse();
    });

    it('onKeyUp should not change altDown if alt was not released', () => {
        service['atlDown'] = false;
        const keyboardEvent = new KeyboardEvent('keyDown', { key: '' });
        service.onKeyUp(keyboardEvent);
        expect(service['atlDown']).toBeFalse();
    });

    it('onMouseScroll should redraw cursor', () => {
        service.currentMousePosition = { x: 25, y: 25 };
        const scrollEvent = {} as WheelEvent;
        service.onMouseScroll(scrollEvent);
        expect(drawCursorSpy).toHaveBeenCalled();
    });

    it('onMouseScroll should add 15 degrees to lineAngle if scrolling down and Alt key is not down', () => {
        service.currentMousePosition = { x: 25, y: 25 };
        service['atlDown'] = false;
        service.lineAngle = 0;
        const scrollEvent = { deltaY: 1 } as WheelEvent;
        service.onMouseScroll(scrollEvent);
        expect(service.lineAngle).toEqual(DEFAULT_ROTATION_ANGLE);
    });

    it('onMouseScroll should remove 15 degrees to lineAngle if scrolling up and Alt key is not down', () => {
        service.currentMousePosition = { x: 25, y: 25 };
        service['atlDown'] = false;
        service.lineAngle = DEFAULT_ROTATION_ANGLE;
        const scrollEvent = { deltaY: -1 } as WheelEvent;
        service.onMouseScroll(scrollEvent);
        expect(service.lineAngle).toEqual(0);
    });

    it('onMouseScroll should not set lineAngle to smaller than 0', () => {
        service.currentMousePosition = { x: 25, y: 25 };
        service['atlDown'] = false;
        service.lineAngle = 0;
        const scrollEvent = { deltaY: -1 } as WheelEvent;
        service.onMouseScroll(scrollEvent);
        expect(service.lineAngle).toEqual(MAXIMUM_ROTATION_ANGLE - DEFAULT_ROTATION_ANGLE);
    });

    it('onMouseScroll should not set lineAngle to bigger than 360', () => {
        service.currentMousePosition = { x: 25, y: 25 };
        service['atlDown'] = false;
        service.lineAngle = MAXIMUM_ROTATION_ANGLE - DEFAULT_ROTATION_ANGLE;
        const scrollEvent = { deltaY: 1 } as WheelEvent;
        service.onMouseScroll(scrollEvent);
        expect(service.lineAngle).toEqual(0);
    });

    it('onMouseScroll should change lineAngle by 1 if scrolling and Alt key is down', () => {
        service.currentMousePosition = { x: 25, y: 25 };
        service['atlDown'] = true;
        service.lineAngle = 0;
        const scrollEvent = { deltaY: 1 } as WheelEvent;
        service.onMouseScroll(scrollEvent);
        expect(service.lineAngle).toEqual(1);
    });

    it('onMouseDown should call onMouseDown of parent class and save current angle if left mouse is down', () => {
        const parentOnMouseDownSpy = spyOn(PencilService.prototype, 'onMouseDown').and.callThrough();
        const clearPathAngleSpy = spyOn<any>(service, 'clearPathAngle');
        const expectedLineAngle = 25;
        service['pathDataAngle'] = [];
        service.lineAngle = expectedLineAngle;
        service.onMouseDown(mouseEvent);

        expect(parentOnMouseDownSpy).toHaveBeenCalledWith(mouseEvent);
        expect(service.mouseDown).toBeTrue();
        expect(clearPathAngleSpy).toHaveBeenCalled();
        expect(service['pathDataAngle'][0]).toEqual(expectedLineAngle);
    });

    it('onMouseDown should not save current angle if left mouse is not down', () => {
        const parentOnMouseDownSpy = spyOn(PencilService.prototype, 'onMouseDown').and.callThrough();
        const clearPathAngleSpy = spyOn<any>(service, 'clearPathAngle');
        const expectedLineAngle = 25;
        service['pathDataAngle'] = [];
        service.lineAngle = expectedLineAngle;
        const rightMouseEvent = { clientX: 25, clientY: 25, button: MouseButton.Right } as MouseEvent;
        service.onMouseDown(rightMouseEvent);

        expect(parentOnMouseDownSpy).toHaveBeenCalledWith(rightMouseEvent);
        expect(service.mouseDown).toBeFalse();
        expect(clearPathAngleSpy).not.toHaveBeenCalled();
        expect(service['pathDataAngle'].length).toEqual(0);
    });

    it('onMouseUp should set mouseDown to false, draw on base canvas and clear path data if left mouse was down', () => {
        const drawSpy = spyOn<any>(service, 'draw');
        const clearPathSpy = spyOn<any>(service, 'clearPath');
        const clearPathAngleSpy = spyOn<any>(service, 'clearPathAngle');
        service.mouseDown = true;
        service.onMouseUp();

        expect(service.mouseDown).toBeFalse();
        expect(drawSpy).toHaveBeenCalled();
        expect(clearPathSpy).toHaveBeenCalled();
        expect(clearPathAngleSpy).toHaveBeenCalled();
    });

    it('onMouseUp should not draw on base canvas and clear path data if left mouse was not down', () => {
        const drawSpy = spyOn<any>(service, 'draw');
        const clearPathSpy = spyOn<any>(service, 'clearPath');
        const clearPathAngleSpy = spyOn<any>(service, 'clearPathAngle');
        service.mouseDown = false;
        service.onMouseUp();

        expect(service.mouseDown).toBeFalse();
        expect(drawSpy).not.toHaveBeenCalled();
        expect(clearPathSpy).not.toHaveBeenCalled();
        expect(clearPathAngleSpy).not.toHaveBeenCalled();
    });

    it('onMouseMove should call drawStrokeToNextPoint and update path data if left mouse is down', () => {
        const drawStrokeToNextPointSpy = spyOn<any>(service, 'drawStrokeToNextPoint');
        service.mouseDown = true;
        service.pathData = [];
        service['pathDataAngle'] = [];
        service.onMouseMove(mouseEvent);
        expect(drawStrokeToNextPointSpy).toHaveBeenCalled();
        expect(service.pathData[0]).toEqual(service.currentMousePosition);
        expect(service['pathDataAngle'][0]).toEqual(service.lineAngle);
        expect(drawStrokeToNextPointSpy).toHaveBeenCalled();
    });

    it('onMouseMove should call drawCursor if left mouse is not down', () => {
        service.mouseDown = false;
        service.pathData = [];
        service['pathDataAngle'] = [];
        service.onMouseMove(mouseEvent);
        expect(drawCursorSpy).toHaveBeenCalled();
    });

    it('draw should draw all points with drawStrokeToNextPoint', () => {
        const drawStrokeToNextPointSpy = spyOn<any>(service, 'drawStrokeToNextPoint');
        service.pathData = [
            { x: 10, y: 10 },
            { x: 15, y: 15 },
            { x: 20, y: 20 },
        ];
        service.draw(drawServiceSpy.baseCtx);
        expect(drawStrokeToNextPointSpy).toHaveBeenCalledTimes(service.pathData.length - 1);
    });

    it('drawStrokeToNextPoint should calculate distance and angle to next point', () => {
        const drawStrokeSpy = spyOn<any>(service, 'drawStroke');
        const calculateDistanceBetweenPointsSpy = spyOn<any>(service, 'calculateDistanceBetweenPoints').and.callThrough();
        const calculateAngleBetweenPointsSpy = spyOn<any>(service, 'calculateAngleBetweenPoints').and.callThrough();
        service['drawStrokeToNextPoint'](drawServiceSpy.baseCtx, { x: 10, y: 10 }, { x: 15, y: 15 }, 0);
        expect(drawStrokeSpy).toHaveBeenCalled();
        expect(calculateDistanceBetweenPointsSpy).toHaveBeenCalled();
        expect(calculateAngleBetweenPointsSpy).toHaveBeenCalled();
    });

    it('drawCursor should clear preview canvas and redraw cursor on new position if mouse is not down', () => {
        const drawStrokeSpy = spyOn<any>(service, 'drawStroke');
        service.mouseDown = false;
        service['drawCursor']();
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(drawStrokeSpy).toHaveBeenCalled();
    });

    it('drawCursor should not clear preview canvas and redraw cursor if mouse is down', () => {
        const drawStrokeSpy = spyOn<any>(service, 'drawStroke');
        service.mouseDown = true;
        service['drawCursor']();
        expect(drawServiceSpy.clearCanvas).not.toHaveBeenCalled();
        expect(drawStrokeSpy).not.toHaveBeenCalled();
    });

    it('drawStroke should pixel at specified position', () => {
        drawServiceSpy.baseCtx.lineWidth = 2;
        const position: Vec2 = { x: 10, y: 10 };
        service['drawStroke'](drawServiceSpy.baseCtx, position, 0);
        const imageData = drawServiceSpy.baseCtx.getImageData(position.x, position.y, 1, 1).data;
        expect(imageData[0]).toEqual(0);
        expect(imageData[1]).toEqual(0);
        expect(imageData[2]).toEqual(0);
        expect(imageData[IMAGE_DATA_OPACITY_INDEX]).toEqual(MAX_COLOR_VALUE);
    });

    it('calculateDistanceBetweenPoints should return distance between two points', () => {
        const point1 = { x: 0, y: 0 };
        const point2 = { x: 10, y: 0 };
        const returnedDistance = service['calculateDistanceBetweenPoints'](point1, point2);
        expect(returnedDistance).toEqual(point2.x);
    });

    it('calculateAngleBetweenPoints should return angle between two points', () => {
        const point1 = { x: 0, y: 0 };
        const point2 = { x: 10, y: 0 };
        const returnedAngle = service['calculateAngleBetweenPoints'](point1, point2);
        expect(returnedAngle).toEqual(Math.PI / 2);
    });

    it('clearPathAngle should clear pathDataAngle array', () => {
        service['pathDataAngle'] = [0, 1, 2];
        service['clearPathAngle']();
        expect(service['pathDataAngle'].length).toEqual(0);
    });

    it('copyTool should copy all attributes needed to draw calligraphy strokes', () => {
        const copyToolSpy = spyOn<any>(service, 'copyTool').and.callThrough();
        service.lineLength = DEFAULT_CALLIGRAPHY_LINE_LENGTH;
        const expectedPathData = [
            { x: 10, y: 10 },
            { x: 15, y: 15 },
            { x: 20, y: 20 },
        ];
        service.pathData = expectedPathData;
        const expectedPathDataAngle = [0, 1, 2];
        service['pathDataAngle'] = expectedPathDataAngle;
        const calligraphyToolCopy = service.clone() as CalligraphyService;

        expect(copyToolSpy).toHaveBeenCalled();
        expect(calligraphyToolCopy.lineLength).toEqual(DEFAULT_CALLIGRAPHY_LINE_LENGTH);
        expect(calligraphyToolCopy.pathData).toEqual(expectedPathData);
        expect(calligraphyToolCopy['pathDataAngle']).toEqual(expectedPathDataAngle);
    });

    it('applyCurrentSettings should call applyCurrentSettings of parent class and call setThickness of drawingService', () => {
        // tslint:disable-next-line: no-empty / reason: spying on fake function call
        const parentApplyCurrentSettingsSpy = spyOn<any>(Tool.prototype, 'applyCurrentSettings').and.callFake(() => {});
        service.applyCurrentSettings();
        expect(parentApplyCurrentSettingsSpy).toHaveBeenCalled();
        expect(drawServiceSpy.setThickness).toHaveBeenCalledWith(2);
    });
});
