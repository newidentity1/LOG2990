import { TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { ShapeTool } from '@app/classes/tool/shape-tool';
import { BasicShapeProperties } from '@app/classes/tools-properties/basic-shape-properties';
import { DrawingType } from '@app/enums/drawing-type.enum';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { EllipseService } from './ellipse.service';

// tslint:disable:no-any
describe('EllipseService', () => {
    let service: EllipseService;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let baseCtxStub: CanvasRenderingContext2D;

    beforeEach(() => {
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;

        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas', 'setThickness']);
        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawServiceSpy }],
        });
        service = TestBed.inject(EllipseService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('drawShape should call adjustThickness, setThickness and drawBoxGuide', () => {
        const adjustThicknessSpy = spyOn(ShapeTool.prototype, 'adjustThickness');
        const drawBoxGuideSpy = spyOn(ShapeTool.prototype, 'drawBoxGuide');

        service.drawShape(baseCtxStub);
        expect(adjustThicknessSpy).toHaveBeenCalled();
        expect(drawServiceSpy.setThickness).toHaveBeenCalled();
        expect(drawBoxGuideSpy).toHaveBeenCalled();
    });

    it('drawShape should call ctx.fill if DrawingType is Fill', () => {
        const properties = service.toolProperties as BasicShapeProperties;
        properties.currentType = DrawingType.Fill;
        const spyFill = spyOn(baseCtxStub, 'fill');
        service.drawShape(baseCtxStub);
        expect(spyFill).toHaveBeenCalled();
    });

    it('drawShape should call ctx.stroke if DrawingType is Stroke', () => {
        const properties = service.toolProperties as BasicShapeProperties;
        properties.currentType = DrawingType.Stroke;
        const spyStroke = spyOn(baseCtxStub, 'stroke');
        service.drawShape(baseCtxStub);
        expect(spyStroke).toHaveBeenCalled();
    });

    it('drawShape should call ctx.stroke and ctx.fill if DrawingType is FillAndStroke', () => {
        const properties = service.toolProperties as BasicShapeProperties;
        properties.currentType = DrawingType.FillAndStroke;
        const spyStroke = spyOn(baseCtxStub, 'stroke');
        const spyFill = spyOn(baseCtxStub, 'fill');
        service.drawShape(baseCtxStub);
        expect(spyStroke).toHaveBeenCalled();
        expect(spyFill).toHaveBeenCalled();
    });
});
