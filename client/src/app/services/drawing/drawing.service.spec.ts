import { TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { TextAlignment } from '@app/enums/text-alignment.enum';
import { TextFont } from '@app/enums/text-font.enum';
import { DrawingService } from './drawing.service';

describe('DrawingService', () => {
    let service: DrawingService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(DrawingService);
        service.canvas = canvasTestHelper.canvas;
        service.baseCtx = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        service.previewCtx = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('emitCreateNewDrawingEvent should emit createNewDrawingSubject', () => {
        const createNewDrawingSubjectSpy = spyOn(service.createNewDrawingSubject, 'next').and.callThrough();
        service.emitCreateNewDrawingEvent();
        expect(createNewDrawingSubjectSpy).toHaveBeenCalled();
    });

    it('emitResetCanvasSizeEvent should emit resetCanvasSizeSubject', () => {
        const resetCanvasSizeEventSpy = spyOn(service.resetCanvasSizeSubject, 'next').and.callThrough();
        service.emitResetCanvasSizeEvent();
        expect(resetCanvasSizeEventSpy).toHaveBeenCalled();
    });

    it('createNewDrawingEventListener should return createNewDrawingSubject as an observable', () => {
        expect(service.createNewDrawingEventListener()).toEqual(service.createNewDrawingSubject.asObservable());
    });

    it('should clear the whole canvas', () => {
        service.clearCanvas(service.baseCtx);
        const pixelBuffer = new Uint32Array(service.baseCtx.getImageData(0, 0, service.canvas.width, service.canvas.height).data.buffer);
        const hasColoredPixels = pixelBuffer.some((color) => color !== 0);
        expect(hasColoredPixels).toEqual(false);
    });

    it('canvasEmpty should return true when the canvas is empty', () => {
        service.clearCanvas(service.baseCtx);
        const isEmpty = service.canvasEmpty(service.baseCtx);
        expect(isEmpty).toEqual(true);
    });

    it('canvasEmpty should return false when the canvas is not empty', () => {
        service.baseCtx.fillRect(0, 0, 1, 1);
        const isEmpty = service.canvasEmpty(service.baseCtx);
        expect(isEmpty).toEqual(false);
    });

    it('should set the lineWidth when setThickness is called', () => {
        const thickness = 1;
        service.setThickness(thickness);
        expect(service.previewCtx.lineWidth).toEqual(thickness);
        expect(service.baseCtx.lineWidth).toEqual(thickness);
        service.previewCtx.lineWidth = 1;
        service.baseCtx.lineWidth = 1;
    });

    it('should set the fillStyle when setFillColor is called', () => {
        const color = '#123456';
        service.setFillColor(color);
        expect(service.previewCtx.fillStyle).toEqual(color);
        expect(service.baseCtx.fillStyle).toEqual(color);
        service.previewCtx.fillStyle = '#000';
        service.baseCtx.fillStyle = '#000';
    });

    it('should set the fillStroke when setStrokeColor is called', () => {
        const color = '#123456';
        service.setStrokeColor(color);
        expect(service.previewCtx.strokeStyle).toEqual(color);
        expect(service.baseCtx.strokeStyle).toEqual(color);
        service.previewCtx.strokeStyle = '#000';
        service.baseCtx.strokeStyle = '#000';
    });

    it('should call setFillColor and setStrokeColor when setColor is called', () => {
        const color = '#123456';
        const spyFill = spyOn(service, 'setFillColor');
        const spyStroke = spyOn(service, 'setStrokeColor');
        service.setColor(color);
        expect(spyFill).toHaveBeenCalled();
        expect(spyFill).toHaveBeenCalledWith(color);
        expect(spyStroke).toHaveBeenCalled();
        expect(spyStroke).toHaveBeenCalledWith(color);
    });

    it('should set the font when setTextStyle is called', () => {
        const font = `10px ${TextFont.Arial}`;
        service.setTextStyle(font);
        expect(service.previewCtx.font).toEqual(font);
        expect(service.baseCtx.font).toEqual(font);
    });

    it('should set the alignment when setTextAlignment is called', () => {
        const alignment = TextAlignment.Middle;
        service.setTextAlignment(alignment);
        expect(service.previewCtx.textAlign).toEqual(alignment);
        expect(service.baseCtx.textAlign).toEqual(alignment);
    });
});
