import { EventEmitter } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { ResizerProperties } from '@app/classes/resizer-properties';
import { SVGFilterComponent } from '@app/components/tools-options/brush/svgfilter/svgfilter.component';
import { CANVAS_MIN_HEIGHT, CANVAS_MIN_WIDTH, SELECTION_CONTROL_POINT_SIZE } from '@app/constants/constants';
import { ControlPoint } from '@app/enums/control-point.enum';
import { AutomaticSavingService } from '@app/services/automatic-saving/automatic-saving.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ResizeService } from '@app/services/resize/resize.service';
import { ToolbarService } from '@app/services/toolbar/toolbar.service';
import { PencilService } from '@app/services/tools/pencil/pencil.service';
import { BehaviorSubject } from 'rxjs';
import { DrawingComponent } from './drawing.component';

describe('DrawingComponent', () => {
    let component: DrawingComponent;
    let fixture: ComponentFixture<DrawingComponent>;
    let drawingServiceStub: DrawingService;
    let resizeServiceStub: ResizeService;
    const width: number = CANVAS_MIN_WIDTH;
    const height: number = CANVAS_MIN_HEIGHT;
    const dimensionsUpdatedSubjectStub: BehaviorSubject<number[]> = new BehaviorSubject([width, height]);
    let toolbarServiceSpy: jasmine.SpyObj<ToolbarService>;
    let automaticSavingServiceSpy: jasmine.SpyObj<AutomaticSavingService>;
    let mouseEvent: MouseEvent;

    beforeEach(async(() => {
        drawingServiceStub = new DrawingService();
        resizeServiceStub = new ResizeService(drawingServiceStub);
        automaticSavingServiceSpy = jasmine.createSpyObj('AutomaticSavingService', ['savedDrawingExists', 'recover', 'clearStorage']);
        toolbarServiceSpy = jasmine.createSpyObj('ToolbarService', [
            'onMouseMove',
            'onMouseDown',
            'onMouseUp',
            'onMouseEnter',
            'onMouseLeave',
            'onDoubleClick',
            'onClick',
            'onContextMenu',
            'setColors',
            'setColors',
            'createNewDrawingEventListener',
            'applyCurrentTool',
            'initializeListeners',
            'isAreaSelected',
            'resetSelection',
            'unsubscribeListeners',
            'addCommand',
            'onMouseScroll',
            'resizeSelection',
        ]);

        TestBed.configureTestingModule({
            declarations: [DrawingComponent, SVGFilterComponent],
            providers: [
                { provide: DrawingService, useValue: drawingServiceStub },
                { provide: ResizeService, useValue: resizeServiceStub },
                { provide: ToolbarService, useValue: toolbarServiceSpy },
                { provide: AutomaticSavingService, useValue: automaticSavingServiceSpy },
            ],
        }).compileComponents();

        toolbarServiceSpy = TestBed.inject(ToolbarService) as jasmine.SpyObj<ToolbarService>;
        drawingServiceStub.canvas = canvasTestHelper.canvas;
        drawingServiceStub.previewCtx = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        drawingServiceStub.baseCtx = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;

        automaticSavingServiceSpy = TestBed.inject(AutomaticSavingService) as jasmine.SpyObj<AutomaticSavingService>;

        // tslint:disable-next-line:no-empty / reason: mocking mouse event
        mouseEvent = { preventDefault: () => {} } as MouseEvent;
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DrawingComponent);
        component = fixture.componentInstance;
        component.dimensionsUpdatedEvent = dimensionsUpdatedSubjectStub.asObservable();
        component.requestDrawingContainerDimensions = new EventEmitter();
        // tslint:disable:no-string-literal / reason : access private members
        component['automaticSavingService'].clearStorage();
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
        expect(toolbarServiceSpy.applyCurrentTool).not.toHaveBeenCalled();
        jasmine.clock().uninstall();
    });

    it('should call newCanvasSetSize when third parameter is true', () => {
        // tslint:disable:no-string-literal / reason : access private members
        component['automaticSavingService'].clearStorage();
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

    it('should recover saved drawing if exists', () => {
        automaticSavingServiceSpy.savedDrawingExists.and.returnValue(true);
        component.ngOnInit();
        const delay = 1000;
        jasmine.clock().install();
        dimensionsUpdatedSubjectStub.next([0, 0, +true]);
        jasmine.clock().tick(delay);
        expect(automaticSavingServiceSpy.recover).toHaveBeenCalled();
        jasmine.clock().uninstall();
    });

    it('should call initializeColors', () => {
        component.ngAfterViewInit();
        expect(toolbarServiceSpy.initializeListeners).toHaveBeenCalled();
    });

    it(' onMouseMoveWindow should call onResize when receiving a mouseMove on window if isResizing is false and currenttool is pencil', () => {
        resizeServiceStub.isResizing = false;
        toolbarServiceSpy.currentTool = new PencilService(drawingServiceStub);
        component.onMouseMoveWindow(mouseEvent);
        expect(toolbarServiceSpy.onMouseMove).toHaveBeenCalled();
    });

    it(' onMouseMoveWindow should not call onResize when receiving a mouseMove on window if isResizing is false', () => {
        resizeServiceStub.isResizing = false;
        component.onMouseMoveWindow(mouseEvent);
        expect(toolbarServiceSpy.onMouseMove).not.toHaveBeenCalled();
    });

    it(' onMouseMoveWindow should call onResize when receiving a mouseMove on window if area is not selected', () => {
        const onResizeSpy = spyOn(component, 'onResize').and.callThrough();
        toolbarServiceSpy.isAreaSelected.and.callFake(() => {
            return false;
        });
        resizeServiceStub.isResizing = true;
        component.onMouseMoveWindow(mouseEvent);
        expect(onResizeSpy).toHaveBeenCalled();
    });

    it(' onMouseMoveWindow should call resizeSelection of toolbar when receiving a mouseMove on window if area is selected', () => {
        toolbarServiceSpy.resizeSelection.and.callThrough();
        toolbarServiceSpy.isAreaSelected.and.callFake(() => {
            return true;
        });
        resizeServiceStub.isResizing = true;
        component.onMouseMoveWindow(mouseEvent);
        expect(toolbarServiceSpy.resizeSelection).toHaveBeenCalled();
    });

    it(' onMouseMove should not call onMouseMove if current tool is not pencil', () => {
        toolbarServiceSpy.currentTool = new PencilService(drawingServiceStub);
        component.onMouseMove(mouseEvent);
        expect(toolbarServiceSpy.onMouseMove).not.toHaveBeenCalled();
    });

    it(' onMouseMove should call toolbarService onMouseMove when receiving a mouse event', () => {
        component.onMouseMove(mouseEvent);
        expect(toolbarServiceSpy.onMouseMove).toHaveBeenCalledWith(mouseEvent);
    });

    it('  onMouseDown should call toolbarService onMouseDown when receiving a mouse event if its not resizing mode', () => {
        resizeServiceStub.isResizing = false;
        component.onMouseDown(mouseEvent);
        expect(toolbarServiceSpy.onMouseDown).toHaveBeenCalled();
        expect(toolbarServiceSpy.onMouseDown).toHaveBeenCalledWith(mouseEvent);
    });

    it('  onMouseDown should not call toolbarService onMouseDown when receiving a mouse event if its resizing mode', () => {
        resizeServiceStub.isResizing = true;
        component.onMouseDown(mouseEvent);
        expect(toolbarServiceSpy.onMouseDown).not.toHaveBeenCalled();
        expect(toolbarServiceSpy.onMouseDown).not.toHaveBeenCalledWith(mouseEvent);
    });

    it('onMouseUp should call toolbarService onMouseUp when receiving a mouse event', () => {
        component.onMouseUp(mouseEvent);
        expect(toolbarServiceSpy.onMouseUp).toHaveBeenCalled();
        expect(toolbarServiceSpy.onMouseUp).toHaveBeenCalledWith(mouseEvent);
    });

    it('should call the toolbarService onMouse when receiving a mouseUp if isResizing is false', () => {
        spyOn(component, 'isResizing').and.callFake(() => {
            return false;
        });
        component.onMouseUp(mouseEvent);
        expect(toolbarServiceSpy.onMouseUp).toHaveBeenCalledWith(mouseEvent);
    });

    it('should call resize of resizeService when receiving a mouseUp if isResizing is true and isAreaSelected is false', () => {
        toolbarServiceSpy.mouseDown = true;
        spyOn(component, 'isResizing').and.callFake(() => {
            return true;
        });
        spyOn(component, 'isAreaSelected').and.callFake(() => {
            return false;
        });
        toolbarServiceSpy.applyCurrentTool.and.callFake(() => {
            return;
        });

        const resize = spyOn(resizeServiceStub, 'resize').and.callFake(() => {
            return;
        });

        const resetResize = spyOn(resizeServiceStub, 'resetResize').and.callFake(() => {
            return;
        });
        const delay = 1000;
        jasmine.clock().install();
        component.onMouseUp(mouseEvent);
        jasmine.clock().tick(delay);
        expect(toolbarServiceSpy.mouseDown).toEqual(false);
        expect(resize).toHaveBeenCalled();
        expect(resetResize).toHaveBeenCalled();
        expect(toolbarServiceSpy.applyCurrentTool).toHaveBeenCalled();
        jasmine.clock().uninstall();
    });

    it('should call resize of resizeSelection when receiving a mouseUp if isResizing is true and isAreaSelected is true', () => {
        toolbarServiceSpy.mouseDown = true;
        spyOn(component, 'isResizing').and.callFake(() => {
            return true;
        });
        spyOn(component, 'isAreaSelected').and.callFake(() => {
            return true;
        });

        const resetResize = spyOn(resizeServiceStub, 'resetResize').and.callFake(() => {
            return;
        });
        const delay = 1000;
        jasmine.clock().install();
        component.onMouseUp(mouseEvent);
        jasmine.clock().tick(delay);
        expect(toolbarServiceSpy.mouseDown).toEqual(false);
        expect(toolbarServiceSpy.resizeSelection).toHaveBeenCalled();
        expect(resetResize).toHaveBeenCalled();
        expect(toolbarServiceSpy.applyCurrentTool).not.toHaveBeenCalled();
        jasmine.clock().uninstall();
    });

    it(' should call the toolbarService onMouseEnter when scroll event', () => {
        const wheelEvent = {} as WheelEvent;
        component.onMouseWheel(wheelEvent);
        expect(toolbarServiceSpy.onMouseScroll).toHaveBeenCalled();
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
        const result = component.onContextMenu(mouseEvent);
        expect(toolbarServiceSpy.onContextMenu).toHaveBeenCalled();
        expect(result).toBeFalse();
    });

    it('onResize should call onResizeWidth and OnResizeHeight of resizeService if area is not selected and its resizing mode', () => {
        resizeServiceStub.isResizing = true;
        toolbarServiceSpy.isAreaSelected.and.callFake(() => {
            return false;
        });
        const event = jasmine.createSpyObj('MouseEvent', ['preventDefault']);
        const onResizeWidth = spyOn(resizeServiceStub, 'onResizeWidth').and.callFake(() => {
            return;
        });
        const onResizeHeight = spyOn(resizeServiceStub, 'onResizeHeight').and.callFake(() => {
            return;
        });
        component.onResize(event);
        expect(onResizeWidth).toHaveBeenCalled();
        expect(onResizeHeight).toHaveBeenCalled();
    });

    it('onResize should call resizeSelection of resizeService if area is selected and its resizing mode', () => {
        resizeServiceStub.isResizing = true;
        toolbarServiceSpy.isAreaSelected.and.callFake(() => {
            return true;
        });
        const event = jasmine.createSpyObj('MouseEvent', ['preventDefault']);

        component.onResize(event);
        expect(toolbarServiceSpy.resizeSelection).toHaveBeenCalled();
    });

    it('onResize should call not resizeSelection of resizeService if area is not selected and its not resizing mode', () => {
        resizeServiceStub.isResizing = false;
        toolbarServiceSpy.isAreaSelected.and.callFake(() => {
            return false;
        });
        const event = jasmine.createSpyObj('MouseEvent', ['preventDefault']);

        component.onResize(event);
        expect(toolbarServiceSpy.resizeSelection).not.toHaveBeenCalled();
    });

    it('onResizeStart should set mouseDown of toolbar to true and call onResizeStart of resizeService on mouse left', () => {
        toolbarServiceSpy.mouseDown = false;
        const leftMouseClickEvent = { button: 0 } as MouseEvent;
        const onResizeStart = spyOn(resizeServiceStub, 'onResizeStart').and.callFake(() => {
            return;
        });
        component.onResizeStart(leftMouseClickEvent, ControlPoint.BottomCenter);
        expect(toolbarServiceSpy.mouseDown).toEqual(true);
        expect(onResizeStart).toHaveBeenCalled();
    });

    it('onResizeStart should set mouseDown of toolbar to true and call onResizeStart of resizeService on mouse right', () => {
        toolbarServiceSpy.mouseDown = false;
        const rightMouseClickEvent = { button: 1 } as MouseEvent;
        const onResizeStart = spyOn(resizeServiceStub, 'onResizeStart').and.callFake(() => {
            return;
        });
        component.onResizeStart(rightMouseClickEvent, ControlPoint.BottomCenter);
        expect(toolbarServiceSpy.mouseDown).toEqual(false);
        expect(onResizeStart).not.toHaveBeenCalled();
    });

    it('should update drawing container sizes when dimensionsUpdatedEvent is notified', () => {
        // tslint:disable:no-string-literal / reason : access private members
        component['automaticSavingService'].clearStorage();
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

    it('isResizing should return isResizing of resizeService', () => {
        expect(component.isResizing()).toEqual(resizeServiceStub.isResizing);
    });

    it('onBaseCanvasMouseDown should call resetSelection of toolbar and onMouseDown when area is selected', () => {
        spyOn(component, 'isAreaSelected').and.callFake(() => {
            return true;
        });
        const onMouseDown = spyOn(component, 'onMouseDown').and.callFake(() => {
            return true;
        });
        component.onBaseCanvasMouseDown(mouseEvent);
        expect(toolbarServiceSpy.resetSelection).toHaveBeenCalled();
        expect(onMouseDown).toHaveBeenCalledWith(mouseEvent);
    });

    it('onBaseCanvasMouseDown should not call resetSelection of toolbar and onMouseDown when area is not selected', () => {
        spyOn(component, 'isAreaSelected').and.callFake(() => {
            return false;
        });
        const onMouseDown = spyOn(component, 'onMouseDown').and.callFake(() => {
            return true;
        });
        component.onBaseCanvasMouseDown(mouseEvent);
        expect(toolbarServiceSpy.resetSelection).not.toHaveBeenCalled();
        expect(onMouseDown).not.toHaveBeenCalled();
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

    it('ControlPoint should return type ControlPoint', () => {
        expect(component.ControlPoint).toEqual(ControlPoint);
    });

    // tslint:disable-next-line: max-file-line-count / reason: test file
});
