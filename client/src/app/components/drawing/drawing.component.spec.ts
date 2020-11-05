import { EventEmitter } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { ResizeCommand } from '@app/classes/commands/resize-command';
import { ResizerProperties } from '@app/classes/resizer-properties';
import { SVGFilterComponent } from '@app/components/tools-options/brush/svgfilter/svgfilter.component';
import { CANVAS_MARGIN_LEFT, CANVAS_MARGIN_TOP, CANVAS_MIN_HEIGHT, CANVAS_MIN_WIDTH, SELECTION_CONTROL_POINT_SIZE } from '@app/constants/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ToolbarService } from '@app/services/toolbar/toolbar.service';
import { PencilService } from '@app/services/tools/pencil/pencil-service';
import { BehaviorSubject } from 'rxjs';
import { DrawingComponent } from './drawing.component';

describe('DrawingComponent', () => {
    let component: DrawingComponent;
    let fixture: ComponentFixture<DrawingComponent>;
    let drawingServiceStub: DrawingService;
    const width: number = CANVAS_MIN_WIDTH;
    const height: number = CANVAS_MIN_HEIGHT;
    const dimensionsUpdatedSubjectStub: BehaviorSubject<number[]> = new BehaviorSubject([width, height]);
    let toolbarServiceSpy: jasmine.SpyObj<ToolbarService>;
    let mouseEvent: MouseEvent;

    beforeEach(async(() => {
        drawingServiceStub = new DrawingService();
        toolbarServiceSpy = jasmine.createSpyObj('ToolbarService', [
            'onMouseMove',
            'onMouseDown',
            'onMouseUp',
            'onMouseEnter',
            'onMouseLeave',
            'onDoubleClick',
            'onClick',
            'setColors',
            'setColors',
            'createNewDrawingEventListener',
            'applyCurrentTool',
            'initializeListeners',
            'isAreaSelected',
            'resetSelection',
            'unsubscribeListeners',
            'addCommand',
        ]);

        TestBed.configureTestingModule({
            declarations: [DrawingComponent, SVGFilterComponent],
            providers: [
                { provide: DrawingService, useValue: drawingServiceStub },
                { provide: ToolbarService, useValue: toolbarServiceSpy },
            ],
        }).compileComponents();

        toolbarServiceSpy = TestBed.inject(ToolbarService) as jasmine.SpyObj<ToolbarService>;
        drawingServiceStub.canvas = canvasTestHelper.canvas;
        drawingServiceStub.previewCtx = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        drawingServiceStub.baseCtx = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        // tslint:disable-next-line:no-empty / reason: mocking mouse event
        mouseEvent = { preventDefault: () => {} } as MouseEvent;
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DrawingComponent);
        component = fixture.componentInstance;
        component.resizeCommand = new ResizeCommand(drawingServiceStub);
        component.dimensionsUpdatedEvent = dimensionsUpdatedSubjectStub.asObservable();
        component.requestDrawingContainerDimensions = new EventEmitter();
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should call resetSelection, clearCanvas and emit requestDrawingContainerDimensions on createNewDrawing event ', () => {
        const spyRequestDrawingDims = spyOn(component.requestDrawingContainerDimensions, 'emit');
        const spyClearCanvas = spyOn(drawingServiceStub, 'clearCanvas');
        component.ngOnInit();
        const delay = 1000;
        jasmine.clock().install();
        drawingServiceStub.emitCreateNewDrawingEvent();
        jasmine.clock().tick(delay);
        expect(toolbarServiceSpy.resetSelection).toHaveBeenCalled();
        expect(spyClearCanvas).toHaveBeenCalledWith(drawingServiceStub.baseCtx);
        expect(spyRequestDrawingDims).toHaveBeenCalled();
        jasmine.clock().uninstall();
    });

    it('should emit requestDrawingContainerDimensions requestCanvasSize event ', () => {
        const spyRequestDrawingDims = spyOn(component.requestDrawingContainerDimensions, 'emit');
        component.ngOnInit();
        const delay = 1000;
        jasmine.clock().install();
        drawingServiceStub.emitResetCanvasSizeEvent();
        jasmine.clock().tick(delay);
        expect(spyRequestDrawingDims).toHaveBeenCalled();
        jasmine.clock().uninstall();
    });

    it('should not call newCanvasSetSize when third parameter is false', () => {
        component.ngOnInit();
        const delay = 1000;
        jasmine.clock().install();
        const spyNewCanvasSetSize = spyOn(component, 'newCanvasSetSize');
        dimensionsUpdatedSubjectStub.next([0, 0, +false]);
        jasmine.clock().tick(delay);
        expect(spyNewCanvasSetSize).not.toHaveBeenCalled();
        expect(toolbarServiceSpy.applyCurrentTool).toHaveBeenCalled();
        jasmine.clock().uninstall();
    });

    it('should call newCanvasSetSize when third parameter is true', () => {
        const spyNewCanvasSetSize = spyOn(component, 'newCanvasSetSize');
        component.ngOnInit();
        const delay = 1000;
        jasmine.clock().install();
        dimensionsUpdatedSubjectStub.next([0, 0, +true]);
        jasmine.clock().tick(delay);
        expect(spyNewCanvasSetSize).toHaveBeenCalled();
        expect(toolbarServiceSpy.applyCurrentTool).toHaveBeenCalled();
        jasmine.clock().uninstall();
    });

    it('should call initializeColors', () => {
        component.ngAfterViewInit();
        expect(toolbarServiceSpy.initializeListeners).toHaveBeenCalled();
    });

    it(' should call onResize when receiving a mouseMove on window if isResizingWidth and isResizingHeight are false', () => {
        component.isResizingWidth = false;
        component.isResizingHeight = false;
        toolbarServiceSpy.currentTool = new PencilService(drawingServiceStub);
        component.onMouseMoveWindow(mouseEvent);
        expect(toolbarServiceSpy.onMouseMove).toHaveBeenCalled();
    });

    it(' should call onResize when receiving a mouseMove on window if isResizingWidth or isResizingHeight', () => {
        const onResizeSpy = spyOn(component, 'onResize').and.callThrough();

        component.isResizingHeight = true;
        component.onMouseMoveWindow(mouseEvent);
        expect(onResizeSpy).toHaveBeenCalled();

        component.isResizingHeight = false;
        component.isResizingWidth = true;
        component.onMouseMoveWindow(mouseEvent);
        expect(onResizeSpy).toHaveBeenCalled();
    });

    it(' onMouseMove should call toolbarService onMouseMove when receiving a mouse event', () => {
        component.onMouseMove(mouseEvent);
        expect(toolbarServiceSpy.onMouseMove).toHaveBeenCalled();
        expect(toolbarServiceSpy.onMouseMove).toHaveBeenCalledWith(mouseEvent);
    });

    it('  onMouseDown should call toolbarService onMouseDown when receiving a mouse event', () => {
        component.onMouseDown(mouseEvent);
        expect(toolbarServiceSpy.onMouseDown).toHaveBeenCalled();
        expect(toolbarServiceSpy.onMouseDown).toHaveBeenCalledWith(mouseEvent);
    });

    it('  onMouseUp should call toolbarService onMouseUp when receiving a mouse event', () => {
        component.onMouseUp(mouseEvent);
        expect(toolbarServiceSpy.onMouseUp).toHaveBeenCalled();
        expect(toolbarServiceSpy.onMouseUp).toHaveBeenCalledWith(mouseEvent);
    });

    it(' should not call the toolbarService onMouse when receiving a mouseDown if isResizingWidth or isResizingHeight', () => {
        component.isResizingHeight = true;
        component.onMouseDown(mouseEvent);
        expect(toolbarServiceSpy.onMouseDown).not.toHaveBeenCalled();

        component.isResizingHeight = false;
        component.isResizingWidth = true;
        component.onMouseDown(mouseEvent);
        expect(toolbarServiceSpy.onMouseDown).not.toHaveBeenCalled();
    });

    it(' should call the toolbarService onMouse when receiving a mouseUp if isResizingWidth and isResizingHeight are false', () => {
        component.onMouseUp(mouseEvent);
        expect(toolbarServiceSpy.onMouseUp).toHaveBeenCalledWith(mouseEvent);
    });

    it('onMouseUp should change height of base canvas when isResizingHeight is true', () => {
        component.isResizingHeight = true;
        component.previewCanvas.nativeElement.height = CANVAS_MIN_HEIGHT;
        component.onMouseUp(mouseEvent);
        expect(component.height).toEqual(CANVAS_MIN_HEIGHT);
    });

    it('onMouseUp should change width of base canvas when isResizingWidth is true', () => {
        component.isResizingWidth = true;
        component.previewCanvas.nativeElement.width = CANVAS_MIN_WIDTH;
        component.onMouseUp(mouseEvent);
        expect(component.width).toEqual(CANVAS_MIN_WIDTH);
    });

    it('onMouseUp should change width and height of base canvas when isResizingHeight and isResizingWidth are true', () => {
        component.isResizingHeight = true;
        component.isResizingWidth = true;
        component.previewCanvas.nativeElement.height = CANVAS_MIN_HEIGHT;
        component.previewCanvas.nativeElement.width = CANVAS_MIN_WIDTH;
        component.onMouseUp(mouseEvent);
        expect(component.height).toEqual(CANVAS_MIN_HEIGHT);
        expect(component.width).toEqual(CANVAS_MIN_WIDTH);
    });

    it(' should call the toolbarService onMouseEnter when mouseEnter', () => {
        component.onMouseEnter(mouseEvent);
        expect(toolbarServiceSpy.onMouseEnter).toHaveBeenCalled();
    });

    it(' should call the toolbarService onMouseLeave when mouseLeave', () => {
        component.onMouseLeave(mouseEvent);
        expect(toolbarServiceSpy.onMouseLeave).toHaveBeenCalled();
    });

    it(' should call the toolbarService onDoubleClick when doubleClick', () => {
        component.onDoubleClick(mouseEvent);
        expect(toolbarServiceSpy.onDoubleClick).toHaveBeenCalled();
    });

    it(' should call the toolbarService onClick when click', () => {
        component.onClick(mouseEvent);
        expect(toolbarServiceSpy.onClick).toHaveBeenCalled();
    });

    it(' onContextMenu should return false to prevent context menu from showing', () => {
        const result = component.onContextMenu();
        expect(result).toBeFalse();
    });

    it('onResize should set the width of preview canvas to CANVAS_MIN_WIDTH if its below CANVAS_MIN_WIDTH', () => {
        component.isResizingWidth = true;
        component.previewCanvas.nativeElement.width = 0;
        const limitX = component.baseCanvas.nativeElement.getBoundingClientRect().x;
        const event = jasmine.createSpyObj('MouseEvent', ['preventDefault']);
        event.clientX = CANVAS_MIN_WIDTH + limitX - 1; // width = CANVAS_MIN_WIDTH -1
        component.drawingContainerWidth = 0;
        const expectResult = CANVAS_MIN_WIDTH;
        component.onResize(event);
        expect(component.previewCanvas.nativeElement.width).toEqual(expectResult);
    });

    it('onResize should set the width of preview canvas to widthLimit if its above widthLimit', () => {
        component.isResizingWidth = true;
        component.previewCanvas.nativeElement.width = 0;
        const limitX = component.baseCanvas.nativeElement.getBoundingClientRect().x;
        const event = jasmine.createSpyObj('MouseEvent', ['preventDefault']);
        event.clientX = CANVAS_MIN_WIDTH + limitX + 2; // width = CANVAS_MIN_WIDTH + 2
        component.drawingContainerWidth = CANVAS_MIN_WIDTH + CANVAS_MARGIN_LEFT + 1; // width limit = CANVAS_MIN_WIDTH + 1
        const expectResult = component.drawingContainerWidth - CANVAS_MARGIN_LEFT;
        component.onResize(event);
        expect(component.previewCanvas.nativeElement.width).toEqual(expectResult);
    });

    it('onResize should set the height of preview canvas to CANVAS_MIN_HEIGHT  if its below CANVAS_MIN_HEIGHT', () => {
        component.isResizingHeight = true;
        component.previewCanvas.nativeElement.height = 0;
        const limitY = component.baseCanvas.nativeElement.getBoundingClientRect().y;
        const event = jasmine.createSpyObj('MouseEvent', ['preventDefault']);
        event.clientY = CANVAS_MIN_HEIGHT + limitY - 1; // height = CANVAS_MIN_HEIGHT -1
        component.drawingContainerHeight = 0;
        const expectResult = CANVAS_MIN_HEIGHT;
        component.onResize(event);
        expect(component.previewCanvas.nativeElement.height).toEqual(expectResult);
    });

    it('onResize should set the height of preview canvas to heightLimit  if its above heightLimit', () => {
        component.isResizingHeight = true;
        component.previewCanvas.nativeElement.height = 0;
        const limitY = component.baseCanvas.nativeElement.getBoundingClientRect().y;
        const event = jasmine.createSpyObj('MouseEvent', ['preventDefault']);
        event.clientY = CANVAS_MIN_HEIGHT + limitY + 2; // height = CANVAS_MIN_HEIGHT + 2
        component.drawingContainerHeight = CANVAS_MIN_HEIGHT + CANVAS_MARGIN_TOP + 1; // height limit = CANVAS_MIN_HEIGHT + 1
        const expectResult = component.drawingContainerHeight - CANVAS_MARGIN_TOP;
        component.onResize(event);
        expect(component.previewCanvas.nativeElement.height).toEqual(expectResult);
    });

    it('onResizeWidthStart should set isResizingWidth to true if left mouse click', () => {
        const leftMouseClickEvent = { button: 0 } as MouseEvent;
        component.onResizeWidthStart(leftMouseClickEvent);
        expect(component.isResizingWidth).toEqual(true);
    });

    it('onResizeWidthStart should set isResizingWidth to false if right mouse click', () => {
        const rightMouseClickEvent = { button: 1 } as MouseEvent;
        component.onResizeWidthStart(rightMouseClickEvent);
        expect(component.isResizingWidth).toEqual(false);
    });

    it('onResize should set the width of preview canvas if its between CANVAS_MIN_WIDTH and width limit', () => {
        component.isResizingWidth = true;
        component.previewCanvas.nativeElement.width = 0;
        const limitX = component.baseCanvas.nativeElement.getBoundingClientRect().x;
        const event = jasmine.createSpyObj('MouseEvent', ['preventDefault']);
        event.clientX = CANVAS_MIN_WIDTH + limitX;
        component.drawingContainerWidth = CANVAS_MIN_WIDTH + CANVAS_MARGIN_LEFT; // width limit = CANVAS_MIN_WIDTH
        component.onResize(event);
        expect(component.previewCanvas.nativeElement.width).toEqual(CANVAS_MIN_WIDTH);
    });

    it('onResize should set the height of preview canvas if its between CANVAS_MIN_HEIGHT and height limit', () => {
        component.isResizingHeight = true;
        component.previewCanvas.nativeElement.height = 0;
        const limitY = component.baseCanvas.nativeElement.getBoundingClientRect().y;
        const event = jasmine.createSpyObj('MouseEvent', ['preventDefault']);
        event.clientY = CANVAS_MIN_HEIGHT + limitY;
        component.drawingContainerHeight = CANVAS_MIN_HEIGHT + CANVAS_MARGIN_TOP; // height limit = CANVAS_MIN_HEIGHT
        component.onResize(event);
        expect(component.previewCanvas.nativeElement.height).toEqual(CANVAS_MIN_HEIGHT);
    });

    it('onResize should set the width of preview canvas to CANVAS_MIN_WIDTH if its below CANVAS_MIN_WIDTH', () => {
        component.isResizingWidth = true;
        component.previewCanvas.nativeElement.width = 0;
        const limitX = component.baseCanvas.nativeElement.getBoundingClientRect().x;
        const event = jasmine.createSpyObj('MouseEvent', ['preventDefault']);
        event.clientX = CANVAS_MIN_WIDTH + limitX - 1; // width = CANVAS_MIN_WIDTH -1
        component.drawingContainerWidth = 0;
        const expectResult = CANVAS_MIN_WIDTH;
        component.onResize(event);
        expect(component.previewCanvas.nativeElement.width).toEqual(expectResult);
    });

    it('onResize should set the width of preview canvas to widthLimit if its above widthLimit', () => {
        component.isResizingWidth = true;
        component.previewCanvas.nativeElement.width = 0;
        const limitX = component.baseCanvas.nativeElement.getBoundingClientRect().x;
        const event = jasmine.createSpyObj('MouseEvent', ['preventDefault']);
        event.clientX = CANVAS_MIN_WIDTH + limitX + 2; // width = CANVAS_MIN_WIDTH + 2
        component.drawingContainerWidth = CANVAS_MIN_WIDTH + CANVAS_MARGIN_LEFT + 1; // width limit = CANVAS_MIN_WIDTH + 1
        const expectResult = component.drawingContainerWidth - CANVAS_MARGIN_LEFT;
        component.onResize(event);
        expect(component.previewCanvas.nativeElement.width).toEqual(expectResult);
    });

    it('onResize should set the height of preview canvas to CANVAS_MIN_HEIGHT  if its below CANVAS_MIN_HEIGHT', () => {
        component.isResizingHeight = true;
        component.previewCanvas.nativeElement.height = 0;
        const limitY = component.baseCanvas.nativeElement.getBoundingClientRect().y;
        const event = jasmine.createSpyObj('MouseEvent', ['preventDefault']);
        event.clientY = CANVAS_MIN_HEIGHT + limitY - 1; // height = CANVAS_MIN_HEIGHT -1
        component.drawingContainerHeight = 0;
        const expectResult = CANVAS_MIN_HEIGHT;
        component.onResize(event);
        expect(component.previewCanvas.nativeElement.height).toEqual(expectResult);
    });

    it('onResize should set the height of preview canvas to heightLimit  if its above heightLimit', () => {
        component.isResizingHeight = true;
        component.previewCanvas.nativeElement.height = 0;
        const limitY = component.baseCanvas.nativeElement.getBoundingClientRect().y;
        const event = jasmine.createSpyObj('MouseEvent', ['preventDefault']);
        event.clientY = CANVAS_MIN_HEIGHT + limitY + 2; // height = CANVAS_MIN_HEIGHT + 2
        component.drawingContainerHeight = CANVAS_MIN_HEIGHT + CANVAS_MARGIN_TOP + 1; // height limit = CANVAS_MIN_HEIGHT + 1
        const expectResult = component.drawingContainerHeight - CANVAS_MARGIN_TOP;
        component.onResize(event);
        expect(component.previewCanvas.nativeElement.height).toEqual(expectResult);
    });

    it('onResizeWidthStart should set isResizingWidth to true if left mouse click', () => {
        const leftMouseClickEvent = { button: 0 } as MouseEvent;
        component.onResizeWidthStart(leftMouseClickEvent);
        expect(component.isResizingWidth).toEqual(true);
    });

    it('onResizeWidthStart should set isResizingWidth to false if right mouse click', () => {
        const rightMouseClickEvent = { button: 1 } as MouseEvent;
        component.onResizeWidthStart(rightMouseClickEvent);
        expect(component.isResizingWidth).toEqual(false);
    });

    it('onResizeHeightStart should set isResizingHeight to true if left mouse click', () => {
        const leftMouseClickEvent = { button: 0 } as MouseEvent;
        component.onResizeHeightStart(leftMouseClickEvent);
        expect(component.isResizingHeight).toEqual(true);
    });

    it('onResizeHeightStart should set isResizingHeight to false if right mouse click', () => {
        const rightMouseClickEvent = { button: 1 } as MouseEvent;
        component.onResizeHeightStart(rightMouseClickEvent);
        expect(component.isResizingHeight).toEqual(false);
    });

    it('onResizeBothStart should call onResizeWidthStart and onResizeHeightStart', () => {
        const spyResizeWidth = spyOn(component, 'onResizeWidthStart').and.callThrough();
        const spyResizeHeight = spyOn(component, 'onResizeHeightStart').and.callThrough();
        component.onResizeBothStart(mouseEvent);
        expect(spyResizeWidth).toHaveBeenCalledWith(mouseEvent);
        expect(spyResizeHeight).toHaveBeenCalledWith(mouseEvent);
    });

    it('should update drawing container sizes when dimensionsUpdatedEvent is notified', () => {
        spyOn(component.requestDrawingContainerDimensions, 'emit');
        spyOn(component, 'newCanvasSetSize');
        component.ngAfterViewInit();
        drawingServiceStub.emitCreateNewDrawingEvent();
        dimensionsUpdatedSubjectStub.next([width, height, +true]);
        expect(component.drawingContainerWidth).toEqual(width);
        expect(component.drawingContainerHeight).toEqual(height);
    });

    it('newCanvasSetSize should set the correct width and height when its above or equal canvas minimum dimensions', () => {
        const fakeWidth = 502;
        const fakeHeight = 502;
        component.drawingContainerWidth = fakeWidth;
        component.drawingContainerHeight = fakeHeight;
        component.newCanvasSetSize();
        expect(component.width).toEqual(fakeWidth / 2);
        expect(component.height).toEqual(fakeHeight / 2);
    });

    it('newCanvasSetSize should set the width and height to canvas minimum dimensions when its below canvas minimum dimensions', () => {
        const fakeWidth = 498;
        const fakeHeight = 498;
        component.drawingContainerWidth = fakeWidth;
        component.drawingContainerHeight = fakeHeight;
        component.newCanvasSetSize();
        expect(component.width).toEqual(CANVAS_MIN_WIDTH);
        expect(component.height).toEqual(CANVAS_MIN_HEIGHT);
    });

    it('isAreaSelected should call isAreaSelected of toolbarService', () => {
        component.isAreaSelected();
        expect(toolbarServiceSpy.isAreaSelected).toHaveBeenCalled();
    });

    it('mouseDown on base canvas should call resetSelection if an area is selected and should call onMouseDown', () => {
        spyOn(component, 'onMouseDown');
        toolbarServiceSpy.isAreaSelected.and.callFake(() => {
            return true;
        });
        component.onBaseCanvasMouseDown(mouseEvent);
        expect(toolbarServiceSpy.resetSelection).toHaveBeenCalled();
        expect(component.onMouseDown).toHaveBeenCalledWith(mouseEvent);
    });

    it('mouseDown on base canvas should not call resetSelection if an area is not selected and should not call onMouseDown', () => {
        spyOn(component, 'onMouseDown');
        toolbarServiceSpy.isAreaSelected.and.callFake(() => {
            return false;
        });
        component.onBaseCanvasMouseDown(mouseEvent);
        expect(toolbarServiceSpy.resetSelection).not.toHaveBeenCalled();
        expect(component.onMouseDown).not.toHaveBeenCalled();
    });

    it('calculateResizerStyle should give correct positions for control points if preview canvas is set', () => {
        // tslint:disable-next-line:no-any / reason: set typed object to null
        component.previewCanvas.nativeElement.style.top = '100px';
        component.previewCanvas.nativeElement.style.left = '100px';
        // tslint:disable:no-magic-numbers / reason: testing with random position
        const expectedPosition: ResizerProperties = {
            top: `${100 - SELECTION_CONTROL_POINT_SIZE / 2}px`,
            left: `${100 - SELECTION_CONTROL_POINT_SIZE / 2}px`,
        };
        // tslint:enable:no-magic-numbers

        const result = component.calculateResizerStyle(0, 0);
        expect(result).toEqual(expectedPosition);
    });

    it('calculateResizerStyle should use default width and height to calculate control points positions if preview canvas is not yet set', () => {
        // tslint:disable-next-line:no-any / reason: set typed object to null
        component.previewCanvas = null as any;
        const expectedPosition: ResizerProperties = { top: `${-SELECTION_CONTROL_POINT_SIZE / 2}px`, left: `${-SELECTION_CONTROL_POINT_SIZE / 2}px` };
        const result = component.calculateResizerStyle(0, 0);
        expect(result).toEqual(expectedPosition);
    });
    // tslint:disable-next-line: max-file-line-count / reason: test file
});
