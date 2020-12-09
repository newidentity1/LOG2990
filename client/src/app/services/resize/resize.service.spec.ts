import { TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { ResizeService } from '@app/services/resize/resize.service';

// tslint:disable:no-string-literal / reason : access private members
describe('ResizeService', () => {
    let service: ResizeService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ResizeService);
        service['drawingService'].canvas = canvasTestHelper.canvas;
        service['drawingService'].baseCtx = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        service['drawingService'].previewCtx = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('resizeFromImage should resize from image size', () => {
        const executeSpy = spyOn(service, 'execute');
        const drawImageSpy = spyOn(service, 'drawImage');
        const emitSpy = spyOn(service.executedCommand, 'emit');

        const value = 10;
        const image = new Image(value, value);
        service.resizeFromImage(image);

        expect(executeSpy).toHaveBeenCalled();
        expect(drawImageSpy).toHaveBeenCalled();
        expect(emitSpy).toHaveBeenCalled();
        expect(service['newWidth']).toEqual(value);
        expect(service['newHeight']).toEqual(value);
    });

    it('resize should should resize to the correct values', (done) => {
        const executeSpy = spyOn(service, 'execute');
        const drawImageSpy = spyOn(service, 'drawImage');
        const emitSpy = spyOn(service.executedCommand, 'emit');
        const value = 10;
        service.resize(value, value);

        setTimeout(() => {
            expect(executeSpy).toHaveBeenCalled();
            expect(drawImageSpy).toHaveBeenCalled();
            expect(emitSpy).toHaveBeenCalled();
            expect(service['newWidth']).toEqual(value);
            expect(service['newHeight']).toEqual(value);
            done();
            // tslint:disable-next-line: no-magic-numbers / reason: waiting for image to load
        }, 200);
    });

    it('execute should resize baseCtx and previewCtx', () => {
        const value = 10;
        service['newWidth'] = value;
        service['newHeight'] = value;
        service.execute();

        expect(service['drawingService'].baseCtx.canvas.width).toEqual(value);
        expect(service['drawingService'].baseCtx.canvas.height).toEqual(value);
        expect(service['drawingService'].previewCtx.canvas.width).toEqual(value);
        expect(service['drawingService'].previewCtx.canvas.height).toEqual(value);
        expect(service.canvasSize.x).toEqual(value);
        expect(service.canvasSize.y).toEqual(value);
    });

    it('copyShape should copy all attributes needed to draw shapes', () => {
        service['img'].src = '';
        const resizeCopy = service.clone();
        expect(resizeCopy['newWidth']).toEqual(service['newWidth']);
        expect(resizeCopy['newHeight']).toEqual(service['newHeight']);
        expect(resizeCopy['canvasSize']).toEqual(service['canvasSize']);
        expect(resizeCopy['img'].src).toEqual(service['img'].src);
        expect(resizeCopy['img'].crossOrigin).toEqual(service['img'].crossOrigin);
    });
});
