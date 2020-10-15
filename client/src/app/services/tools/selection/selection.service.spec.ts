import { TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { BasicShapeProperties } from '@app/classes/tools-properties/basic-shape-properties';
import { DrawingType } from '@app/enums/drawing-type.enum';
import { MouseButton } from '@app/enums/mouse-button.enum';
import { SelectionType } from '@app/enums/selection-type.enum';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { EllipseService } from '@app/services/tools/ellipse/ellipse.service';
import { RectangleService } from '@app/services/tools/rectangle/rectangle.service';
import { SelectionService } from './selection.service';

describe('SelectionService', () => {
    let service: SelectionService;
    let drawingServiceSpy: jasmine.SpyObj<DrawingService>;
    let rectangleServiceSpy: jasmine.SpyObj<RectangleService>;
    let ellipseServiceSpy: jasmine.SpyObj<EllipseService>;
    let mouseEvent: MouseEvent;

    beforeEach(() => {
        drawingServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas', 'setThickness']);
        rectangleServiceSpy = jasmine.createSpyObj('RectangleService', ['onMouseDown', 'onMouseMove', 'onKeyUp', 'onKeyDown', 'setTypeDrawing']);
        ellipseServiceSpy = jasmine.createSpyObj('EllipseService', ['onMouseDown', 'onMouseMove', 'onKeyUp', 'onKeyDown', 'setTypeDrawing']);

        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawingServiceSpy },
                { provide: RectangleService, useValue: rectangleServiceSpy },
                { provide: EllipseService, useValue: ellipseServiceSpy },
            ],
        });
        service = TestBed.inject(SelectionService);
        // tslint:disable:no-string-literal / reason: accessing private member
        service['positiveStartingPos'] = { x: 0, y: 0 };

        drawingServiceSpy = TestBed.inject(DrawingService) as jasmine.SpyObj<DrawingService>;
        rectangleServiceSpy = TestBed.inject(RectangleService) as jasmine.SpyObj<RectangleService>;
        ellipseServiceSpy = TestBed.inject(EllipseService) as jasmine.SpyObj<EllipseService>;

        service['shapeService'].toolProperties = new BasicShapeProperties();

        drawingServiceSpy.canvas = canvasTestHelper.canvas;
        drawingServiceSpy.baseCtx = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        drawingServiceSpy.previewCtx = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;

        mouseEvent = {
            offsetX: 25,
            offsetY: 25,
            button: MouseButton.Left,
        } as MouseEvent;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('setSelectionType should change selection type and shape service', () => {
        service.currentType = SelectionType.RectangleSelection;
        service['shapeService'] = rectangleServiceSpy;
        service.setSelectionType(SelectionType.EllipseSelection);
        expect(service.currentType).toEqual(SelectionType.EllipseSelection);
        expect(service['shapeService']).toEqual(ellipseServiceSpy);
    });

    it('onMouseDown should set mouseDown to true if left mouse button was clicked', () => {
        service.mouseDown = false;
        service.onMouseDown(mouseEvent);
        expect(service.mouseDown).toBeTrue();
    });

    it('onMouseDown should not set mouseDown to true if right mouse button was clicked', () => {
        const rightMouseEvent = {
            offsetX: 25,
            offsetY: 25,
            button: MouseButton.Right,
        } as MouseEvent;
        service.mouseDown = false;
        service.onMouseDown(rightMouseEvent);
        expect(service.mouseDown).toBeFalse();
    });

    it('onMouseDown should set isMovingSelection to true if left mouse button was clicked and an area is selected', () => {
        service.mouseDown = false;
        service.isAreaSelected = true;
        service['isMovingSelection'] = false;
        service.onMouseDown(mouseEvent);
        expect(service.mouseDown).toBeTrue();
        expect(service['isMovingSelection']).toBeTrue();
    });

    it('onMouseDown should call setTypeDrawing and onMouseDown of shapeService if an area is not already selected', () => {
        service.mouseDown = false;
        service.isAreaSelected = false;
        service.onMouseDown(mouseEvent);

        expect(service.mouseDown).toBeTrue();
        expect(service['shapeService'].onMouseDown).toHaveBeenCalledWith(mouseEvent);
        expect(service['shapeService'].setTypeDrawing).toHaveBeenCalledWith(DrawingType.Stroke);
    });

    it('onMouseMove should not call onMouseMove of shapeService if mouse was not already down', () => {
        service.mouseDown = false;
        service.onMouseMove(mouseEvent);

        expect(service['shapeService'].onMouseMove).not.toHaveBeenCalled();
    });

    it('onMouseMove should call onMouseMove of shapeService if mouse was already down', () => {
        service.mouseDown = true;
        service.onMouseMove(mouseEvent);

        expect(service['shapeService'].onMouseMove).toHaveBeenCalled();
    });

    it('onMouseUp should set not isMovingSelection to false if isMovingSelection and mouseDown were true', () => {
        service.mouseDown = true;
        service['isMovingSelection'] = true;
        service.onMouseUp(mouseEvent);

        expect(service['isMovingSelection']).toBeFalse();
        expect(service.mouseDown).toBeFalse();
    });

    it('onMouseUp should not change mouseDown of shapeService and isMovingSelection if mouse was not already down', () => {
        service.mouseDown = false;
        service['isMovingSelection'] = true;
        service['shapeService'].mouseDown = true;
        service.onMouseUp(mouseEvent);

        expect(service['isMovingSelection']).toBeTrue();
        expect(service['shapeService'].mouseDown).toBeTrue();
    });

    it('onMouseUp should call drawSelectedArea and computePositiveRectangleValues if isMovingSelection is false if isMovingSelection is false and mouseDown is true and mouse was moved', () => {
        // tslint:disable:no-any / reason: spying on function
        const drawSelectedAreaSpy = spyOn<any>(service, 'drawSelectedArea').and.callThrough();
        const computePositiveRectangleValueSpy = spyOn<any>(service, 'computePositiveRectangleValues').and.callThrough();

        service.mouseDown = true;
        // tslint:disable:no-magic-numbers / reason: using random values
        service.mouseDownCoord = { x: 20, y: 20 };
        service['shapeService'].width = 5;
        service['shapeService'].height = 5;
        service['isMovingSelection'] = false;
        service.onMouseUp(mouseEvent);

        expect(service.mouseDown).toBeFalse();
        expect(service['isMovingSelection']).toBeFalse();
        expect(computePositiveRectangleValueSpy).toHaveBeenCalled();
        expect(drawSelectedAreaSpy).toHaveBeenCalled();
    });

    it('onMouseUp should not call drawSelectedArea and computePositiveRectangleValues if isMovingSelection is false if isMovingSelection is false and mouseDown is true and mouse was not moved', () => {
        // tslint:disable:no-any / reason: spying on function
        const drawSelectedAreaSpy = spyOn<any>(service, 'drawSelectedArea').and.callThrough();
        const computePositiveRectangleValueSpy = spyOn<any>(service, 'computePositiveRectangleValues').and.callThrough();

        service.mouseDown = true;
        // tslint:disable:no-magic-numbers / reason: using random values
        service.mouseDownCoord = { x: mouseEvent.offsetX, y: mouseEvent.offsetY };
        service['shapeService'].width = 0;
        service['shapeService'].height = 0;
        service['isMovingSelection'] = false;
        service.onMouseUp(mouseEvent);

        expect(service.mouseDown).toBeFalse();
        expect(service['isMovingSelection']).toBeFalse();
        expect(computePositiveRectangleValueSpy).not.toHaveBeenCalled();
        expect(drawSelectedAreaSpy).not.toHaveBeenCalled();
    });

    it('resetSelection should be called if escape is pressed and mouse is down or an area is selected ', () => {
        service.isAreaSelected = true;
        service.mouseDown = false;
        const keyboardEvent = new KeyboardEvent('keyDown', { key: 'Escape' });
        const resetSelectionSpy = spyOn(service, 'resetSelection').and.callThrough();
        service.onKeyDown(keyboardEvent);
        expect(resetSelectionSpy).toHaveBeenCalled();
    });

    it('resetSelection should be called if escape is pressed and mouse is not down and an area is not selected ', () => {
        service.isAreaSelected = false;
        service.mouseDown = false;
        const keyboardEvent = new KeyboardEvent('keyDown', { key: 'Escape' });
        const resetSelectionSpy = spyOn(service, 'resetSelection').and.callThrough();
        service.onKeyDown(keyboardEvent);
        expect(resetSelectionSpy).not.toHaveBeenCalled();
    });

    it('onKeyDown should call onKeyDown of shapeService if mouse is down ', () => {
        service.isAreaSelected = false;
        service.mouseDown = true;
        const keyboardEvent = new KeyboardEvent('keyDown', { key: 'Shift' });
        service.onKeyDown(keyboardEvent);
        expect(service['shapeService'].onKeyDown).toHaveBeenCalledWith(keyboardEvent);
    });

    it('onKeyUp should call onKeyUp of shapeService if mouse was down', () => {
        service.mouseDown = true;
        const keyboardEvent = new KeyboardEvent('keyUp', { key: 'Shift' });
        service.onKeyUp(keyboardEvent);
        expect(service['shapeService'].onKeyUp).toHaveBeenCalledWith(keyboardEvent);
    });

    it('onKeyUp should call onKeyUp of shapeService if mouse was down', () => {
        service.mouseDown = false;
        const keyboardEvent = new KeyboardEvent('keyUp', { key: 'Shift' });
        service.onKeyUp(keyboardEvent);
        expect(service['shapeService'].onKeyUp).not.toHaveBeenCalled();
    });

    it('selectAll change selection type to rectangle and select whole canvas', () => {
        service.currentType = SelectionType.EllipseSelection;
        // tslint:disable:no-string-literal / reason: accessing private member
        service['shapeService'] = ellipseServiceSpy;
        service.selectAll();

        expect(service.currentType).toEqual(SelectionType.RectangleSelection);
        expect(service['shapeService']).toEqual(rectangleServiceSpy);
        expect(service['positiveStartingPos']).toEqual({ x: 0, y: 0 });
        expect(service['positiveWidth']).toEqual(drawingServiceSpy.canvas.width);
        expect(service['positiveHeight']).toEqual(drawingServiceSpy.canvas.height);
    });

    it('resetSelection should change preview canvas position and size back to normal and should call setTypeDrawing if an area is selected', () => {
        service.isAreaSelected = true;
        drawingServiceSpy.previewCtx.canvas.width = 20;
        drawingServiceSpy.previewCtx.canvas.height = 20;
        drawingServiceSpy.previewCtx.canvas.style.left = '20px';
        drawingServiceSpy.previewCtx.canvas.style.top = '20px';
        service.resetSelection();

        expect(drawingServiceSpy.previewCtx.canvas.width).toEqual(drawingServiceSpy.canvas.width);
        expect(drawingServiceSpy.previewCtx.canvas.height).toEqual(drawingServiceSpy.canvas.height);
        expect(drawingServiceSpy.previewCtx.canvas.style.left).toEqual('0px');
        expect(drawingServiceSpy.previewCtx.canvas.style.top).toEqual('0px');
        expect(service['shapeService'].setTypeDrawing).toHaveBeenCalled();
    });

    it('resetSelection should not call setTypeDrawing if and area is not already selected', () => {
        service.isAreaSelected = false;
        service.resetSelection();
        expect(service['shapeService'].setTypeDrawing).not.toHaveBeenCalled();
    });

    it('drawSelectedArea should not change preview canvas position and size if escape was pressed', () => {
        service['escapePressed'] = true;
        drawingServiceSpy.previewCtx.canvas.width = 20;
        drawingServiceSpy.previewCtx.canvas.height = 20;
        drawingServiceSpy.previewCtx.canvas.style.left = '20px';
        drawingServiceSpy.previewCtx.canvas.style.top = '20px';
        service['drawSelectedArea']();

        expect(drawingServiceSpy.previewCtx.canvas.width).toEqual(20);
        expect(drawingServiceSpy.previewCtx.canvas.height).toEqual(20);
        expect(drawingServiceSpy.previewCtx.canvas.style.left).toEqual('20px');
        expect(drawingServiceSpy.previewCtx.canvas.style.top).toEqual('20px');
    });

    it('drawSelectedArea should change preview canvas position and size if escape was not pressed', () => {
        service['escapePressed'] = false;
        service.isAreaSelected = false;

        service['positiveStartingPos'] = { x: 20, y: 20 };
        service['positiveWidth'] = 20;
        service['positiveHeight'] = 20;

        drawingServiceSpy.previewCtx.canvas.width = 0;
        drawingServiceSpy.previewCtx.canvas.height = 0;
        drawingServiceSpy.previewCtx.canvas.style.left = '0px';
        drawingServiceSpy.previewCtx.canvas.style.top = '0px';
        service['drawSelectedArea']();

        expect(service.isAreaSelected).toBeTrue();
        expect(drawingServiceSpy.previewCtx.canvas.width).toEqual(20);
        expect(drawingServiceSpy.previewCtx.canvas.height).toEqual(20);
        expect(drawingServiceSpy.previewCtx.canvas.style.left).toEqual('20px');
        expect(drawingServiceSpy.previewCtx.canvas.style.top).toEqual('20px');
    });

    it('computePositiveRectangleValues should always give rectangle dimension in quadrant 1', () => {
        const initialCoord = { x: 50, y: 50 };
        service.mouseDownCoord = initialCoord;
        const size = 20;
        service['shapeService'].width = -size;
        service['shapeService'].height = size;
        service['computePositiveRectangleValues']();

        expect(service['positiveStartingPos']).toEqual({ x: initialCoord.x - size, y: initialCoord.y });
        expect(service['positiveWidth']).toEqual(size);
        expect(service['positiveHeight']).toEqual(size);
    });

    it('computePositiveRectangleValues should always give rectangle dimension in quadrant 1', () => {
        const initialCoord = { x: 50, y: 50 };
        service.mouseDownCoord = initialCoord;
        const size = 20;
        service['shapeService'].width = size;
        service['shapeService'].height = -size;
        service['computePositiveRectangleValues']();

        expect(service['positiveStartingPos']).toEqual({ x: initialCoord.x, y: initialCoord.y - size });
        expect(service['positiveWidth']).toEqual(size);
        expect(service['positiveHeight']).toEqual(size);
    });

    it('resetContext should reset all the current changes that the tool made', () => {
        service.mouseDown = true;
        service.isAreaSelected = true;
        service['escapePressed'] = true;
        service['isMovingSelection'] = true;
        service['positiveStartingPos'] = { x: 1, y: 1 };
        service.resetContext();
        expect(service.mouseDown).toBeFalse();
        expect(service.isAreaSelected).toBeFalse();
        expect(service['escapePressed']).toBeFalse();
        expect(service['isMovingSelection']).toBeFalse();
        expect(service['positiveStartingPos']).toEqual({ x: 0, y: 0 });
        expect(drawingServiceSpy.clearCanvas).toHaveBeenCalledWith(drawingServiceSpy.previewCtx);
    });
});
