import { TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { SelectionType } from '@app/enums/selection-type.enum';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { MoveSelectionService } from './move-selection.service';

describe('MoveSelectionService', () => {
    let service: MoveSelectionService;
    let drawingServiceSpy: jasmine.SpyObj<DrawingService>;

    beforeEach(() => {
        drawingServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas', 'setThickness', 'setStrokeColor']);

        TestBed.configureTestingModule({ providers: [{ provide: DrawingService, useValue: drawingServiceSpy }] });
        service = TestBed.inject(MoveSelectionService);
        drawingServiceSpy = TestBed.inject(DrawingService) as jasmine.SpyObj<DrawingService>;
        drawingServiceSpy.canvas = canvasTestHelper.canvas;
        drawingServiceSpy.baseCtx = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        drawingServiceSpy.previewCtx = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;

        service.imgData = drawingServiceSpy.baseCtx.getImageData(0, 0, 1, 1);
    });

    it('pressing arrow should call moveSelection', () => {
        // tslint:disable-next-line:no-any / reason: spying on function
        const moveSelectionSpy = spyOn<any>(service, 'moveSelection').and.callThrough();
        // tslint:disable:no-string-literal / reason: accessing private member
        service.canMoveSelection = true;
        const keyboardEvent = new KeyboardEvent('keyDown', { key: 'ArrowLeft' });
        service['pressedKeys'] = [0, 0, 0, 0];
        service.checkArrowKeysPressed(keyboardEvent);
        expect(moveSelectionSpy).toHaveBeenCalled();
    });

    it('releasing arrow should set canMoveSelectionContiniously to true and should not change canMoveSelection if an arrow key is pressed', () => {
        service['canMoveSelectionContiniously'] = false;
        service.canMoveSelection = false;
        const keyboardEvent = new KeyboardEvent('keyDown', { key: 'ArrowLeft' });
        service['pressedKeys'] = [1, 1, 0, 0];
        service.checkArrowKeysReleased(keyboardEvent);
        expect(service['canMoveSelectionContiniously']).toBeTrue();
        expect(service.canMoveSelection).toBeFalse();
    });

    it('releasing arrow should set canMoveSelectionContiniously to false and canMoveSelection to true if no arrow key is pressed', () => {
        service['canMoveSelectionContiniously'] = true;
        service.canMoveSelection = false;
        const keyboardEvent = new KeyboardEvent('keyDown', { key: 'ArrowLeft' });
        service['pressedKeys'] = [1, 0, 0, 0];
        service.checkArrowKeysReleased(keyboardEvent);
        expect(service['canMoveSelectionContiniously']).toBeFalse();
        expect(service.canMoveSelection).toBeTrue();
    });

    it('moveSelection should change preview canvas offsets', () => {
        drawingServiceSpy.previewCtx.canvas.style.left = '0px';
        drawingServiceSpy.previewCtx.canvas.style.top = '0px';
        const expectedOffSets = 10;
        service.moveSelection(expectedOffSets, expectedOffSets);
        const elementOffsetLeft = drawingServiceSpy.previewCtx.canvas.style.left;
        const elementOffsetTop = drawingServiceSpy.previewCtx.canvas.style.top;

        expect(elementOffsetLeft).toEqual(-expectedOffSets + 'px');
        expect(elementOffsetTop).toEqual(-expectedOffSets + 'px');
    });

    it('copySelection should change preview canvas position and size', () => {
        // tslint:disable:no-magic-numbers / reason: using random values for test
        drawingServiceSpy.previewCtx.canvas.width = 0;
        drawingServiceSpy.previewCtx.canvas.height = 0;
        drawingServiceSpy.previewCtx.canvas.style.left = '0px';
        drawingServiceSpy.previewCtx.canvas.style.top = '0px';
        service.copySelection({ x: 20, y: 20 }, 20, 20, SelectionType.RectangleSelection);

        expect(drawingServiceSpy.previewCtx.canvas.width).toEqual(20);
        expect(drawingServiceSpy.previewCtx.canvas.height).toEqual(20);
        expect(drawingServiceSpy.previewCtx.canvas.style.left).toEqual('20px');
        expect(drawingServiceSpy.previewCtx.canvas.style.top).toEqual('20px');
    });

    it('copySelection should call isPositionInEllipse if selection is ellipse', () => {
        drawingServiceSpy.previewCtx.canvas.width = 0;
        drawingServiceSpy.previewCtx.canvas.height = 0;
        drawingServiceSpy.previewCtx.canvas.style.left = '0px';
        drawingServiceSpy.previewCtx.canvas.style.top = '0px';
        service.copySelection({ x: 20, y: 20 }, 20, 20, SelectionType.EllipseSelection);

        expect(drawingServiceSpy.previewCtx.canvas.width).toEqual(20);
        expect(drawingServiceSpy.previewCtx.canvas.height).toEqual(20);
        expect(drawingServiceSpy.previewCtx.canvas.style.left).toEqual('20px');
        expect(drawingServiceSpy.previewCtx.canvas.style.top).toEqual('20px');
    });

    it('isPositionInEllipse should return true ', () => {
        const returnedResult = service['isPositionInEllipse']({ x: 100, y: 50 }, 200, 100);
        expect(returnedResult).toBeTrue();
    });

    it('isPositionInEllipse should return false ', () => {
        const returnedResult = service['isPositionInEllipse']({ x: 0, y: 0 }, 200, 100);
        expect(returnedResult).toBeFalse();
    });
});
