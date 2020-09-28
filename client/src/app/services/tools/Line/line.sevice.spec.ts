import { TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { LineService } from './line.service';
// tslint:disable:no-any
describe('LineServiceService', () => {
    let service: LineService;
    let mouseEventclick1: MouseEvent;
    let keyBordShift: KeyboardEvent;
    // let mouseEventclick2: MouseEvent;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;

    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let drawLineSpy: jasmine.Spy<any>;
    let clearLockSpy: jasmine.Spy<any>;
    let ajustementAngleSpy: jasmine.Spy<any>;
    let afficherSegementPreviewSpy: jasmine.Spy<any>;

    beforeEach(() => {
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);

        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawServiceSpy }],
        });
        service = TestBed.inject(LineService);
        drawLineSpy = spyOn<any>(service, 'drawLine').and.callThrough();
        clearLockSpy = spyOn<any>(service, 'clearlock').and.callThrough();
        ajustementAngleSpy = spyOn<any>(service, 'ajustementAngle').and.callThrough();
        afficherSegementPreviewSpy = spyOn<any>(service, 'afficherSegementPreview').and.callThrough();

        // Configuration du spy du service
        // tslint:disable:no-string-literal
        service['drawingService'].baseCtx = baseCtxStub; // Jasmine doesnt copy properties with underlying data
        service['drawingService'].previewCtx = previewCtxStub;

        mouseEventclick1 = {
            offsetX: 25,
            offsetY: 25,
            button: 0,
        } as MouseEvent;

        keyBordShift = {
            code: 'Shift',
            key: 'Shift',
        } as KeyboardEvent;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it(' onClick should set pathData to correct position', () => {
        const expectedResult: Vec2 = { x: 25, y: 25 };
        service.onClick(mouseEventclick1);
        expect(service.pathData[service.pathData.length - 1]).toEqual(expectedResult);
    });

    it(' onClick should not call drawLine  if the number of click < 2', () => {
        service.onClick(mouseEventclick1);
        expect(drawLineSpy).not.toHaveBeenCalled();
    });

    it(' onClick should call drawLine if the number of click > 1', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.pathData.push(service.mouseDownCoord);
        service.onClick(mouseEventclick1);
        expect(drawLineSpy).toHaveBeenCalled();
    });

    it('shift is press should set shift to true', () => {
        service.onKeyDown(keyBordShift);
        expect(service.shift).toEqual(false);
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
        expect(service.endLoop).toEqual(true);
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
        expect(service.endLoop).toEqual(false);
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
});
