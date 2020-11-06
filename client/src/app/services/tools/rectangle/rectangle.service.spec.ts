import { TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { ShapeTool } from '@app/classes/tool/shape-tool';
import { BasicShapeProperties } from '@app/classes/tools-properties/basic-shape-properties';
import { DrawingType } from '@app/enums/drawing-type.enum';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { RectangleService } from './rectangle.service';

describe('RectangleService', () => {
    let service: RectangleService;
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
        service = TestBed.inject(RectangleService);

        // tslint:disable:no-string-literal
        service['drawingService'].baseCtx = baseCtxStub;
        service['drawingService'].previewCtx = previewCtxStub;
        service['drawingService'].canvas = canvasTestHelper.canvas;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('drawShape should call adjustThickness, setThickness and drawBoxGuide', () => {
        const adjustThicknessSpy = spyOn(ShapeTool.prototype, 'adjustThickness');
        const drawBoxGuideSpy = spyOn(ShapeTool.prototype, 'drawBoxGuide');

        service.draw(baseCtxStub);
        expect(adjustThicknessSpy).toHaveBeenCalled();
        expect(drawServiceSpy.setThickness).toHaveBeenCalled();
        expect(drawBoxGuideSpy).toHaveBeenCalled();
    });

    it('drawShape should call drawFillRect if DrawingType is Fill', () => {
        const properties = service.toolProperties as BasicShapeProperties;
        properties.currentType = DrawingType.Fill;
        const spyFill = spyOn(baseCtxStub, 'fill');
        service.draw(baseCtxStub);
        expect(spyFill).toHaveBeenCalled();
    });

    it('drawShape should call drawStrokeRect if DrawingType is Stroke', () => {
        const properties = service.toolProperties as BasicShapeProperties;
        properties.currentType = DrawingType.Stroke;
        const spyStroke = spyOn(baseCtxStub, 'stroke');
        service.draw(baseCtxStub);
        expect(spyStroke).toHaveBeenCalled();
    });

    it('drawShape should call drawFillStrokeRect if DrawingType is FillStroke', () => {
        const properties = service.toolProperties as BasicShapeProperties;
        properties.currentType = DrawingType.FillAndStroke;
        const spyFill = spyOn(baseCtxStub, 'fill');
        const spyStroke = spyOn(baseCtxStub, 'stroke');
        service.draw(baseCtxStub);
        expect(spyFill).toHaveBeenCalled();
        expect(spyStroke).toHaveBeenCalled();
    });

    it('clone should return a clone of the tool', () => {
        const spyCopyShape = spyOn(ShapeTool.prototype, 'copyShape');
        const clone = service.clone();
        expect(spyCopyShape).toHaveBeenCalled();
        expect(clone).toEqual(service);
    });
});
