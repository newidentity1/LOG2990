import { TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
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
    // tslint:disable:no-any / reason: spying on function
    let drawPreviewSpy: jasmine.Spy<any>;
    let mouseEvent: MouseEvent;

    beforeEach(() => {
        drawingServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas', 'setThickness', 'setStrokeColor']);
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
        service['currentMousePosition'] = { x: 0, y: 0 };

        drawingServiceSpy = TestBed.inject(DrawingService) as jasmine.SpyObj<DrawingService>;
        rectangleServiceSpy = TestBed.inject(RectangleService) as jasmine.SpyObj<RectangleService>;
        ellipseServiceSpy = TestBed.inject(EllipseService) as jasmine.SpyObj<EllipseService>;

        drawingServiceSpy.canvas = canvasTestHelper.canvas;
        drawingServiceSpy.baseCtx = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        drawingServiceSpy.previewCtx = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;

        drawPreviewSpy = spyOn<any>(service, 'drawPreview').and.callThrough();

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
        service.currentType = SelectionType.EllipseSelection;
        service.setSelectionType(SelectionType.RectangleSelection);
        expect(service.currentType).toEqual(SelectionType.RectangleSelection);
    });

    it('setSelectionType should change selection type and shape service', () => {
        service.currentType = SelectionType.RectangleSelection;
        service.setSelectionType(SelectionType.EllipseSelection);
        expect(service.currentType).toEqual(SelectionType.EllipseSelection);
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

    // it('onMouseDown should set isMovingSelection to true if left mouse button was clicked and an area is selected', () => {
    //     service.mouseDown = false;
    //     service.isAreaSelected = true;
    //     service['isMovingSelection'] = false;
    //     service.onMouseDown(mouseEvent);
    //     expect(service.mouseDown).toBeTrue();
    //     expect(service['isMovingSelection']).toBeTrue();
    // });

    it('onMouseMove should not call drawPreview if mouse was not already down', () => {
        service.mouseDown = false;
        service.onMouseMove(mouseEvent);

        expect(drawPreviewSpy).not.toHaveBeenCalled();
    });

    it('onMouseMove should call drawPreview if mouse was already down and an area is not selected', () => {
        service.mouseDown = true;
        service.isAreaSelected = false;
        service.onMouseMove(mouseEvent);

        expect(drawPreviewSpy).toHaveBeenCalled();
    });

    // it('onMouseUp should set isMovingSelection to false if isMovingSelection and mouseDown were true', () => {
    //     service.mouseDown = true;
    //     service['isMovingSelection'] = true;
    //     service.onMouseUp(mouseEvent);

    //     expect(service['isMovingSelection']).toBeFalse();
    //     expect(service.mouseDown).toBeFalse();
    // });

    // it('onMouseUp should call drawSelectedArea if mouse was down and is not moving a selection and mouse was moved', () => {
    //     const drawSelectedAreaSpy = spyOn<any>(service, 'drawSelectedArea').and.callThrough();
    //     service.mouseDown = true;
    //     service['isMovingSelection'] = false;
    //     service.mouseDownCoord = { x: 0, y: 0 };
    //     service.onMouseUp(mouseEvent);

    //     expect(drawSelectedAreaSpy).toHaveBeenCalled();
    // });

    // it('onMouseUp should not call drawSelectedArea if mouse was down and is not moving a selection and mouse was not moved', () => {
    //     const drawSelectedAreaSpy = spyOn<any>(service, 'drawSelectedArea').and.callThrough();
    //     service.mouseDown = true;
    //     service['isMovingSelection'] = false;
    //     service.mouseDownCoord = { x: mouseEvent.offsetX, y: mouseEvent.offsetY };
    //     service.onMouseUp(mouseEvent);

    //     expect(drawSelectedAreaSpy).not.toHaveBeenCalled();
    // });

    // it('onMouseUp should not call drawSelectedArea and should not set isMovingSelection to false if mouse was not down', () => {
    //     const drawSelectedAreaSpy = spyOn<any>(service, 'drawSelectedArea').and.callThrough();
    //     service.mouseDown = false;
    //     service['isMovingSelection'] = true;
    //     service.onMouseUp(mouseEvent);
    //     expect(drawSelectedAreaSpy).not.toHaveBeenCalled();
    //     expect(service['isMovingSelection']).toBeTrue();
    // });

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

    it('onKeyDown should not call resetSelection if mouse is down and escape is not pressed ', () => {
        service.mouseDown = true;
        const keyboardEvent = new KeyboardEvent('keyDown', { key: 'Shift' });
        const resetSelectionSpy = spyOn(service, 'resetSelection').and.callThrough();
        service.onKeyDown(keyboardEvent);
        expect(resetSelectionSpy).not.toHaveBeenCalled();
    });

    it('selectAll change selection type to rectangle and select whole canvas', () => {
        service.currentType = SelectionType.EllipseSelection;
        // tslint:disable:no-string-literal / reason: accessing private member
        service.selectAll();

        expect(service.currentType).toEqual(SelectionType.RectangleSelection);
        expect(service['positiveStartingPos']).toEqual({ x: 0, y: 0 });
        expect(service['positiveWidth']).toEqual(drawingServiceSpy.canvas.width);
        expect(service['positiveHeight']).toEqual(drawingServiceSpy.canvas.height);
    });

    it('resetSelection should change preview canvas position and size back to normal if an area is selected', () => {
        service.isAreaSelected = true;
        // tslint:disable:no-magic-numbers / reason: using random values
        drawingServiceSpy.previewCtx.canvas.width = 20;
        drawingServiceSpy.previewCtx.canvas.height = 20;
        drawingServiceSpy.previewCtx.canvas.style.left = '20px';
        drawingServiceSpy.previewCtx.canvas.style.top = '20px';
        service.resetSelection();

        expect(drawingServiceSpy.previewCtx.canvas.width).toEqual(drawingServiceSpy.canvas.width);
        expect(drawingServiceSpy.previewCtx.canvas.height).toEqual(drawingServiceSpy.canvas.height);
        expect(drawingServiceSpy.previewCtx.canvas.style.left).toEqual('0px');
        expect(drawingServiceSpy.previewCtx.canvas.style.top).toEqual('0px');
    });

    it('resetSelection should not change preview canvas position and size back to normal if an area is not selected', () => {
        service.isAreaSelected = false;
        // tslint:disable:no-magic-numbers / reason: using random values
        drawingServiceSpy.previewCtx.canvas.width = 20;
        drawingServiceSpy.previewCtx.canvas.height = 20;
        drawingServiceSpy.previewCtx.canvas.style.left = '20px';
        drawingServiceSpy.previewCtx.canvas.style.top = '20px';
        service.resetSelection();

        expect(drawingServiceSpy.previewCtx.canvas.width).toEqual(20);
        expect(drawingServiceSpy.previewCtx.canvas.height).toEqual(20);
        expect(drawingServiceSpy.previewCtx.canvas.style.left).toEqual('20px');
        expect(drawingServiceSpy.previewCtx.canvas.style.top).toEqual('20px');
    });

    it('drawShape should call drawRectangleSelection and drawEllipseSelection', () => {
        const drawRectangleSelectionSpy = spyOn<any>(service, 'drawRectangleSelection').and.callThrough();
        const drawEllipseSelectionSpy = spyOn<any>(service, 'drawEllipseSelection').and.callThrough();
        service.drawShape();
        expect(drawRectangleSelectionSpy).toHaveBeenCalled();
        expect(drawEllipseSelectionSpy).toHaveBeenCalled();
    });

    it('drawRectangleSelection should draw a rectangle', () => {
        const rectSpy = spyOn(drawingServiceSpy.previewCtx, 'rect').and.callThrough();
        service.currentType = SelectionType.RectangleSelection;
        service['drawRectangleSelection']({ x: 0, y: 0 }, 10, 10);
        expect(rectSpy).toHaveBeenCalled();
    });

    it('drawEllipseSelection should draw an ellipse if selection type is ellipse', () => {
        const ellipseSpy = spyOn(drawingServiceSpy.previewCtx, 'ellipse').and.callThrough();
        service.currentType = SelectionType.EllipseSelection;
        service['drawEllipseSelection']({ x: 0, y: 0 }, 10, 10);
        expect(ellipseSpy).toHaveBeenCalled();
    });

    it('drawEllipseSelection should not draw an ellipse if selection type is not ellipse', () => {
        const ellipseSpy = spyOn(drawingServiceSpy.previewCtx, 'ellipse').and.callThrough();
        service.currentType = SelectionType.RectangleSelection;
        service['drawEllipseSelection']({ x: 0, y: 0 }, 10, 10);
        expect(ellipseSpy).not.toHaveBeenCalled();
    });

    it('drawSelectedArea should change preview canvas position and size if escape was not pressed', () => {
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
        service.width = -size;
        service.height = size;
        service['computePositiveRectangleValues']();

        expect(service['positiveStartingPos']).toEqual({ x: initialCoord.x - size, y: initialCoord.y });
        expect(service['positiveWidth']).toEqual(size);
        expect(service['positiveHeight']).toEqual(size);
    });

    it('computePositiveRectangleValues should always give rectangle dimension in quadrant 1', () => {
        const initialCoord = { x: 50, y: 50 };
        service.mouseDownCoord = initialCoord;
        const size = 20;
        service.width = size;
        service.height = -size;
        service['computePositiveRectangleValues']();

        expect(service['positiveStartingPos']).toEqual({ x: initialCoord.x, y: initialCoord.y - size });
        expect(service['positiveWidth']).toEqual(size);
        expect(service['positiveHeight']).toEqual(size);
    });

    it('setColors should call setStrokeColor of drawingService', () => {
        service.setColors();
        expect(drawingServiceSpy.setStrokeColor).toHaveBeenCalledWith('black');
    });

    // it('resetContext should reset all the current changes that the tool made', () => {
    //     service.mouseDown = true;
    //     service.isAreaSelected = true;
    //     service['isMovingSelection'] = true;
    //     service['positiveStartingPos'] = { x: 1, y: 1 };
    //     service.resetContext();
    //     expect(service.mouseDown).toBeFalse();
    //     expect(service.isAreaSelected).toBeFalse();
    //     expect(service['isMovingSelection']).toBeFalse();
    //     expect(service['positiveStartingPos']).toEqual({ x: 0, y: 0 });
    //     expect(drawingServiceSpy.clearCanvas).toHaveBeenCalledWith(drawingServiceSpy.previewCtx);
    // });
});
