import { TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { Color } from '@app/classes/color/color';
import { Vec2 } from '@app/classes/vec2';
import * as CONSTANTS from '@app/constants/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { LineService } from './line.service';
// tslint:disable:no-any : reason spying on functions
describe('LineServiceService', () => {
    let service: LineService;
    let mouseEventclick1: MouseEvent;
    let keyboardEventShift: KeyboardEvent;
    let keyboardEventShiftUP: KeyboardEvent;
    let keyboardEventBackSpace: KeyboardEvent;
    let keyboardEventEscape: KeyboardEvent;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;

    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let drawLineSpy: jasmine.Spy<any>;
    let clearLockSpy: jasmine.Spy<any>;
    let ajustementAngleSpy: jasmine.Spy<any>;
    let afficherSegementPreviewSpy: jasmine.Spy<any>;
    let lockAngleSpy: jasmine.Spy<any>;
    let arcSpy: jasmine.Spy<any>;

    beforeEach(() => {
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas', 'setColor', 'setThickness']);

        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawServiceSpy }],
        });
        service = TestBed.inject(LineService);
        drawLineSpy = spyOn<any>(service, 'drawLine').and.callThrough();
        clearLockSpy = spyOn<any>(service, 'clearlock').and.callThrough();
        ajustementAngleSpy = spyOn<any>(service, 'ajustementAngle').and.callThrough();
        afficherSegementPreviewSpy = spyOn<any>(service, 'afficherSegementPreview').and.callThrough();
        lockAngleSpy = spyOn<any>(service, 'lockAngle').and.callThrough();
        arcSpy = spyOn<any>(previewCtxStub, 'arc').and.callThrough();

        // Configuration du spy du service
        // tslint:disable:no-string-literal
        service['drawingService'].baseCtx = baseCtxStub; // Jasmine doesnt copy properties with underlying data
        service['drawingService'].previewCtx = previewCtxStub;

        mouseEventclick1 = {
            offsetX: 25,
            offsetY: 25,
            button: 0,
        } as MouseEvent;

        keyboardEventShift = new KeyboardEvent('keyDown', { key: 'Shift' });
        keyboardEventShiftUP = new KeyboardEvent('keyUp', { key: 'Shift' });
        keyboardEventBackSpace = new KeyboardEvent('keyDown', { key: 'Backspace' });
        keyboardEventEscape = new KeyboardEvent('keyDown', { code: 'Escape' });
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it(' onClick should set pathData to correct position', () => {
        const expectedResult: Vec2 = { x: 25, y: 25 };
        service.onClick(mouseEventclick1);
        expect(service.pathData[service.pathData.length - 1]).toEqual(expectedResult);
    });

    it(' onClick  with shift press should align preview segment', () => {
        const expectedResult: Vec2 = { x: 25, y: 25 };
        service.shift = true;
        service.mouseDownCoord = { x: 20, y: 20 };
        service.pathData.push(service.mouseDownCoord);
        service.mouseDownCoord = { x: 50, y: 50 };
        service.pathData.push(service.mouseDownCoord);
        service.onClick(mouseEventclick1);
        expect(service.pathData[service.pathData.length - 1]).toEqual(expectedResult);
    });

    it(' onClick  with shift press should align preview segment with -45 deg angle', () => {
        service.mouseDownCoord = { x: 20, y: 20 };
        service.pathData.push(service.mouseDownCoord);
        service.mouseDownCoord = { x: 50, y: 50 };
        service.pathData.push(service.mouseDownCoord);
        service.onKeyDown(keyboardEventShift);
        service.onMouseMove(mouseEventclick1);
        service.onClick(mouseEventclick1);
        const yy: number =
            // tslint:disable-next-line:no-magic-numbers
            Math.tan(CONSTANTS.ANGLE_45) * (25 - service.pathData[service.pathData.length - 1].x) + service.pathData[service.pathData.length - 1].y;
        const expectedResult: Vec2 = { x: 25, y: yy };
        expect(service.pathData[service.pathData.length - 1]).toEqual(expectedResult);
    });

    it(' onClick  with shift press should align preview segment with 45 deg angle', () => {
        service.mouseDownCoord = { x: 20, y: 20 };
        service.pathData.push(service.mouseDownCoord);
        service.mouseDownCoord = { x: 50, y: 50 };
        service.pathData.push(service.mouseDownCoord);
        service.onKeyDown(keyboardEventShift);
        mouseEventclick1 = { offsetX: 175, offsetY: -175, button: 0 } as MouseEvent;
        service.onMouseMove(mouseEventclick1);
        service.onClick(mouseEventclick1);
        const yy: number =
            // tslint:disable-next-line:no-magic-numbers
            -Math.tan(CONSTANTS.ANGLE_45) * (175 - service.pathData[service.pathData.length - 1].x) + service.pathData[service.pathData.length - 1].y;
        const expectedResult: Vec2 = { x: 175, y: yy };
        expect(service.pathData[service.pathData.length - 1]).toEqual(expectedResult);
    });

    it(' onClick  with shift press should align preview segment with 180 deg angle', () => {
        service.mouseDownCoord = { x: 20, y: 20 };
        service.pathData.push(service.mouseDownCoord);
        service.mouseDownCoord = { x: 200, y: 200 };
        service.pathData.push(service.mouseDownCoord);
        service.onKeyDown(keyboardEventShift);
        mouseEventclick1 = { offsetX: 50, offsetY: 203, button: 0 } as MouseEvent;
        service.onMouseMove(mouseEventclick1);
        service.onClick(mouseEventclick1);
        expect(service.lock180).toEqual(true);
    });

    it(' onClick  with shift press should align preview segment with 180 deg angle', () => {
        service.mouseDownCoord = { x: 20, y: 20 };
        service.pathData.push(service.mouseDownCoord);
        service.mouseDownCoord = { x: 200, y: 200 };
        service.pathData.push(service.mouseDownCoord);
        service.onKeyDown(keyboardEventShift);
        mouseEventclick1 = { offsetX: 203, offsetY: 50, button: 0 } as MouseEvent;
        service.onMouseMove(mouseEventclick1);
        service.onClick(mouseEventclick1);
        expect(service.lock90).toEqual(true);
    });

    it(' setColors should call setColors of drawing Service', () => {
        service.setColors(new Color());
        expect(drawServiceSpy.setColor).toHaveBeenCalled();
    });

    it(' should set type connection with point', () => {
        service.setTypeDrawing('Avec point');
        expect(service.withPoint).toEqual(true);
    });

    it(' should type connection set without point', () => {
        service.setTypeDrawing('Sans point');
        expect(service.withPoint).toEqual(false);
    });

    it(' should set point size', () => {
        service.setPointeSize(CONSTANTS.DEFAULT_LINE_POINT_SIZE * 2);
        expect(service.pointSize).toEqual(CONSTANTS.DEFAULT_LINE_POINT_SIZE * 2);
    });

    it(' onClick should not call drawLine  if the number of click < 2', () => {
        service.onClick(mouseEventclick1);
        expect(drawLineSpy).not.toHaveBeenCalled();
    });

    it(' onClick should call drawLine if the number of click > 1', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.pathData.push(service.mouseDownCoord);
        service.mouseDownCoord = { x: 50, y: 50 };
        service.pathData.push(service.mouseDownCoord);
        service.onClick(mouseEventclick1);
        expect(drawLineSpy).toHaveBeenCalled();
    });

    it('shift is press should set shift to true', () => {
        service.onKeyDown(keyboardEventShift);
        expect(service.shift).toEqual(true);
    });

    it('shift is unpress should set shift to false', () => {
        service.mouseDownCoord = { x: 50, y: 50 };
        service.pathData.push(service.mouseDownCoord);
        service.mouseDownCoord = { x: 50, y: 50 };
        service.pathData.push(service.mouseDownCoord);
        service.onMouseMove(mouseEventclick1);
        service.onKeyUp(keyboardEventShiftUP);
        expect(service.shift).toEqual(false);
        expect(clearLockSpy).toHaveBeenCalled();
        expect(drawLineSpy).toHaveBeenCalled();
        expect(service.pathData[service.pathData.length - 1]).toEqual(service.mouseDownCoord);
    });

    it('backSpace is press should delete last point', () => {
        service.mouseDownCoord = { x: 20, y: 20 };
        service.pathData.push(service.mouseDownCoord);
        service.mouseDownCoord = { x: 50, y: 50 };
        service.pathData.push(service.mouseDownCoord);
        service.mouseDownCoord = { x: 100, y: 100 };
        service.pathData.push(service.mouseDownCoord);
        service.onKeyDown(keyboardEventBackSpace);
        const expectedResult: Vec2 = { x: 50, y: 50 };
        expect(service.pathData[service.pathData.length - 1]).toEqual(expectedResult);
    });

    it('backSpace should do nothing if there is no line', () => {
        service.onKeyDown(keyboardEventBackSpace);
        expect(service.pathData.length).toEqual(0);
    });

    it('ajustementAngle should do nothing if there is no line', () => {
        service.ajustementAngle(mouseEventclick1);
        expect(service.pathData.length).toEqual(0);
    });

    it('Ecape is press should delete the line', () => {
        service.onKeyDown(keyboardEventEscape);
        expect(service.pathData.length).toEqual(0);
    });

    it('shift press and click should put lock45 at true', () => {
        service.onKeyDown(keyboardEventShift);
        service.mouseDownCoord = { x: 50, y: 50 };
        service.pathData.push(service.mouseDownCoord);
        service.onMouseMove(mouseEventclick1);
        expect(service.shift).toEqual(true);
        expect(service.lock45).toEqual(true);
    });

    it('shift press and click should put lock45 at true', () => {
        service.onKeyDown(keyboardEventShift);
        service.mouseDownCoord = { x: -50, y: -50 };
        service.pathData.push(service.mouseDownCoord);
        service.onMouseMove(mouseEventclick1);
        expect(service.shift).toEqual(true);
        expect(service.lock45).toEqual(true);
    });

    it('shift press and click should put lock90 at true', () => {
        service.onKeyDown(keyboardEventShift);
        service.mouseDownCoord = { x: 23, y: 10 };
        service.pathData.push(service.mouseDownCoord);
        service.onMouseMove(mouseEventclick1);
        expect(service.shift).toEqual(true);
        expect(service.lock90).toEqual(true);
    });

    it('shift press and click should put lock180 at true', () => {
        service.onKeyDown(keyboardEventShift);
        service.mouseDownCoord = { x: 100, y: 30 };
        service.pathData.push(service.mouseDownCoord);
        service.onMouseMove(mouseEventclick1);
        expect(service.shift).toEqual(true);
        expect(service.lock180).toEqual(true);
    });

    it('Withpoint propriety should put point', () => {
        service.withPoint = true;
        service.mouseDownCoord = { x: 20, y: 20 };
        service.pathData.push(service.mouseDownCoord);
        service.mouseDownCoord = { x: 50, y: 50 };
        service.pathData.push(service.mouseDownCoord);
        service.mouseDownCoord = { x: 100, y: 100 };
        service.pathData.push(service.mouseDownCoord);
        service.onMouseMove(mouseEventclick1);
        expect(arcSpy).toHaveBeenCalled();
    });

    it(' onDoubleClick should call drawLine and close loop', () => {
        service.mouseDownCoord = { x: 20, y: 20 };
        service.pathData.push(service.mouseDownCoord);
        service.mouseDownCoord = { x: 50, y: 50 };
        service.pathData.push(service.mouseDownCoord);
        service.mouseDownCoord = { x: 100, y: 100 };
        service.pathData.push(service.mouseDownCoord);
        service.onDoubleClick(mouseEventclick1);
        expect(drawLineSpy).toHaveBeenCalled();
        expect(service.pathData[service.pathData.length - 1]).toEqual(service.pathData[0]);
    });

    it(' onDoubleClick should call drawLine and not close loop', () => {
        service.mouseDownCoord = { x: 200, y: 200 };
        service.pathData.push(service.mouseDownCoord);
        service.mouseDownCoord = { x: 50, y: 50 };
        service.pathData.push(service.mouseDownCoord);
        service.mouseDownCoord = { x: 100, y: 100 };
        service.pathData.push(service.mouseDownCoord);
        service.onDoubleClick(mouseEventclick1);
        expect(drawLineSpy).toHaveBeenCalled();
    });

    it(' onDoubleClick should do nothing if there is no point', () => {
        service.onDoubleClick(mouseEventclick1);
        expect(service.pathData.length).toEqual(0);
    });

    it(' onKeyUp should do nothing if shift wasnt press', () => {
        service.onKeyUp(keyboardEventBackSpace);
        expect(service.pathData.length).toEqual(0);
    });

    it(' SetPontSie should set size of point should be equal 1 if no size', () => {
        service.setPointeSize(null);
        expect(service.pointSize).toEqual(1);
    });

    // TODO
    it(' setThickness should set thickness equal 1 if no size', () => {
        service.setThickness(null);
        expect(drawServiceSpy.setThickness).toHaveBeenCalled();
    });

    it(' setThickness should set thickness', () => {
        service.setThickness(CONSTANTS.MAXIMUM_THICKNESS);
        expect(drawServiceSpy.setThickness).toHaveBeenCalled();
    });

    it(' onMouseMove should drawLine if mouse was not already down', () => {
        service.mouseDownCoord = { x: 200, y: 200 };
        service.pathData.push(service.mouseDownCoord);
        service.mouseDownCoord = { x: 50, y: 50 };
        service.pathData.push(service.mouseDownCoord);

        service.onMouseMove(mouseEventclick1);
        expect(afficherSegementPreviewSpy).toHaveBeenCalled();
        expect(clearLockSpy).not.toHaveBeenCalled();
        expect(ajustementAngleSpy).not.toHaveBeenCalled();
    });

    it('onMouseMove should not use lock angle if pathdata is empty', () => {
        service.onMouseMove(mouseEventclick1);
        expect(lockAngleSpy).not.toHaveBeenCalled();
    });

    it('resetContext should reset all the current changes that the tool made', () => {
        const clearPathSpy = spyOn<any>(service, 'clearPath').and.callThrough();
        service.mouseDown = true;
        service.shift = false;
        baseCtxStub.lineCap = previewCtxStub.lineCap = 'round';
        baseCtxStub.lineJoin = previewCtxStub.lineJoin = 'bevel';
        service.resetContext();
        expect(service.mouseDown).toEqual(false);
        expect(service.shift).toEqual(false);
        expect(baseCtxStub.lineCap).toEqual('butt');
        expect(previewCtxStub.lineCap).toEqual('butt');
        expect(baseCtxStub.lineJoin).toEqual('miter');
        expect(previewCtxStub.lineJoin).toEqual('miter');
        expect(clearLockSpy).toHaveBeenCalled();
        expect(clearPathSpy).toHaveBeenCalled();
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalledWith(previewCtxStub);
    });
});
