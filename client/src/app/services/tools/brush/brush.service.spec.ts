import { TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { BrushProperties } from '@app/classes/tools-properties/brush-properties';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { BrushService } from './brush.service';
// tslint:disable:no-any
describe('BrushService', () => {
    let service: BrushService;

    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    const path: Vec2[] = [];
    const point1: Vec2 = { x: 10, y: 10 } as Vec2;
    const point2: Vec2 = { x: 20, y: 20 } as Vec2;
    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let drawLineSpy: jasmine.Spy<any>;
    beforeEach(() => {
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas', 'setColor', 'setFillColor', 'setStrokeColor']);
        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawServiceSpy }],
        });
        service = TestBed.inject(BrushService);
        drawLineSpy = spyOn<any>(service, 'drawLine').and.callThrough();

        // Configuration du spy du service
        // tslint:disable:no-string-literal
        service['drawingService'].baseCtx = baseCtxStub; // Jasmine doesnt copy properties with underlying data
        service['drawingService'].previewCtx = previewCtxStub;
        path.push(point1);
        path.push(point2);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('drawLine should use correct filter', () => {
        service.setFilter('Brouillé');
        service['drawLine'](previewCtxStub, path);
        expect(drawLineSpy).toHaveBeenCalled();
        const brushProperties = service.toolProperties as BrushProperties;
        expect(brushProperties.currentFilter).toEqual('Brouillé');
    });

    it('drawLine should use correct filter', () => {
        service.setFilter('Brosse');
        service['drawLine'](previewCtxStub, path);
        expect(drawLineSpy).toHaveBeenCalled();
        const brushProperties = service.toolProperties as BrushProperties;
        expect(brushProperties.currentFilter).toEqual('Brosse');
    });

    it('drawLine should use correct filter', () => {
        service.setFilter('Graffiti');
        service['drawLine'](previewCtxStub, path);
        expect(drawLineSpy).toHaveBeenCalled();
        const brushProperties = service.toolProperties as BrushProperties;
        expect(brushProperties.currentFilter).toEqual('Graffiti');
    });

    it('drawLine should use correct filter', () => {
        service.setFilter('Éclaboussure');
        service['drawLine'](previewCtxStub, path);
        expect(drawLineSpy).toHaveBeenCalled();
        const brushProperties = service.toolProperties as BrushProperties;
        expect(brushProperties.currentFilter).toEqual('Éclaboussure');
    });

    it('drawLine should use correct filter', () => {
        service.setFilter('Nuage');
        service['drawLine'](previewCtxStub, path);
        expect(drawLineSpy).toHaveBeenCalled();
        const brushProperties = service.toolProperties as BrushProperties;
        expect(brushProperties.currentFilter).toEqual('Nuage');
    });

    it('setFilter should set correct filter', () => {
        service.setFilter('Brouillé');
        const brushProperties = service.toolProperties as BrushProperties;
        expect(brushProperties.currentFilter).toEqual('Brouillé');
    });
});
