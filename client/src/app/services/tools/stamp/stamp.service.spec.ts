import { TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { StampProperties } from '@app/classes/tools-properties/stamp-properties';
import { StampService } from './stamp.service';
// tslint:disable:no-string-literal
describe('StampService', () => {
    let service: StampService;
    // let keyboardEventShift: KeyboardEvent;
    let mouseEventclick: MouseEvent;
    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;

    beforeEach(() => {
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        TestBed.configureTestingModule({});
        service = TestBed.inject(StampService);
        // keyboardEventShift = new KeyboardEvent('keyDown', { key: 'Shift' });
        service['drawingService'].canvas = canvasTestHelper.canvas;
        service['drawingService'].baseCtx = baseCtxStub; // Jasmine doesnt copy properties with underlying data
        service['drawingService'].previewCtx = previewCtxStub;
        mouseEventclick = {
            offsetX: 25,
            offsetY: 25,
            button: 0,
        } as MouseEvent;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('OnClick should draw the sticker', () => {
        const drawSpy = spyOn<any>(service['drawingService'].baseCtx, 'drawImage');
        service.onClick(mouseEventclick);
        expect(drawSpy).toHaveBeenCalled();
    });

    it('OnMouseMove should draw a preview Image of the sticker', () => {
        const drawSpy = spyOn<any>(service['drawingService'].previewCtx, 'drawImage');
        service.onMouseMove(mouseEventclick);
        expect(drawSpy).toHaveBeenCalled();
    });

    it('onMouseScroll should redraw cursor', () => {
        const drawSpy = spyOn<any>(service['drawingService'].previewCtx, 'drawImage');
        const scrollEvent = {} as WheelEvent;
        service.onMouseScroll(scrollEvent);
        expect(drawSpy).toHaveBeenCalled();
    });

    it('onKeyDown should set altDown to true if alt was pressed', () => {
        service['altDown'] = false;
        const keyboardEvent = new KeyboardEvent('keyDown', { key: 'Alt' });
        service.onKeyDown(keyboardEvent);
        expect(service['altDown']).toBeTrue();
    });

    it('onKeyDown should not change altDown if alt was not pressed', () => {
        service['altDown'] = false;
        const keyboardEvent = new KeyboardEvent('keyDown', { key: '' });
        service.onKeyDown(keyboardEvent);
        expect(service['altDown']).toBeFalse();
    });

    it('onKeyUp should not change altDown if alt was not released', () => {
        service['altDown'] = false;
        const keyboardEvent = new KeyboardEvent('keyDown', { key: '' });
        service.onKeyUp(keyboardEvent);
        expect(service['altDown']).toBeFalse();
    });

    it('onKeyUp should set altDown to false if alt was released', () => {
        service['altDown'] = true;
        const keyboardEvent = new KeyboardEvent('keyDown', { key: 'Alt' });
        service.onKeyUp(keyboardEvent);
        expect(service['altDown']).toBeFalse();
    });

    it('updateImagePreviewURL should return the new modifie image', (done) => {
        service.updateImagePreviewURL();
        const firstImageSrc = service['imagePreview'].src;
        const properties = service.toolProperties as StampProperties;
        properties.angle = 90;
        service.updateImagePreviewURL();
        setTimeout(() => {
            expect(firstImageSrc).not.toEqual(service['imagePreview'].src);
            // tslint:disable-next-line: no-magic-numbers / reason: waiting for image to load
            done();
        }, 200);
    });
});
