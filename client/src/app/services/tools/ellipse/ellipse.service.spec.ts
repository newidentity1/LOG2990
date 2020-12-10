import { TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { ShapeTool } from '@app/classes/tool/shape-tool';
import { BasicShapeProperties } from '@app/classes/tools-properties/basic-shape-properties';
import { Vec2 } from '@app/classes/vec2';
import { DASHED_SEGMENTS } from '@app/constants/constants';
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

        // tslint:disable:no-string-literal
        service['drawingService'].baseCtx = baseCtxStub; // Jasmine doesnt copy properties with underlying data
        service['drawingService'].canvas = canvasTestHelper.canvas;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('draw should call ctx.fill if DrawingType is Fill', () => {
        const properties = service.toolProperties as BasicShapeProperties;
        properties.currentType = DrawingType.Fill;
        const spyFill = spyOn(baseCtxStub, 'fill');
        service.draw(baseCtxStub);
        expect(spyFill).toHaveBeenCalled();
    });

    it('drawShape should call ctx.stroke if DrawingType is Stroke', () => {
        const properties = service.toolProperties as BasicShapeProperties;
        properties.currentType = DrawingType.Stroke;
        const spyStroke = spyOn(baseCtxStub, 'stroke');
        service.draw(baseCtxStub);
        expect(spyStroke).toHaveBeenCalled();
    });

    it('drawShape should call ctx.stroke and ctx.fill if DrawingType is FillAndStroke', () => {
        const properties = service.toolProperties as BasicShapeProperties;
        properties.currentType = DrawingType.FillAndStroke;
        const spyStroke = spyOn(baseCtxStub, 'stroke');
        const spyFill = spyOn(baseCtxStub, 'fill');
        service.draw(baseCtxStub);
        expect(spyStroke).toHaveBeenCalled();
        expect(spyFill).toHaveBeenCalled();
    });

    it('drawBoxGuide should call stroke and setLineDash if mouse was down', () => {
        service.mouseDown = true;
        const spyStroke = spyOn(baseCtxStub, 'stroke');
        const spyLineDash = spyOn(baseCtxStub, 'setLineDash');
        service['drawBoxGuide'](baseCtxStub);
        expect(spyStroke).toHaveBeenCalled();
        expect(spyLineDash).toHaveBeenCalledWith([DASHED_SEGMENTS]);
    });

    it('drawBoxGuide should not call stroke and setLineDash if mouse was not down', () => {
        service.mouseDown = false;
        const spyStroke = spyOn(baseCtxStub, 'stroke');
        const spyLineDash = spyOn(baseCtxStub, 'setLineDash');
        service['drawBoxGuide'](baseCtxStub);
        expect(spyStroke).not.toHaveBeenCalled();
        expect(spyLineDash).not.toHaveBeenCalled();
    });

    it('adjustThickness should shrink the thickness when its not in fill mode bigger than the width or the height', () => {
        const value = 50;
        const radius: Vec2 = { x: 25, y: 25 };
        service.width = radius.x * 2;
        service.height = radius.y * 2;
        service.setTypeDrawing(DrawingType.FillAndStroke);
        service.setThickness(value);
        service.adjustThickness();
        expect(service.adjustThickness()).toEqual(radius.x);
    });

    it('adjustThickness should keep the thickness when its not in fill mode and is smaller than the width or the height', () => {
        const value = 10;
        const radius: Vec2 = { x: 25, y: 25 };
        service.width = radius.x * 2;
        service.height = radius.y * 2;
        service.setTypeDrawing(DrawingType.Stroke);
        service.setThickness(value);

        expect(service.adjustThickness()).toEqual(value);
    });

    it('should not draw on escape key press', () => {
        service.escapeDown = true;
        const spyFill = spyOn(baseCtxStub, 'fill');
        const spyStroke = spyOn(baseCtxStub, 'stroke');
        service.draw(baseCtxStub);
        expect(spyFill).not.toHaveBeenCalled();
        expect(spyStroke).not.toHaveBeenCalled();
    });

    it('clone should return a clone of the tool', () => {
        const spyCopyShape = spyOn(ShapeTool.prototype, 'copyShape');
        const clone = service.clone();
        expect(spyCopyShape).toHaveBeenCalled();
        expect(clone).toEqual(service);
    });
});
