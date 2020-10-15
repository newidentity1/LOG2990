import { TestBed } from '@angular/core/testing';
import { Color } from '@app/classes/color/color';
import { ShapeTool } from '@app/classes/tool/shape-tool';
import { BasicShapeProperties } from '@app/classes/tools-properties/basic-shape-properties';
import { Vec2 } from '@app/classes/vec2';
import { BLACK, WHITE } from '@app/constants/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';

// To instanciate a ShapeTool object
export class ShapeToolTest extends ShapeTool {}

// tslint:disable:no-any
describe('Class: ShapeTool', () => {
    let shapeTool: ShapeToolTest;
    let drawingServiceSpy: jasmine.SpyObj<DrawingService>;
    let firstColor: Color;
    let secondColor: Color;
    let mouseEvent: MouseEvent;
    let drawPreviewSpy: jasmine.Spy<any>;
    let computeDimensionsSpy: jasmine.Spy<any>;
    let drawShapeSpy: jasmine.Spy<any>;
    let transformToEqualSidesSpy: jasmine.Spy<any>;

    beforeEach(() => {
        drawingServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas', 'setColor', 'setFillColor', 'setStrokeColor']);

        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawingServiceSpy }],
        });
        drawingServiceSpy = TestBed.inject(DrawingService) as jasmine.SpyObj<DrawingService>;
        shapeTool = new ShapeToolTest(drawingServiceSpy);
        drawPreviewSpy = spyOn<any>(shapeTool, 'drawPreview').and.callThrough();
        computeDimensionsSpy = spyOn<any>(shapeTool, 'computeDimensions').and.callThrough();
        drawShapeSpy = spyOn<any>(shapeTool, 'drawShape').and.callThrough();
        transformToEqualSidesSpy = spyOn<any>(shapeTool, 'transformToEqualSides').and.callThrough();

        firstColor = new Color(WHITE);
        secondColor = new Color(BLACK);

        mouseEvent = {
            offsetX: 25,
            offsetY: 25,
            button: 0,
        } as MouseEvent;

        shapeTool.currentMousePosition = { x: mouseEvent.x, y: mouseEvent.y };
        shapeTool.mouseDownCoord = { x: mouseEvent.x, y: mouseEvent.y };
    });

    it('should be created', () => {
        expect(shapeTool).toBeTruthy();
    });

    it(' mouseDown should set mouseDownCoord to correct position', () => {
        const expectedResult: Vec2 = { x: 25, y: 25 };
        shapeTool.onMouseDown(mouseEvent);
        expect(shapeTool.mouseDownCoord).toEqual(expectedResult);
    });

    it(' mouseDown should set mouseDown property to true on left click', () => {
        shapeTool.onMouseDown(mouseEvent);
        expect(shapeTool.mouseDown).toBeTrue();
    });

    it(' mouseDown should set mouseDown property to false on right click', () => {
        const mouseEventRClick = {
            offsetX: 25,
            offsetY: 25,
            button: 1,
        } as MouseEvent;
        shapeTool.onMouseDown(mouseEventRClick);
        expect(shapeTool.mouseDown).toBeFalse();
    });

    it(' mouseMove should call drawPreview if mouse was already down', () => {
        shapeTool.mouseDown = true;
        shapeTool.onMouseMove(mouseEvent);
        // tslint:disable-next-line:no-string-literal / reason: accessing private member
        expect(drawPreviewSpy).toHaveBeenCalled();
    });

    it(' mouseMove should not call drawPreview if mouse was not already down', () => {
        shapeTool.mouseDown = false;
        shapeTool.onMouseMove(mouseEvent);
        expect(drawPreviewSpy).not.toHaveBeenCalled();
    });

    it(' onMouseUp should call computeDimensions and drawShape if mouse was already down', () => {
        shapeTool.mouseDown = true;
        shapeTool.onMouseUp();

        expect(shapeTool.mouseDown).toBeFalse();
        expect(computeDimensionsSpy).toHaveBeenCalled();
        expect(drawShapeSpy).toHaveBeenCalled();
    });

    it(' onMouseUp should call not computeDimensions and drawShape if mouse was not already down', () => {
        shapeTool.mouseDown = false;
        shapeTool.onMouseUp();

        expect(shapeTool.mouseDown).toBeFalse();
        expect(computeDimensionsSpy).not.toHaveBeenCalled();
        expect(drawShapeSpy).not.toHaveBeenCalled();
    });

    it(' onKeyDown should stop drawing if escape is down and if mouse was already down', () => {
        const keyboardEvent = new KeyboardEvent('keyDown', { key: 'Escape' });
        shapeTool.mouseDown = true;
        shapeTool.onKeyDown(keyboardEvent);

        expect(shapeTool.mouseDown).toBeFalse();
        expect(drawingServiceSpy.clearCanvas).toHaveBeenCalledWith(drawingServiceSpy.previewCtx);
    });

    it(' onKeyDown should not stop drawing if escape is not down and if mouse was already down', () => {
        shapeTool.mouseDown = true;
        const keyboardEvent = new KeyboardEvent('keyup', { code: 'ArrowUp' });
        shapeTool.onKeyDown(keyboardEvent);

        expect(shapeTool.mouseDown).toBeTrue();
        expect(drawPreviewSpy).toHaveBeenCalled();
    });

    it(' onKeyDown should set shiftDown to true if shift is down', () => {
        const keyboardEvent = new KeyboardEvent('keyDown', { key: 'Shift' });
        shapeTool.shiftDown = false;
        shapeTool.onKeyDown(keyboardEvent);
        expect(shapeTool.shiftDown).toBeTrue();
    });

    it(' onKeyDown should keep the old shiftDown value if shift is not down', () => {
        shapeTool.shiftDown = false;
        const keyboardEvent = new KeyboardEvent('keyup', { code: 'ArrowUp' });
        shapeTool.onKeyDown(keyboardEvent);
        expect(shapeTool.shiftDown).toBeFalse();
    });

    it(' onKeyUp should set shiftDown to false if shift is up', () => {
        shapeTool.shiftDown = true;
        const keyboardEvent = new KeyboardEvent('keyup', { key: 'Shift' });
        shapeTool.onKeyUp(keyboardEvent);
        expect(shapeTool.shiftDown).toBeFalse();
    });

    it(' onKeyUp should keep the old shiftDown value if shift is not up', () => {
        shapeTool.shiftDown = true;
        const keyboardEvent = new KeyboardEvent('keyup', { code: 'ArrowUp' });
        shapeTool.onKeyUp(keyboardEvent);
        expect(shapeTool.shiftDown).toBeTrue();
    });

    it('onKeyUp should call drawPreview if mouse was already down', () => {
        shapeTool.shiftDown = true;
        shapeTool.mouseDown = true;
        const keyboardEvent = new KeyboardEvent('keyup', { code: 'ArrowUp' });
        shapeTool.onKeyUp(keyboardEvent);
        expect(drawPreviewSpy).toHaveBeenCalled();
    });

    it(' onKeyUp should not call drawPreview if mouse was not already down', () => {
        shapeTool.shiftDown = true;
        shapeTool.mouseDown = false;
        const keyboardEvent = new KeyboardEvent('keyup', { code: 'ArrowUp' });
        shapeTool.onKeyUp(keyboardEvent);
        expect(drawPreviewSpy).not.toHaveBeenCalled();
    });

    it('setTypeDrawing should set the currentType of rectangleProperties', () => {
        const properties = shapeTool.toolProperties as BasicShapeProperties;
        const value = properties.typesDrawing[0];
        shapeTool.setTypeDrawing(value);
        expect(properties.currentType).toEqual(properties.typesDrawing[0]);
    });

    it('function setColors should call setFillColor with primaryColor and setStrokeColor with secondColor', () => {
        shapeTool.setColors(firstColor, secondColor);
        expect(drawingServiceSpy.setFillColor).toHaveBeenCalledWith(firstColor.toStringRGBA());
        expect(drawingServiceSpy.setStrokeColor).toHaveBeenCalledWith(secondColor.toStringRGBA());
    });

    it('drawPreview should call computeDimensions, drawShape, and should clear preview context', () => {
        // tslint:disable-next-line:no-string-literal / reason: accessing private member
        shapeTool['drawPreview']();
        expect(computeDimensionsSpy).toHaveBeenCalledWith();
        expect(drawingServiceSpy.clearCanvas).toHaveBeenCalledWith(drawingServiceSpy.previewCtx);
        expect(drawShapeSpy).toHaveBeenCalledWith(drawingServiceSpy.previewCtx);
    });

    it('computeDimensions should set the value of width and height correctly', () => {
        shapeTool.mouseDownCoord = { x: 200, y: 200 };
        shapeTool.currentMousePosition = { x: 300, y: 300 };
        const expectedResult: Vec2 = { x: 100, y: 100 };
        // tslint:disable-next-line:no-string-literal / reason: accessing private member
        shapeTool['computeDimensions']();
        expect(shapeTool.width).toEqual(expectedResult.x);
        expect(shapeTool.height).toEqual(expectedResult.y);
    });

    it('computeDimensions should call transformToEqualSides if shift is down', () => {
        shapeTool.shiftDown = true;
        // tslint:disable-next-line:no-string-literal / reason: accessing private member
        shapeTool['computeDimensions']();
        expect(transformToEqualSidesSpy).toHaveBeenCalled();
    });

    it('computeDimensions should call transformToEqualSides if shift is down', () => {
        shapeTool.shiftDown = false;
        // tslint:disable-next-line:no-string-literal / reason: accessing private member
        shapeTool['computeDimensions']();
        expect(transformToEqualSidesSpy).not.toHaveBeenCalled();
    });
    it(' transformToSquare should set a positive width and a positive height if the coords are on quadrant1', () => {
        // tslint:disable:no-magic-numbers / reason: using random values
        shapeTool.width = 150;
        shapeTool.height = 200;
        const expectedResult = 150;
        // tslint:disable-next-line:no-string-literal / reason: accessing private member
        shapeTool['transformToEqualSides']();
        expect(shapeTool.width).toEqual(expectedResult);
        expect(shapeTool.height).toEqual(expectedResult);
    });

    it(' transformToSquare should return the a negative width and a positive height if the coords are on quadrant2', () => {
        shapeTool.width = -150;
        shapeTool.height = 200;
        const expectedResult = 150;
        // tslint:disable-next-line:no-string-literal / reason: accessing private member
        shapeTool['transformToEqualSides']();
        expect(shapeTool.width).toEqual(-expectedResult);
        expect(shapeTool.height).toEqual(expectedResult);
    });

    it(' transformToSquare should return the a negative width and a negative height if the coords are on quadrant3', () => {
        shapeTool.width = -150;
        shapeTool.height = -200;
        const expectedResult = -150;
        // tslint:disable-next-line:no-string-literal / reason: accessing private member
        shapeTool['transformToEqualSides']();
        expect(shapeTool.width).toEqual(expectedResult);
        expect(shapeTool.height).toEqual(expectedResult);
    });

    it(' transformToSquare should return the a positive width and a negative height if the coords are on quadrant4', () => {
        shapeTool.width = 150;
        shapeTool.height = -200;
        const expectedResult = 150;
        // tslint:disable-next-line:no-string-literal / reason: accessing private member
        shapeTool['transformToEqualSides']();
        expect(shapeTool.width).toEqual(expectedResult);
        expect(shapeTool.height).toEqual(-expectedResult);
    });

    it(' transformToSquare should return the same input if they are equal', () => {
        const expectedResult = 150;
        shapeTool.width = expectedResult;
        shapeTool.height = expectedResult;
        // tslint:disable-next-line:no-string-literal / reason: accessing private member
        shapeTool['transformToEqualSides']();
        expect(shapeTool.width).toEqual(expectedResult);
        expect(shapeTool.height).toEqual(expectedResult);
    });

    it('resetContext should reset all the current changes that the tool made', () => {
        shapeTool.mouseDown = true;
        shapeTool.shiftDown = true;
        shapeTool.resetContext();
        expect(shapeTool.mouseDown).toEqual(false);
        expect(shapeTool.shiftDown).toEqual(false);
        expect(drawingServiceSpy.clearCanvas).toHaveBeenCalledWith(drawingServiceSpy.previewCtx);
    });
});
