import { TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { ResizeService } from '@app/services/resize/resize.service';

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

    it('resize should should call execute', (done) => {
        const executeSpy = spyOn(service, 'execute');
        const drawImageSpy = spyOn(service, 'drawImage');
        const emitSpy = spyOn(service.executedCommand, 'emit');
        const value = 10;
        service.resize(value, value);

        setTimeout(() => {
            expect(executeSpy).toHaveBeenCalled();
            expect(drawImageSpy).toHaveBeenCalled();
            expect(emitSpy).toHaveBeenCalled();
            done();
            // tslint:disable-next-line: no-magic-numbers / reason: waiting for image to load
        }, 200);
    });
});
