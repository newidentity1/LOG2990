import { TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
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

    it('onKeyUp should set altDown to false if alt was released', () => {
        service['altDown'] = true;
        const keyboardEvent = new KeyboardEvent('keyDown', { key: 'Alt' });
        service.onKeyUp(keyboardEvent);
        expect(service['altDown']).toBeFalse();
    });
});
