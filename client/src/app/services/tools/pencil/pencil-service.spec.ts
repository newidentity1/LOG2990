import { TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { Color } from '@app/classes/color/color';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { PencilService } from './pencil-service';

// tslint:disable:no-any
describe('PencilService', () => {
    let service: PencilService;
    let mouseEvent: MouseEvent;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;

    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let drawSpy: jasmine.Spy<any>;
    let drawCursorSpy: jasmine.Spy<any>;

    beforeEach(() => {
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas', 'setColor', 'setThickness']);

        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawServiceSpy }],
        });
        service = TestBed.inject(PencilService);
        drawSpy = spyOn<any>(service, 'draw').and.callThrough();
        drawCursorSpy = spyOn<any>(service, 'drawCursor').and.callThrough();

        // Configuration du spy du service
        // tslint:disable:no-string-literal
        service['drawingService'].baseCtx = baseCtxStub; // Jasmine doesnt copy properties with underlying data
        service['drawingService'].previewCtx = previewCtxStub;

        mouseEvent = {
            offsetX: 25,
            offsetY: 25,
            button: 0,
        } as MouseEvent;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it(' mouseDown should set mouseDownCoord to correct position', () => {
        const expectedResult: Vec2 = { x: 25, y: 25 };
        service.onMouseDown(mouseEvent);
        expect(service.mouseDownCoord).toEqual(expectedResult);
    });

    it(' mouseDown should set mouseDown property to true on left click', () => {
        service.onMouseDown(mouseEvent);
        expect(service.mouseDown).toEqual(true);
    });

    it(' mouseDown should set mouseDown property to false on right click', () => {
        const mouseEventRClick = {
            offsetX: 25,
            offsetY: 25,
            button: 1,
        } as MouseEvent;
        service.onMouseDown(mouseEventRClick);
        expect(service.mouseDown).toEqual(false);
    });

    it(' onMouseUp should call draw if mouse was already down and inside canvas', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;
        service.insideCanvas = true;

        service.onMouseUp(mouseEvent);
        expect(drawSpy).toHaveBeenCalled();
    });

    it(' onMouseUp should not call draw if mouse was not already down', () => {
        service.mouseDown = false;
        service.mouseDownCoord = { x: 0, y: 0 };

        service.onMouseUp(mouseEvent);
        expect(drawSpy).not.toHaveBeenCalled();
    });

    it(' onMouseMove should call drawLine and should not call drawCursor if mouse was already down', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;

        service.onMouseMove(mouseEvent);
        expect(drawCursorSpy).not.toHaveBeenCalled();
        expect(drawSpy).toHaveBeenCalled();
    });

    it(' onMouseMove should call drawCursor and should not call drawLine if mouse was not already down', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = false;

        service.onMouseMove(mouseEvent);
        expect(drawCursorSpy).toHaveBeenCalled();
        expect(drawSpy).not.toHaveBeenCalled();
    });

    it(' onMouseEnterShould should call drawLine if mouse was already down', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;

        service.onMouseEnter(mouseEvent);
        expect(drawSpy).toHaveBeenCalled();
    });

    it(' onMouseEnterShould should not call drawLine if mouse was not already down', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = false;

        service.onMouseEnter(mouseEvent);
        expect(drawSpy).not.toHaveBeenCalled();
    });

    it(' onMouseLeave should call drawLine and should not call drawCursor if mouse was already down', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;

        service.onMouseLeave(mouseEvent);
        expect(drawCursorSpy).not.toHaveBeenCalled();
        expect(drawSpy).toHaveBeenCalled();
    });

    it(' onMouseLeave should call drawCursor and should not call drawLine if mouse was not already down', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = false;

        service.onMouseLeave(mouseEvent);
        expect(drawCursorSpy).toHaveBeenCalled();
        expect(drawSpy).not.toHaveBeenCalled();
    });

    it(' setColors should call setColor of drawingService', () => {
        service.setColors(new Color(), new Color());
        expect(drawServiceSpy.setColor).toHaveBeenCalled();
    });

    // Exemple de test d'intégration qui est quand même utile
    it(' should change the pixel of the canvas ', () => {
        mouseEvent = { offsetX: 0, offsetY: 0, button: 0 } as MouseEvent;
        service.onMouseDown(mouseEvent);
        mouseEvent = { offsetX: 1, offsetY: 0, button: 0 } as MouseEvent;
        service.onMouseUp(mouseEvent);

        // Premier pixel seulement
        const imageData: ImageData = baseCtxStub.getImageData(0, 0, 1, 1);
        expect(imageData.data[0]).toEqual(0); // R
        expect(imageData.data[1]).toEqual(0); // G
        expect(imageData.data[2]).toEqual(0); // B
        // tslint:disable-next-line:no-magic-numbers
        expect(imageData.data[3]).not.toEqual(0); // A
    });

    it('resetContext should reset all the current changes that the tool made', () => {
        service.mouseDown = true;
        baseCtxStub.lineCap = previewCtxStub.lineCap = 'round';
        baseCtxStub.lineJoin = previewCtxStub.lineJoin = 'bevel';
        service.resetContext();
        expect(service.mouseDown).toEqual(false);
        expect(baseCtxStub.lineCap).toEqual('butt');
        expect(previewCtxStub.lineCap).toEqual('butt');
        expect(baseCtxStub.lineJoin).toEqual('miter');
        expect(previewCtxStub.lineJoin).toEqual('miter');
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalledWith(previewCtxStub);
    });
});
