import { TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
// import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { EraseService } from './erase.service';
// tslint:disable:no-any
describe('EraseService', () => {
    let service: EraseService;
    let mouseEvent: MouseEvent;
    let mouseEventclick: MouseEvent;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;

    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;

    beforeEach(() => {
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas', 'setColor', 'setFillColor', 'setStrokeColor']);

        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawServiceSpy }],
        });
        service = TestBed.inject(EraseService);

        // Configuration du spy du service
        // tslint:disable:no-string-literal
        service['drawingService'].baseCtx = baseCtxStub; // Jasmine doesnt copy properties with underlying data
        service['drawingService'].previewCtx = previewCtxStub;

        mouseEvent = {
            offsetX: 25,
            offsetY: 25,
            button: 0,
        } as MouseEvent;

        mouseEventclick = {
            offsetX: 0,
            offsetY: 0,
            button: 0,
        } as MouseEvent;

        // const expectedResult: Vec2 = { x: 25, y: 5 };
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('onMouseMove should draw cursor and connect point if mouse down', () => {
        const drawSpy = spyOn<any>(service, 'draw').and.callThrough();
        const drawCursorSpy = spyOn<any>(service, 'drawCursor').and.callThrough();
        service.onMouseDown(mouseEventclick);
        service.onMouseMove(mouseEvent);
        service.mouseDown = true;
        expect(drawSpy).toHaveBeenCalled();
        expect(drawCursorSpy).toHaveBeenCalled();
    });

    it('onMouseMove should draw cursor and connect point if mouse down', () => {
        const drawSpy = spyOn<any>(service, 'draw').and.callThrough();
        const drawCursorSpy = spyOn<any>(service, 'drawCursor').and.callThrough();
        service.onMouseMove(mouseEvent);
        expect(drawSpy).not.toHaveBeenCalled();
        expect(drawCursorSpy).toHaveBeenCalled();
    });

    it('clone should return a clone of the tool', () => {
        const spyCopyShape = spyOn(EraseService.prototype, 'copyTool');
        const clone = service.clone();
        expect(spyCopyShape).toHaveBeenCalled();
        expect(clone).toEqual(service);
    });
    // Todo rajouter test
});
