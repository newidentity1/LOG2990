import { TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import * as CONSTANTS from '@app/constants/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { GridService } from './grid.service';
// tslint:disable:no-string-literal // use private variable for the test
describe('GridService', () => {
    let service: GridService;
    let keyboardEventPlus: KeyboardEvent;
    let keyboardEventMinus: KeyboardEvent;
    let keyboardEvent5: KeyboardEvent;
    let keyboardEventG: KeyboardEvent;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    // let gridCtxStub: CanvasRenderingContext2D;
    // tslint:disable:no-any // use only for testing
    beforeEach(() => {
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        // gridCtxStub = canvasTestHelper.gridCanvas.getContext('2d') as CanvasRenderingContext2D;
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas', 'setColor', 'setThickness', 'getContext', 'beginPath']);
        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawServiceSpy }],
        });
        service = TestBed.inject(GridService);

        service['drawingService'].canvas = canvasTestHelper.canvas;
        service['drawingService'].baseCtx = baseCtxStub; // Jasmine doesnt copy properties with underlying data
        service['drawingService'].previewCtx = previewCtxStub;
        service['drawingService'].gridCtx = service['drawingService'].previewCtx;

        keyboardEventPlus = new KeyboardEvent('keyUp', { key: '=' });
        keyboardEventMinus = new KeyboardEvent('keyUp', { key: '-' });
        keyboardEvent5 = new KeyboardEvent('keyUp', { key: '5' });
        keyboardEventG = new KeyboardEvent('keyUp', { code: 'KeyG' });
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('getGridSize should return the size of a sqare of the grid', () => {
        service['size'] = 1;
        expect(service.getGridSize()).toEqual(1);
    });

    it('onKeyUp set +5 or -5 to the gridSize', () => {
        service.onKeyUp(keyboardEventPlus);
        expect(service.getGridSize()).toEqual(CONSTANTS.GRID_BEGIN_SIZE + CONSTANTS.GRID_MULTIPLE_OPACITY_AND_SIZE);

        service.onKeyUp(keyboardEventMinus);
        expect(service.getGridSize()).toEqual(CONSTANTS.GRID_BEGIN_SIZE);
        const generateGridSpy = spyOn<any>(service, 'draw').and.callThrough();
        service.onKeyUp(keyboardEventG);
        expect(generateGridSpy).toHaveBeenCalled();

        service.onKeyUp(keyboardEvent5);
    });

    it('draw should active/unactive the grid', () => {
        service.draw();
        expect(service.isGrid).toEqual(false);
    });

    it('setGridSize should set the grid size', () => {
        service.setGridSize(null);
        expect(service.getGridSize()).toEqual(0);
        service.setGridSize(CONSTANTS.GRID_BEGIN_SIZE * 2);
        expect(service.getGridSize()).toEqual(CONSTANTS.GRID_BEGIN_SIZE * 2);
    });

    it('setOpacity should set the grid opacity', () => {
        const generateGridSpy = spyOn<any>(service, 'generateGrid').and.callThrough();
        service.setCanvasOpacity(null);
        service.setCanvasOpacity(CONSTANTS.GRID_MULTIPLE_OPACITY_AND_SIZE * CONSTANTS.GRID_MULTIPLE_OPACITY_AND_SIZE);
        expect(generateGridSpy).toHaveBeenCalled();
    });

    it('resetContext should reset the grid', () => {
        const generateGridSpy = spyOn<any>(service, 'generateGrid').and.callThrough();
        service.resetContext();
        expect(generateGridSpy).toHaveBeenCalled();

        service['firstUse'] = false;
        service.resetContext();
        expect(generateGridSpy).toHaveBeenCalled();
        expect(service['firstUse']).toBeFalse();
    });
});
