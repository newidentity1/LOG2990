import { TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { BrushProperties } from '@app/classes/tools-properties/brush-properties';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { BrushService } from './brush.service';

// tslint:disable:no-any
describe('BrushService', () => {
    let service: BrushService;
    let mouseEvent: MouseEvent;
    const path: Vec2[] = [];
    const point1: Vec2 = { x: 10, y: 10 } as Vec2;
    const point2: Vec2 = { x: 20, y: 20 } as Vec2;
    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let drawLineSpy: jasmine.Spy<any>;
    let drawCursorSpy: jasmine.Spy<any>;
    beforeEach(() => {
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas', 'setColor', 'setFillColor', 'setStrokeColor']);
        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawServiceSpy }],
        });
        service = TestBed.inject(BrushService);
        drawLineSpy = spyOn<any>(service, 'drawLine').and.callThrough();
        drawCursorSpy = spyOn<any>(service, 'drawCursor').and.callThrough();

        // Configuration du spy du service
        // tslint:disable:no-string-literal
        service['drawingService'].baseCtx = baseCtxStub; // Jasmine doesnt copy properties with underlying data
        service['drawingService'].previewCtx = previewCtxStub;
        path.push(point1);
        path.push(point2);

        mouseEvent = {
            offsetX: 25,
            offsetY: 25,
            button: 0,
        } as MouseEvent;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('mouseMove should not call drawCursor if mouseDown is true', () => {
        service.mouseDown = true;
        service.mouseDownCoord = { x: 0, y: 0 };

        service.onMouseMove(mouseEvent);
        expect(drawCursorSpy).not.toHaveBeenCalled();
    });

    it('mouseMove should call drawCursor if mouseDown is false', () => {
        service.mouseDown = false;
        service.mouseDownCoord = { x: 0, y: 0 };

        service.onMouseMove(mouseEvent);
        expect(drawCursorSpy).toHaveBeenCalled();
    });

    it('switchFilter should change to correct filter(Brouille)', () => {
        service.setFilter('Brouillé');
        service['draw'](previewCtxStub, path);
        expect(drawLineSpy).toHaveBeenCalled();
        const brushProperties = service.toolProperties as BrushProperties;
        expect(brushProperties.currentFilter).toEqual('Brouillé');
    });

    it('switchFilter should change to correct filter(Brosse)', () => {
        service.setFilter('Brosse');
        service['draw'](previewCtxStub, path);
        expect(drawLineSpy).toHaveBeenCalled();
        const brushProperties = service.toolProperties as BrushProperties;
        expect(brushProperties.currentFilter).toEqual('Brosse');
    });

    it('switchFilter should change to correct filter(Graffiti)', () => {
        service.setFilter('Graffiti');
        service['draw'](previewCtxStub, path);
        expect(drawLineSpy).toHaveBeenCalled();
        const brushProperties = service.toolProperties as BrushProperties;
        expect(brushProperties.currentFilter).toEqual('Graffiti');
    });

    it('switchFilter should change to correct filter(Eclaboussure)', () => {
        service.setFilter('Éclaboussure');
        service['draw'](previewCtxStub, path);
        expect(drawLineSpy).toHaveBeenCalled();
        const brushProperties = service.toolProperties as BrushProperties;
        expect(brushProperties.currentFilter).toEqual('Éclaboussure');
    });

    it('switchFilter should change to correct filter(Nuage)', () => {
        service.setFilter('Nuage');
        service['draw'](previewCtxStub, path);
        expect(drawLineSpy).toHaveBeenCalled();
        const brushProperties = service.toolProperties as BrushProperties;
        expect(brushProperties.currentFilter).toEqual('Nuage');
    });

    it('setFilter should set the correct filter if filter is valid', () => {
        service.setFilter('Brouillé');
        const brushProperties = service.toolProperties as BrushProperties;
        expect(brushProperties.currentFilter).toEqual('Brouillé');
    });

    it('setFilter should assign a filter that does not exist', () => {
        service.setFilter('');
        const brushProperties = service.toolProperties as BrushProperties;
        expect(brushProperties.currentFilter).not.toEqual('');
    });
});
