import { TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { TextActionKeysService } from './text-action-keys.service';

describe('TextActionKeysService', () => {
    let service: TextActionKeysService;
    let drawingServiceSpy: jasmine.SpyObj<DrawingService>;
    beforeEach(() => {
        drawingServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas', 'setColor', 'setFillColor', 'setStrokeColor', 'setThickness']);

        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawingServiceSpy }],
        });
        drawingServiceSpy = TestBed.inject(DrawingService) as jasmine.SpyObj<DrawingService>;
        service = TestBed.inject(TextActionKeysService);
        drawingServiceSpy.canvas = canvasTestHelper.canvas;
        drawingServiceSpy.baseCtx = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        drawingServiceSpy.previewCtx = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('onBackSpace should remove the word at index cursorColumn-1 if index isnt 0', () => {
        const cursorColumnIndex = 2;
        const cursorRowIndex = 0;
        const currentTexts = ['test'];
        const result = service.onBackspace(cursorColumnIndex, cursorRowIndex, currentTexts);
        expect(result[0]).toEqual(1);
        expect(result[1]).toEqual(0);
        expect(result[2]).toEqual(['tst']);
    });

    it('onBackSpace should remove the row and shift all text of below rows by 1 row ', () => {
        const cursorColumnIndex = 0;
        const cursorRowIndex = 1;
        const textRow0 = 'test1';
        const currentTexts = [textRow0, 'test2'];
        const result = service.onBackspace(cursorColumnIndex, cursorRowIndex, currentTexts);
        expect(result[0]).toEqual(textRow0.length);
        expect(result[1]).toEqual(0);
        expect(result[2]).toEqual(['test1test2']);
    });

    it('onBackSpace should remove the row ', () => {
        const cursorColumnIndex = 0;
        const cursorRowIndex = 1;
        const textRow0 = 'test1';
        const currentTexts = [textRow0, ''];
        const result = service.onBackspace(cursorColumnIndex, cursorRowIndex, currentTexts);
        expect(result[0]).toEqual(textRow0.length);
        expect(result[1]).toEqual(0);
        expect(result[2]).toEqual(['test1']);
    });

    it('onBackSpace should do nothing when index are both 0 ', () => {
        const cursorColumnIndex = 0;
        const cursorRowIndex = 0;
        const textRow0 = 'test1';
        const currentTexts = [textRow0, ''];
        const result = service.onBackspace(cursorColumnIndex, cursorRowIndex, currentTexts);
        expect(result[0]).toEqual(0);
        expect(result[1]).toEqual(0);
        expect(result[2]).toEqual([textRow0, '']);
    });

    it('onDelete should remove the word at index cursorColumn if index isnt the last of the current line', () => {
        const cursorColumnIndex = 0;
        const cursorRowIndex = 0;
        const currentTexts = ['test'];
        const result = service.onDelete(cursorColumnIndex, cursorRowIndex, currentTexts);
        expect(result[0]).toEqual(0);
        expect(result[1]).toEqual(0);
        expect(result[2]).toEqual(['est']);
    });

    it('onDelete should remove the row and shift all text of below rows by 1 row ', () => {
        const cursorRowIndex = 0;
        const textRow0 = 'test1';
        const currentTexts = [textRow0, 'test2'];
        const cursorColumnIndex = textRow0.length;
        const result = service.onDelete(cursorColumnIndex, cursorRowIndex, currentTexts);
        expect(result[0]).toEqual(textRow0.length);
        expect(result[1]).toEqual(0);
        expect(result[2]).toEqual(['test1test2']);
    });

    it('onDelete should remove the row', () => {
        const cursorRowIndex = 0;
        const textRow0 = 'test1';
        const currentTexts = [textRow0, ''];
        const cursorColumnIndex = textRow0.length;
        const result = service.onDelete(cursorColumnIndex, cursorRowIndex, currentTexts);
        expect(result[0]).toEqual(textRow0.length);
        expect(result[1]).toEqual(0);
        expect(result[2]).toEqual(['test1']);
    });

    it('onDelete should do nothing when the index is the last row and the last column', () => {
        const textRow0 = 'test1';
        const currentTexts = [textRow0, 't'];
        const cursorRowIndex = currentTexts.length - 1;
        const cursorColumnIndex = 1;
        const result = service.onDelete(cursorColumnIndex, cursorRowIndex, currentTexts);
        expect(result[0]).toEqual(1);
        expect(result[1]).toEqual(1);
        expect(result[2]).toEqual([textRow0, 't']);
    });

    it('onArrowLeft should move the cursor to previous line if its at index 0 of a row other than 0', () => {
        const cursorRowIndex = 1;
        const textRow0 = 'test1';
        const currentTexts = [textRow0, 'test2'];
        const cursorColumnIndex = 0;
        const result = service.onArrowLeft(cursorColumnIndex, cursorRowIndex, currentTexts);
        expect(result[0]).toEqual(textRow0.length);
        expect(result[1]).toEqual(0);
        expect(result[2]).toEqual([textRow0, 'test2']);
    });

    it('onArrowLeft should move the cursor to 1 index to the left if index of column isnt 0', () => {
        const cursorRowIndex = 1;
        const textRow0 = 'test1';
        const currentTexts = [textRow0, 'test2'];
        const cursorColumnIndex = 1;
        const result = service.onArrowLeft(cursorColumnIndex, cursorRowIndex, currentTexts);
        expect(result[0]).toEqual(0);
        expect(result[1]).toEqual(1);
        expect(result[2]).toEqual([textRow0, 'test2']);
    });

    it('onArrowLeft should do nothing if the index are both 0', () => {
        const cursorRowIndex = 0;
        const textRow0 = 'test1';
        const currentTexts = [textRow0, 'test2'];
        const cursorColumnIndex = 0;
        const result = service.onArrowLeft(cursorColumnIndex, cursorRowIndex, currentTexts);
        expect(result[0]).toEqual(0);
        expect(result[1]).toEqual(0);
        expect(result[2]).toEqual([textRow0, 'test2']);
    });

    it('onArrowRight should move the cursor to next line if its at index the length of the current row and of a row other than the last', () => {
        const cursorRowIndex = 0;
        const textRow0 = 'test1';
        const currentTexts = [textRow0, 'test2'];
        const cursorColumnIndex = textRow0.length;
        const result = service.onArrowRight(cursorColumnIndex, cursorRowIndex, currentTexts);
        expect(result[0]).toEqual(0);
        expect(result[1]).toEqual(1);
        expect(result[2]).toEqual([textRow0, 'test2']);
    });

    it('onArrowRight should move the cursor to 1 index to the right if index of column isnt the length of the text current row', () => {
        const cursorRowIndex = 1;
        const textRow0 = 'test1';
        const currentTexts = [textRow0, 'test2'];
        const cursorColumnIndex = 1;
        const result = service.onArrowRight(cursorColumnIndex, cursorRowIndex, currentTexts);
        expect(result[0]).toEqual(2);
        expect(result[1]).toEqual(1);
        expect(result[2]).toEqual([textRow0, 'test2']);
    });

    it('onArrowRight do nothing when index are last row and last column', () => {
        const cursorRowIndex = 1;
        const textRow0 = 'test1';
        const currentTexts = [textRow0, 't'];
        const cursorColumnIndex = 1;
        const result = service.onArrowRight(cursorColumnIndex, cursorRowIndex, currentTexts);
        expect(result[0]).toEqual(1);
        expect(result[1]).toEqual(1);
        expect(result[2]).toEqual([textRow0, 't']);
    });

    it('onArrowUp should move the cursor to previous row if row isnt the first one', () => {
        const cursorRowIndex = 1;
        const textRow0 = 'test1';
        const currentTexts = [textRow0, 'test2'];
        const cursorColumnIndex = 2;
        const result = service.onArrowUp(cursorColumnIndex, cursorRowIndex, currentTexts);
        expect(result[0]).toEqual(2);
        expect(result[1]).toEqual(0);
        expect(result[2]).toEqual([textRow0, 'test2']);
    });

    it('onArrowUp should do nothing when row index is 0', () => {
        const cursorRowIndex = 0;
        const textRow0 = 'test1';
        const currentTexts = [textRow0, 'test2'];
        const cursorColumnIndex = 2;
        const result = service.onArrowUp(cursorColumnIndex, cursorRowIndex, currentTexts);
        expect(result[0]).toEqual(2);
        expect(result[1]).toEqual(0);
        expect(result[2]).toEqual([textRow0, 'test2']);
    });

    it('onArrowDown should move the cursor to next row if row isnt the last one', () => {
        const cursorRowIndex = 0;
        const textRow0 = 'test1';
        const currentTexts = [textRow0, 'test2'];
        const cursorColumnIndex = 2;
        const result = service.onArrowDown(cursorColumnIndex, cursorRowIndex, currentTexts);
        expect(result[0]).toEqual(2);
        expect(result[1]).toEqual(1);
        expect(result[2]).toEqual([textRow0, 'test2']);
    });

    it('onArrowDown do nothing when row index is the last row', () => {
        const textRow0 = 'test1';
        const currentTexts = [textRow0, 'test2'];
        const cursorRowIndex = currentTexts.length - 1;
        const cursorColumnIndex = 2;
        const result = service.onArrowDown(cursorColumnIndex, cursorRowIndex, currentTexts);
        expect(result[0]).toEqual(2);
        expect(result[1]).toEqual(1);
        expect(result[2]).toEqual([textRow0, 'test2']);
    });

    it('calculateColumnIndex should calculate the right column index based on the text width', () => {
        const cursorRowIndex = 1;
        const textRow0 = 'test1';
        const currentTexts = [textRow0, 'test2'];
        const cursorColumnIndex = 2;
        const result = service.calculateColumnIndex(true, cursorColumnIndex, cursorRowIndex, currentTexts);
        expect(result).toEqual(2);
    });

    it('calculateColumnIndex should calculate the right column index based on the text width', () => {
        const cursorRowIndex = 0;
        const textRow0 = '.....';
        const currentTexts = [textRow0, 'test2'];
        const cursorColumnIndex = 3;
        const result = service.calculateColumnIndex(false, cursorColumnIndex, cursorRowIndex, currentTexts);
        expect(result).toEqual(2);
    });

    it('calculateColumnIndex should return 0 if the column index is 0', () => {
        const cursorRowIndex = 1;
        const textRow0 = '';
        const currentTexts = [textRow0, 'test2'];
        const cursorColumnIndex = 0;
        const result = service.calculateColumnIndex(true, cursorColumnIndex, cursorRowIndex, currentTexts);
        expect(result).toEqual(0);
    });

    it('onEnter should create a new line and put text right of the cursor in the new line', () => {
        const cursorRowIndex = 0;
        const textRow0 = 'test1';
        const currentTexts = [textRow0];
        const cursorColumnIndex = 3;
        const result = service.onEnter(cursorColumnIndex, cursorRowIndex, currentTexts);
        expect(result[0]).toEqual(0);
        expect(result[1]).toEqual(1);
        expect(result[2]).toEqual(['tes', 't1']);
    });

    it('onEnter should create a new line', () => {
        const cursorRowIndex = 0;
        const textRow0 = 'test1';
        const currentTexts = [textRow0];
        const cursorColumnIndex = textRow0.length;
        const result = service.onEnter(cursorColumnIndex, cursorRowIndex, currentTexts);
        expect(result[0]).toEqual(0);
        expect(result[1]).toEqual(1);
        expect(result[2]).toEqual([textRow0, '']);
    });
});
