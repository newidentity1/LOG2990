import { TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { ShapeTool } from '@app/classes/tool/shape-tool';
import { MouseButton } from '@app/enums/mouse-button.enum';
import { SelectionType } from '@app/enums/selection-type.enum';
import { DrawingService } from '@app/services/drawing/drawing.service';
// import { GridService } from '@app/services/tools/grid/grid.service';
import { MoveSelectionService } from './move-selection/move-selection.service';
import { SelectionService } from './selection.service';

describe('SelectionService', () => {
    let service: SelectionService;
    let drawingServiceSpy: jasmine.SpyObj<DrawingService>;
    // let gridServiceSpy: jasmine.SpyObj<GridService>;
    let moveSelectionService: MoveSelectionService;
    // tslint:disable:no-any / reason: spying on function
    let drawPreviewSpy: jasmine.Spy<any>;
    let drawSelectionSpy: jasmine.Spy<any>;
    let copySelectionSpy: jasmine.Spy<any>;
    let mouseEvent: MouseEvent;

    beforeEach(() => {
        drawingServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas', 'setThickness', 'setStrokeColor']);
        // gridServiceSpy = jasmine.createSpyObj('GridServiceSpy', ['clearCanvas', 'setThickness', 'setStrokeColor']);

        moveSelectionService = new MoveSelectionService(drawingServiceSpy);
        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawingServiceSpy },
                { provide: MoveSelectionService, useValue: moveSelectionService },
            ],
        });
        service = TestBed.inject(SelectionService);
        // tslint:disable:no-string-literal / reason: accessing private member
        service['positiveStartingPos'] = { x: 0, y: 0 };
        service['currentMousePosition'] = { x: 0, y: 0 };

        drawingServiceSpy = TestBed.inject(DrawingService) as jasmine.SpyObj<DrawingService>;
        drawingServiceSpy.canvas = canvasTestHelper.canvas;
        drawingServiceSpy.baseCtx = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        drawingServiceSpy.previewCtx = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;

        drawPreviewSpy = spyOn<any>(service, 'drawPreview').and.callThrough();
        drawSelectionSpy = spyOn<any>(service, 'drawSelection').and.callThrough();
        service['selectionImageData'] = drawingServiceSpy.baseCtx.getImageData(0, 0, 1, 1);
        moveSelectionService.imgData = drawingServiceSpy.baseCtx.getImageData(0, 0, 1, 1);

        moveSelectionService = TestBed.inject(MoveSelectionService);
        copySelectionSpy = spyOn<any>(moveSelectionService, 'copySelection').and.callThrough();

        mouseEvent = {
            clientX: 25,
            clientY: 25,
            offsetX: 25,
            offsetY: 25,
            button: MouseButton.Left,
        } as MouseEvent;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('setSelectionType should change selection type to rectangel if rectangle was selected and call resetSelection', () => {
        service.currentType = SelectionType.EllipseSelection;
        service.setSelectionType(SelectionType.RectangleSelection);
        expect(service.currentType).toEqual(SelectionType.RectangleSelection);
        expect(drawSelectionSpy).toHaveBeenCalled();
    });

    it('setSelectionType should change selection type to ellipse if ellipse was selected and call resetSelection', () => {
        service.currentType = SelectionType.RectangleSelection;
        service.setSelectionType(SelectionType.EllipseSelection);
        expect(service.currentType).toEqual(SelectionType.EllipseSelection);
        expect(drawSelectionSpy).toHaveBeenCalled();
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

    it('onMouseDown should set moveSelectionPos if left mouse button was clicked and an area is selected', () => {
        service.mouseDown = false;
        service.isAreaSelected = true;
        service['moveSelectionPos'] = { x: 0, y: 0 };
        service.onMouseDown(mouseEvent);
        expect(service.mouseDown).toBeTrue();
        expect(service['moveSelectionPos']).toEqual({ x: mouseEvent.offsetX, y: mouseEvent.offsetY });
    });

    it('onMouseMove should not call drawPreview if mouse was not already down', () => {
        service.mouseDown = false;
        service.onMouseMove(mouseEvent);
        expect(drawPreviewSpy).not.toHaveBeenCalled();
    });

    it('onMouseMove should call drawPreview if mouse was already down and an area is not selected', () => {
        service.mouseDown = true;
        service.isAreaSelected = false;
        service['moveSelectionPos'] = { x: 0, y: 0 };
        service.onMouseMove(mouseEvent);
        expect(drawPreviewSpy).toHaveBeenCalled();
    });

    it('onMouseMove should set moveSelectionPos if an area is selected and mouseDown were true', () => {
        const moveSelectionSpy = spyOn<any>(moveSelectionService, 'moveSelection').and.callThrough();
        service.mouseDown = true;
        service.isAreaSelected = true;
        service['moveSelectionPos'] = { x: 0, y: 0 };
        service.onMouseMove(mouseEvent);
        expect(service['moveSelectionPos']).toEqual({ x: mouseEvent.offsetX, y: mouseEvent.offsetY });
        expect(moveSelectionSpy).toHaveBeenCalled();
    });

    it('onMouseUp should set mouse down to false if mouse was down', () => {
        service.mouseDown = true;
        service.isAreaSelected = true;
        service.onMouseUp(mouseEvent);
        expect(service.mouseDown).toBeFalse();
    });

    it('onMouseUp should call copySelection if mouse was down and an area is not selected and mouse was moved', () => {
        service.mouseDown = true;
        service.isAreaSelected = false;
        service.mouseDownCoord = { x: 0, y: 0 };
        service.onMouseMove(mouseEvent);
        service.onMouseUp(mouseEvent);
        expect(copySelectionSpy).toHaveBeenCalled();
    });

    it('onMouseUp should not call copySelection if mouse was down and an area is not selected and mouse was not moved', () => {
        service.mouseDown = true;
        service.isAreaSelected = false;
        service.mouseDownCoord = { x: 0, y: 0 };
        const event = {
            clientX: 0,
            clientY: 0,
            offsetX: 0,
            offsetY: 0,
            button: MouseButton.Left,
        } as MouseEvent;
        service.onMouseMove(event);
        service.onMouseUp(event);
        expect(copySelectionSpy).not.toHaveBeenCalled();
    });

    it('onMouseUp should not call copySelection if mouse was not down', () => {
        service.mouseDown = true;
        service.onMouseUp(mouseEvent);
        expect(copySelectionSpy).not.toHaveBeenCalled();
    });

    it('onMouseUp should not call copySelection if mouse was down and an area is selected', () => {
        service.mouseDown = false;
        service.isAreaSelected = true;
        service.mouseDownCoord = { x: 0, y: 0 };
        service.onMouseUp(mouseEvent);
        expect(copySelectionSpy).not.toHaveBeenCalled();
    });

    it('resetSelection should be called if escape is pressed and mouse is down or an area is selected ', () => {
        service.isAreaSelected = true;
        service.mouseDown = false;
        const keyboardEvent = new KeyboardEvent('keyDown', { key: 'Escape' });
        service.onKeyDown(keyboardEvent);
        expect(drawSelectionSpy).toHaveBeenCalled();
    });

    it('resetSelection should not be called if escape is pressed and mouse is not down and an area is not selected ', () => {
        service.isAreaSelected = false;
        service.mouseDown = false;
        const keyboardEvent = new KeyboardEvent('keyDown', { key: 'Escape' });
        service.onKeyDown(keyboardEvent);
        expect(drawSelectionSpy).not.toHaveBeenCalled();
    });

    it('onKeyDown should not call resetSelection if mouse is down and escape is not pressed ', () => {
        service.mouseDown = true;
        const keyboardEvent = new KeyboardEvent('keyDown', { key: 'Shift' });
        service.onKeyDown(keyboardEvent);
        expect(drawSelectionSpy).not.toHaveBeenCalled();
    });

    it('onKeyDown should call checkArrowKeysPressed if an area is selected ', () => {
        const checkArrowKeysPressedSpy = spyOn<any>(moveSelectionService, 'checkArrowKeysPressed').and.callThrough();
        service.isAreaSelected = true;
        const event = {} as KeyboardEvent;
        service.onKeyDown(event);
        expect(checkArrowKeysPressedSpy).toHaveBeenCalled();
    });

    it('onKeyDown should call onkeydown of shapetool if an area is not selected ', () => {
        const keyDownSpy = spyOn(ShapeTool.prototype, 'onKeyDown');
        service.isAreaSelected = false;
        const event = {} as KeyboardEvent;
        service.onKeyDown(event);
        expect(keyDownSpy).toHaveBeenCalled();
    });

    it('onKeyDown should call drawSelectionBox if an arrow key is pressed and an area is selected ', () => {
        const drawSelectionBoxSpy = spyOn<any>(service, 'drawSelectionBox').and.callThrough();
        service.isAreaSelected = true;
        const event = new KeyboardEvent('keyDown', { key: 'ArrowLeft' });
        moveSelectionService.canMoveSelection = true;
        service.onKeyDown(event);
        expect(drawSelectionBoxSpy).toHaveBeenCalled();
    });

    it('onKeyUp should call checkArrowKeysReleased if an area is selected ', () => {
        const checkArrowKeysReleasedSpy = spyOn<any>(moveSelectionService, 'checkArrowKeysReleased').and.callThrough();
        service.isAreaSelected = true;
        const event = {} as KeyboardEvent;
        service.onKeyUp(event);
        expect(checkArrowKeysReleasedSpy).toHaveBeenCalled();
    });

    it('onKeyUp should call onkeydown of shapetool if an area is not selected ', () => {
        const keyUpSpy = spyOn(ShapeTool.prototype, 'onKeyUp');
        service.isAreaSelected = false;
        const event = {} as KeyboardEvent;
        service.onKeyUp(event);
        expect(keyUpSpy).toHaveBeenCalled();
    });

    it('selectAll change selection type to rectangle and select whole canvas and should call copySelection', () => {
        service.currentType = SelectionType.EllipseSelection;
        // tslint:disable:no-string-literal / reason: accessing private member
        service.selectAll();

        expect(service.currentType).toEqual(SelectionType.RectangleSelection);
        expect(service['positiveStartingPos']).toEqual({ x: 0, y: 0 });
        expect(service['positiveWidth']).toEqual(drawingServiceSpy.canvas.width);
        expect(service['positiveHeight']).toEqual(drawingServiceSpy.canvas.height);
        expect(copySelectionSpy).toHaveBeenCalled();
    });

    it('resetSelection should change preview canvas position and size back to normal if an area is selected', () => {
        service.isAreaSelected = true;
        // tslint:disable:no-magic-numbers / reason: using random values
        drawingServiceSpy.previewCtx.canvas.width = 20;
        drawingServiceSpy.previewCtx.canvas.height = 20;
        drawingServiceSpy.previewCtx.canvas.style.left = '20px';
        drawingServiceSpy.previewCtx.canvas.style.top = '20px';
        service.drawSelection();

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
        service.drawSelection();

        expect(drawingServiceSpy.previewCtx.canvas.width).toEqual(20);
        expect(drawingServiceSpy.previewCtx.canvas.height).toEqual(20);
        expect(drawingServiceSpy.previewCtx.canvas.style.left).toEqual('20px');
        expect(drawingServiceSpy.previewCtx.canvas.style.top).toEqual('20px');
    });

    it('draw should call drawSelectionBox and drawEllipseSelection', () => {
        const drawSelectionBoxSpy = spyOn<any>(service, 'drawSelectionBox').and.callThrough();
        service.draw();
        expect(drawSelectionBoxSpy).toHaveBeenCalled();
    });

    it('drawSelectionBox should draw a rectangle and should not draw ellipse if selection is rectange', () => {
        const rectSpy = spyOn(drawingServiceSpy.previewCtx, 'rect').and.callThrough();
        const ellipseSpy = spyOn(drawingServiceSpy.previewCtx, 'ellipse').and.callThrough();
        service.currentType = SelectionType.RectangleSelection;
        service['drawSelectionBox']({ x: 0, y: 0 }, 10, 10);
        expect(rectSpy).toHaveBeenCalled();
        expect(ellipseSpy).not.toHaveBeenCalled();
    });

    it('drawSelectionBox should draw an ellipse if selection type is ellipse', () => {
        const rectSpy = spyOn(drawingServiceSpy.previewCtx, 'rect').and.callThrough();
        const ellipseSpy = spyOn(drawingServiceSpy.previewCtx, 'ellipse').and.callThrough();
        service.currentType = SelectionType.EllipseSelection;
        service['drawSelectionBox']({ x: 0, y: 0 }, 10, 10);
        expect(rectSpy).toHaveBeenCalled();
        expect(ellipseSpy).toHaveBeenCalled();
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

    it('resetContext should reset all the current changes that the tool made', () => {
        service.mouseDown = true;
        service.isAreaSelected = true;
        service['positiveStartingPos'] = { x: 1, y: 1 };
        service.resetContext();
        expect(service.mouseDown).toBeFalse();
        expect(service.isAreaSelected).toBeFalse();
        expect(service['positiveStartingPos']).toEqual({ x: 0, y: 0 });
        expect(drawingServiceSpy.clearCanvas).toHaveBeenCalledWith(drawingServiceSpy.previewCtx);
    });

    // it('drawSelection should emit a command if an area is selected and the starting position is different from the final position', () => {
    //     const emitSpy = spyOn(service.executedCommand, 'emit');
    //     service.isAreaSelected = true;
    //     service.positiveStartingPos = { x: 0, y: 0 };
    //     service['moveSelectionService'].finalPosition = { x: 10, y: 10 };
    //     service.drawSelection();
    //     expect(emitSpy).toHaveBeenCalled();
    // });

    it('drawSelection should call resetSelection if an area is selected', () => {
        const resetSelectionSpy = spyOn(service, 'resetSelection');
        service.isAreaSelected = true;
        service.drawSelection();
        expect(resetSelectionSpy).toHaveBeenCalled();
    });

    it('drawSelection should do nothing if an area is not selected', () => {
        const resetSelectionSpy = spyOn(service, 'resetSelection');
        service.isAreaSelected = false;
        service.drawSelection();
        expect(resetSelectionSpy).not.toHaveBeenCalled();
    });

    // it('execute should call copySelection and resetSelection', () => {
    //     const resetSelectionSpy = spyOn(service, 'resetSelection');
    //     service.positiveStartingPos = { x: 0, y: 0 };
    //     service.positiveHeight = 10;
    //     service.positiveWidth = 10;
    //     service.execute();
    //     expect(copySelectionSpy).toHaveBeenCalled();
    //     expect(resetSelectionSpy).toHaveBeenCalled();
    // });
    // tslint:disable-next-line: max-file-line-count / reason: its a test file
});
