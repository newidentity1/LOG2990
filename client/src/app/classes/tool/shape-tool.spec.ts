import { TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { Color } from '@app/classes/color/color';
import { ShapeTool } from '@app/classes/tool/shape-tool';
import { BasicShapeProperties } from '@app/classes/tools-properties/basic-shape-properties';
import { Vec2 } from '@app/classes/vec2';
import { BLACK, DASHED_SEGMENTS, WHITE } from '@app/constants/constants';
import { DrawingType } from '@app/enums/drawing-type.enum';
import { DrawingService } from '@app/services/drawing/drawing.service';

export class ShapeToolTest extends ShapeTool {
    // tslint:disable-next-line:no-empty / reason: mocking class for test
    draw(ctx: CanvasRenderingContext2D): void {}
}
// tslint:disable:no-any / reason: jasmine spy on private fonctions
describe('Class: ShapeTool', () => {
    let shapeTool: ShapeToolTest;
    let drawingServiceSpy: jasmine.SpyObj<DrawingService>;
    let firstColor: Color;
    let secondColor: Color;
    let mouseEvent: MouseEvent;
    let drawPreviewSpy: jasmine.Spy<any>;
    let computeDimensionsSpy: jasmine.Spy<any>;
    let drawSpy: jasmine.Spy<any>;
    let transformToEqualSidesSpy: jasmine.Spy<any>;
    let baseCtxStub: CanvasRenderingContext2D;

    beforeEach(() => {
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        drawingServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas', 'setColor', 'setFillColor', 'setStrokeColor', 'setThickness']);

        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawingServiceSpy }],
        });
        drawingServiceSpy = TestBed.inject(DrawingService) as jasmine.SpyObj<DrawingService>;

        shapeTool = new ShapeToolTest(drawingServiceSpy);
        drawPreviewSpy = spyOn<any>(shapeTool, 'drawPreview').and.callThrough();
        computeDimensionsSpy = spyOn<any>(shapeTool, 'computeDimensions').and.callThrough();
        drawSpy = spyOn<any>(shapeTool, 'draw').and.callThrough();
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
        expect(drawPreviewSpy).toHaveBeenCalled();
    });

    it(' mouseMove should not call drawPreview if mouse was not already down', () => {
        shapeTool.mouseDown = false;
        shapeTool.onMouseMove(mouseEvent);
        expect(drawPreviewSpy).not.toHaveBeenCalled();
    });

    it(' onMouseUp should not call draw if mouse was already down and position of mouse havent changed from initial', () => {
        shapeTool.mouseDown = true;
        shapeTool.onMouseDown(mouseEvent);
        shapeTool.onMouseUp(mouseEvent);

        expect(shapeTool.mouseDown).toBeFalse();
        expect(drawSpy).not.toHaveBeenCalled();
    });

    it(' onMouseUp should call drawif mouse was already down and position of mouse changed from initial', () => {
        shapeTool.mouseDown = true;
        const newMouseEvent = {
            offsetX: 30,
            offsetY: 30,
            button: 0,
        } as MouseEvent;
        shapeTool.currentMousePosition = { x: 30, y: 30 };
        shapeTool.onMouseUp(newMouseEvent);
        expect(shapeTool.mouseDown).toBeFalse();
        expect(drawSpy).toHaveBeenCalled();
    });

    it(' onMouseUp should call not computeDimensions and drawShape if mouse was not already down', () => {
        shapeTool.mouseDown = false;
        shapeTool.onMouseUp(mouseEvent);

        expect(shapeTool.mouseDown).toBeFalse();
        expect(computeDimensionsSpy).not.toHaveBeenCalled();
        expect(drawSpy).not.toHaveBeenCalled();
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
        drawingServiceSpy.canvas = canvasTestHelper.canvas;
        drawingServiceSpy.previewCtx = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        shapeTool.setColors(firstColor, secondColor);
        expect(drawingServiceSpy.setFillColor).toHaveBeenCalledWith(firstColor.toStringRGBA());
        expect(drawingServiceSpy.setStrokeColor).toHaveBeenCalledWith(secondColor.toStringRGBA());
    });

    it('drawPreview should call computeDimensions, drawShape, and should clear preview context', () => {
        // tslint:disable-next-line:no-string-literal / reason: accessing private member
        shapeTool['drawPreview']();
        expect(computeDimensionsSpy).toHaveBeenCalledWith();
        expect(drawingServiceSpy.clearCanvas).toHaveBeenCalledWith(drawingServiceSpy.previewCtx);
        expect(drawSpy).toHaveBeenCalledWith(drawingServiceSpy.previewCtx);
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

    it(' transformToEqualSides should set a positive width and a positive height if the coords are on quadrant1', () => {
        // tslint:disable:no-magic-numbers / reason: using random values
        shapeTool.width = 150;
        shapeTool.height = 200;
        const expectedResult = 150;
        // tslint:disable-next-line:no-string-literal / reason: accessing private member
        shapeTool['transformToEqualSides']();
        expect(shapeTool.width).toEqual(expectedResult);
        expect(shapeTool.height).toEqual(expectedResult);
    });

    it(' transformToEqualSides should return the a negative width and a positive height if the coords are on quadrant2', () => {
        shapeTool.width = -150;
        shapeTool.height = 200;
        const expectedResult = 150;
        // tslint:disable-next-line:no-string-literal / reason: accessing private member
        shapeTool['transformToEqualSides']();
        expect(shapeTool.width).toEqual(-expectedResult);
        expect(shapeTool.height).toEqual(expectedResult);
    });

    it(' transformToEqualSides should return the a negative width and a negative height if the coords are on quadrant3', () => {
        shapeTool.width = -150;
        shapeTool.height = -200;
        const expectedResult = -150;
        // tslint:disable-next-line:no-string-literal / reason: accessing private member
        shapeTool['transformToEqualSides']();
        expect(shapeTool.width).toEqual(expectedResult);
        expect(shapeTool.height).toEqual(expectedResult);
    });

    it(' transformToEqualSides should return the a positive width and a negative height if the coords are on quadrant4', () => {
        shapeTool.width = 150;
        shapeTool.height = -200;
        const expectedResult = 150;
        // tslint:disable-next-line:no-string-literal / reason: accessing private member
        shapeTool['transformToEqualSides']();
        expect(shapeTool.width).toEqual(expectedResult);
        expect(shapeTool.height).toEqual(-expectedResult);
    });

    it(' transformToEqualSides should return the same input if they are equal', () => {
        const expectedResult = 150;
        shapeTool.width = expectedResult;
        shapeTool.height = expectedResult;
        // tslint:disable-next-line:no-string-literal / reason: accessing private member
        shapeTool['transformToEqualSides']();
        expect(shapeTool.width).toEqual(expectedResult);
        expect(shapeTool.height).toEqual(expectedResult);
    });

    it('drawBoxGuide should call stroke and setLineDash if mouse was down', () => {
        shapeTool.mouseDown = true;
        const spyStroke = spyOn(baseCtxStub, 'stroke');
        const spyLineDash = spyOn(baseCtxStub, 'setLineDash');
        shapeTool.drawBoxGuide(baseCtxStub);
        expect(spyStroke).toHaveBeenCalled();
        expect(spyLineDash).toHaveBeenCalledWith([DASHED_SEGMENTS]);
    });

    it('drawBoxGuide should not call stroke and setLineDash if mouse was not down', () => {
        shapeTool.mouseDown = false;
        const spyStroke = spyOn(baseCtxStub, 'stroke');
        const spyLineDash = spyOn(baseCtxStub, 'setLineDash');
        shapeTool.drawBoxGuide(baseCtxStub);
        expect(spyStroke).not.toHaveBeenCalled();
        expect(spyLineDash).not.toHaveBeenCalled();
    });

    it('adjustThickness should shrink the thickness when its not in fill mode bigger than the width or the height', () => {
        const properties = shapeTool.toolProperties as BasicShapeProperties;
        properties.currentType = DrawingType.Stroke;
        const value = 50;
        shapeTool.width = 50;
        shapeTool.height = 50;
        shapeTool.setThickness(value);
        shapeTool.draw(baseCtxStub);

        expect(shapeTool.adjustThickness()).toEqual(value / 2);
    });

    it('adjustThickness should keep the thickness when its not in fill mode and is smaller than the width or the height', () => {
        const properties = shapeTool.toolProperties as BasicShapeProperties;
        properties.currentType = DrawingType.Stroke;
        const value = 10;
        shapeTool.width = 50;
        shapeTool.height = 50;
        shapeTool.setThickness(value);
        shapeTool.draw(baseCtxStub);

        expect(shapeTool.adjustThickness()).toEqual(value);
    });

    it('adjustThickness should set the thickness to 0 when its in fill mode', () => {
        const properties = shapeTool.toolProperties as BasicShapeProperties;
        properties.currentType = DrawingType.Fill;
        const value = 50;
        shapeTool.width = 50;
        shapeTool.height = 50;
        shapeTool.setThickness(value);

        expect(shapeTool.adjustThickness()).toEqual(0);
    });

    it('copyShape should copy all attributes needed to draw shapes', () => {
        // tslint:disable-next-line:no-string-literal / reason: accessing private member
        const shapeToolCopy: ShapeTool = new ShapeToolTest(shapeTool['drawingService']);
        shapeTool.copyShape(shapeToolCopy);
        const shapeProperties = shapeTool.toolProperties as BasicShapeProperties;
        const shapeCopyProperties = shapeToolCopy.toolProperties as BasicShapeProperties;
        expect(shapeProperties.currentType).toEqual(shapeCopyProperties.currentType);
        expect(shapeTool.mouseDownCoord).toEqual(shapeToolCopy.mouseDownCoord);
        expect(shapeTool.toolProperties.thickness).toEqual(shapeToolCopy.toolProperties.thickness);
        expect(shapeTool.currentPrimaryColor).toEqual(shapeToolCopy.currentPrimaryColor);
        expect(shapeTool.currentSecondaryColor).toEqual(shapeToolCopy.currentSecondaryColor);
        expect(shapeTool.pathData).toEqual(shapeToolCopy.pathData);
        expect(shapeTool.width).toEqual(shapeToolCopy.width);
        expect(shapeTool.height).toEqual(shapeToolCopy.height);
        expect(shapeTool.mouseDownCoord).toEqual(shapeToolCopy.mouseDownCoord);
        expect(shapeTool.currentMousePosition).toEqual(shapeToolCopy.currentMousePosition);
    });

    it('resetContext should reset all the current changes that the tool made', () => {
        shapeTool.mouseDown = true;
        shapeTool.shiftDown = true;
        shapeTool.escapeDown = true;
        const spyApplyCurrentSettings = spyOn(shapeTool, 'applyCurrentSettings');
        shapeTool.resetContext();
        expect(shapeTool.mouseDown).toEqual(false);
        expect(shapeTool.shiftDown).toEqual(false);
        expect(shapeTool.escapeDown).toEqual(false);
        expect(spyApplyCurrentSettings).toHaveBeenCalled();
    });
    // tslint:disable-next-line: max-file-line-count / reason: its a test file
});
