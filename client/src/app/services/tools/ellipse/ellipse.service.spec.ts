import { TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
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
    // let transformToCirleSpy: jasmine.Spy<any>;
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
        // transformToCirleSpy = spyOn<any>(service, 'transformToSquare').and.callThrough();

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
});
