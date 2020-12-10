import { TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { SELECTION_MOVE_DELAY, SELECTION_MOVE_START_DELAY, SELECTION_MOVE_STEP } from '@app/constants/constants';
import { SelectionArrowIndex } from '@app/enums/selection-arrow-index.enum';
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
        const canvas = document.createElement('canvas');
        drawingServiceSpy.canvas = canvas;
        drawingServiceSpy.baseCtx = canvas.getContext('2d') as CanvasRenderingContext2D;
        drawingServiceSpy.previewCtx = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;

        service.imgData = drawingServiceSpy.baseCtx.getImageData(0, 0, 1, 1);
    });

    it('pressing arrow should call moveSelection if canMoveSelection is true', () => {
        // tslint:disable-next-line:no-any / reason: spying on function
        const moveSelectionSpy = spyOn<any>(service, 'moveSelection').and.callThrough();
        // tslint:disable:no-string-literal / reason: accessing private member
        service.canMoveSelection = true;
        const keyboardEvent = new KeyboardEvent('keyDown', { key: 'ArrowLeft' });
        service['pressedKeys'] = [0, 0, 0, 0];
        service.checkArrowKeysPressed(keyboardEvent);
        expect(moveSelectionSpy).toHaveBeenCalled();
    });

    it('pressing arrow should call moveSelection if canMoveSelection is false', () => {
        // tslint:disable-next-line:no-any / reason: spying on function
        const moveSelectionSpy = spyOn<any>(service, 'moveSelection').and.callThrough();
        service.canMoveSelection = false;
        const keyboardEvent = new KeyboardEvent('keyDown', { key: 'ArrowLeft' });
        service['pressedKeys'] = [0, 0, 0, 0];
        service.checkArrowKeysPressed(keyboardEvent);
        expect(moveSelectionSpy).not.toHaveBeenCalled();
    });

    it('pressing non arrow key should not change pressedKeys arrays', () => {
        service.canMoveSelection = true;
        const keyboardEvent = new KeyboardEvent('keyDown', { key: 'a' });
        service['pressedKeys'] = [0, 0, 0, 0];
        service.checkArrowKeysPressed(keyboardEvent);
        expect(service['pressedKeys']).toEqual([0, 0, 0, 0]);
    });

    it('pressing left arrow should change pressedKeys arrays at left arrow index', () => {
        service.canMoveSelection = true;
        service['pressedKeys'][SelectionArrowIndex.Left] = 0;
        const keyboardEvent = new KeyboardEvent('keyDown', { key: 'ArrowLeft' });
        service.checkArrowKeysPressed(keyboardEvent);
        expect(service['pressedKeys'][SelectionArrowIndex.Left]).toEqual(SELECTION_MOVE_STEP);
    });

    it('pressing up arrow should change pressedKeys arrays at up arrow index', () => {
        service.canMoveSelection = true;
        const keyboardEvent = new KeyboardEvent('keyDown', { key: 'ArrowUp' });
        service['pressedKeys'][SelectionArrowIndex.Up] = 0;
        service.checkArrowKeysPressed(keyboardEvent);
        expect(service['pressedKeys'][SelectionArrowIndex.Up]).toEqual(SELECTION_MOVE_STEP);
    });

    it('pressing right arrow should change pressedKeys arrays at right arrow index', () => {
        service.canMoveSelection = true;
        const keyboardEvent = new KeyboardEvent('keyDown', { key: 'ArrowRight' });
        service['pressedKeys'][SelectionArrowIndex.Right] = 0;
        service.checkArrowKeysPressed(keyboardEvent);
        expect(service['pressedKeys'][SelectionArrowIndex.Right]).toEqual(-SELECTION_MOVE_STEP);
    });

    it('pressing down arrow should change pressedKeys arrays at down arrow index', () => {
        service.canMoveSelection = true;
        const keyboardEvent = new KeyboardEvent('keyDown', { key: 'ArrowDown' });
        service['pressedKeys'][SelectionArrowIndex.Down] = 0;
        service.checkArrowKeysPressed(keyboardEvent);
        expect(service['pressedKeys'][SelectionArrowIndex.Down]).toEqual(-SELECTION_MOVE_STEP);
    });

    it('holding an arrow key for more than 100ms should set canMoveSelection to true if canMoveSelectionContiniously is true', () => {
        const keyboardEvent = new KeyboardEvent('keyDown', { key: 'ArrowLeft' });
        service.canMoveSelection = true;
        service['canMoveSelectionContiniously'] = true;
        jasmine.clock().install();
        service.checkArrowKeysPressed(keyboardEvent);
        jasmine.clock().tick(SELECTION_MOVE_DELAY);
        expect(service.canMoveSelection).toBeTrue();
        jasmine.clock().uninstall();
    });

    it('holding an arrow key for more than 500ms should set canMoveSelection to true if canMoveSelectionContiniously is false', () => {
        const keyboardEvent = new KeyboardEvent('keyDown', { key: 'ArrowLeft' });
        service.canMoveSelection = true;
        service['canMoveSelectionContiniously'] = false;
        jasmine.clock().install();
        service.checkArrowKeysPressed(keyboardEvent);
        jasmine.clock().tick(SELECTION_MOVE_START_DELAY);
        expect(service.canMoveSelection).toBeTrue();
        expect(service['canMoveSelectionContiniously']).toBeTrue();
        jasmine.clock().uninstall();
    });

    it('releasing non arrow key should not change pressedKeys arrays', () => {
        service.canMoveSelection = true;
        const keyboardEvent = new KeyboardEvent('keyDown', { key: 'a' });
        const expectedArray = [SELECTION_MOVE_STEP, SELECTION_MOVE_STEP, -SELECTION_MOVE_STEP, -SELECTION_MOVE_STEP];
        service['pressedKeys'] = expectedArray;
        service.checkArrowKeysReleased(keyboardEvent);
        expect(service['pressedKeys']).toEqual(expectedArray);
    });

    it('releasing left arrow should change pressedKeys arrays at left arrow index', () => {
        service.canMoveSelection = true;
        const keyboardEvent = new KeyboardEvent('keyDown', { key: 'ArrowLeft' });
        service['pressedKeys'][SelectionArrowIndex.Left] = SELECTION_MOVE_STEP;
        service.checkArrowKeysReleased(keyboardEvent);
        expect(service['pressedKeys'][SelectionArrowIndex.Left]).toEqual(0);
    });

    it('releasing up arrow should change pressedKeys arrays at up arrow index', () => {
        service.canMoveSelection = true;
        const keyboardEvent = new KeyboardEvent('keyDown', { key: 'ArrowUp' });
        service['pressedKeys'][SelectionArrowIndex.Up] = SELECTION_MOVE_STEP;
        service.checkArrowKeysReleased(keyboardEvent);
        expect(service['pressedKeys'][SelectionArrowIndex.Up]).toEqual(0);
    });

    it('releasing right arrow should change pressedKeys arrays at right arrow index', () => {
        service.canMoveSelection = true;
        const keyboardEvent = new KeyboardEvent('keyDown', { key: 'ArrowRight' });
        service['pressedKeys'][SelectionArrowIndex.Right] = -SELECTION_MOVE_STEP;
        service.checkArrowKeysReleased(keyboardEvent);
        expect(service['pressedKeys'][SelectionArrowIndex.Right]).toEqual(0);
    });

    it('releasing down arrow should change pressedKeys arrays at down arrow index', () => {
        service.canMoveSelection = true;
        const keyboardEvent = new KeyboardEvent('keyDown', { key: 'ArrowDown' });
        service['pressedKeys'][SelectionArrowIndex.Down] = -SELECTION_MOVE_STEP;
        service.checkArrowKeysReleased(keyboardEvent);
        expect(service['pressedKeys'][SelectionArrowIndex.Down]).toEqual(0);
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

    it('moveSelectionMagnetic should use a magnetic position', () => {
        drawingServiceSpy.previewCtx.canvas.width = 0;
        drawingServiceSpy.previewCtx.canvas.height = 0;
        drawingServiceSpy.previewCtx.canvas.style.left = '0px';
        drawingServiceSpy.previewCtx.canvas.style.top = '0px';
        service.moveSelectionMagnetic(25, 25);
        expect(service.finalPosition.x).toEqual(25);
        expect(service.finalPosition.y).toEqual(25);
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

    it('copySelection should not change image data if image data does not contain transparent pixels', () => {
        drawingServiceSpy.baseCtx.fillStyle = 'black';
        drawingServiceSpy.baseCtx.fillRect(0, 0, drawingServiceSpy.canvas.width, drawingServiceSpy.canvas.height);
        const expectedImageData = drawingServiceSpy.baseCtx.getImageData(0, 0, drawingServiceSpy.canvas.width, drawingServiceSpy.canvas.height);
        service.copySelection({ x: 0, y: 0 }, drawingServiceSpy.canvas.width, drawingServiceSpy.canvas.height, SelectionType.RectangleSelection);
        const imageData = drawingServiceSpy.previewCtx.getImageData(0, 0, drawingServiceSpy.canvas.width, drawingServiceSpy.canvas.height);
        expect(imageData).toEqual(expectedImageData);
    });

    it('setFinalPosition should change final position ', () => {
        service.finalPosition = { x: 0, y: 0 };
        const position = { x: 100, y: 100 };
        service.setFinalPosition(position);
        expect(service.finalPosition).toEqual(position);
    });

    it('isPositionInEllipse should return true ', () => {
        const returnedResult = service['isPositionInEllipse']({ x: 100, y: 50 }, 200, 100);
        expect(returnedResult).toBeTrue();
    });

    it('isPositionInEllipse should return false ', () => {
        const returnedResult = service['isPositionInEllipse']({ x: 0, y: 0 }, 200, 100);
        expect(returnedResult).toBeFalse();
    });

    it('redraw should call putImageData', () => {
        spyOn(drawingServiceSpy.previewCtx, 'putImageData');
        service.finalPosition = { x: -10, y: -10 };
        service['redraw']();
        expect(drawingServiceSpy.previewCtx.putImageData).toHaveBeenCalled();
    });
});
