import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SVGFilterComponent } from '@app/components/tools-options/brush/svgfilter/svgfilter.component';
import { CANVAS_MARGIN_LEFT, CANVAS_MARGIN_TOP, CANVAS_MIN_HEIGHT, CANVAS_MIN_WIDTH } from '@app/constants/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ToolbarService } from '@app/services/toolbar/toolbar.service';
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
            'initializeColors',
        ]);

        TestBed.configureTestingModule({
            declarations: [DrawingComponent, SVGFilterComponent],
            providers: [
                { provide: DrawingService, useValue: drawingServiceStub },
                { provide: ToolbarService, useValue: toolbarServiceSpy },
            ],
        }).compileComponents();
        toolbarServiceSpy = TestBed.inject(ToolbarService) as jasmine.SpyObj<ToolbarService>;

        // tslint:disable-next-line:no-empty / reason: mocking mouse event
        mouseEvent = { preventDefault: () => {} } as MouseEvent;
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DrawingComponent);
        component = fixture.componentInstance;
        component.dimensionsUpdatedEvent = dimensionsUpdatedSubjectStub.asObservable();
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have the value of half the drawingContainer', () => {
        const fakeDrawingContainerHeight = 2 * CANVAS_MIN_HEIGHT + 2;
        const fakeDrawingContainerWidth = 2 * CANVAS_MIN_WIDTH + 2;
        component.drawingContainerHeight = fakeDrawingContainerHeight;
        component.drawingContainerWidth = fakeDrawingContainerWidth;
        const expectWidth = fakeDrawingContainerWidth / 2;
        const expectHeight = fakeDrawingContainerHeight / 2;
        component.ngAfterContentInit();
        expect(component.height).toEqual(expectHeight);
        expect(component.width).toEqual(expectWidth);
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

    it(' should not call the toolbarService onMouse when receiving a mouseMove if isResizingWidth or isResizingHeight', () => {
        component.isResizingHeight = true;
        component.onMouseMove(mouseEvent);
        expect(toolbarServiceSpy.onMouseMove).not.toHaveBeenCalled();

        component.isResizingHeight = false;
        component.isResizingWidth = true;
        component.onMouseMove(mouseEvent);
        expect(toolbarServiceSpy.onMouseMove).not.toHaveBeenCalled();
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

    it('onResize should set the width of preview canvas if its above or equal CANVAS_MIN_WIDTH and below width limit', () => {
        component.isResizingWidth = true;
        const limitX = component.baseCanvas.nativeElement.getBoundingClientRect().x;
        component.drawingContainerWidth = CANVAS_MARGIN_LEFT;
        const event = jasmine.createSpyObj('MouseEvent', ['preventDefault']);
        event.clientX = CANVAS_MIN_WIDTH + limitX;
        component.drawingContainerWidth = CANVAS_MIN_WIDTH + CANVAS_MARGIN_LEFT;
        component.onResize(event);
        expect(component.previewCanvas.nativeElement.width).toEqual(CANVAS_MIN_WIDTH);
    });

    it('onResize should set the height of preview canvas if its above or equal CANVAS_MIN_HEIGHT and below height limit', () => {
        component.isResizingHeight = true;
        const limitY = component.baseCanvas.nativeElement.getBoundingClientRect().y;
        component.drawingContainerHeight = CANVAS_MARGIN_TOP;
        const event = jasmine.createSpyObj('MouseEvent', ['preventDefault']);
        event.clientY = CANVAS_MIN_HEIGHT + limitY;
        component.drawingContainerHeight = CANVAS_MIN_HEIGHT + CANVAS_MARGIN_TOP;
        component.onResize(event);
        expect(component.previewCanvas.nativeElement.height).toEqual(CANVAS_MIN_HEIGHT);
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

    it('onResize should not set the width of preview canvas if its not between CANVAS_MIN_WIDTH and width limit', () => {
        component.isResizingWidth = true;
        component.previewCanvas.nativeElement.width = 0;
        const limitX = component.baseCanvas.nativeElement.getBoundingClientRect().x;
        const event = jasmine.createSpyObj('MouseEvent', ['preventDefault']);
        event.clientX = CANVAS_MIN_WIDTH + limitX + 1; // width = CANVAS_MIN_WIDTH + 1
        component.drawingContainerWidth = CANVAS_MIN_WIDTH + CANVAS_MARGIN_LEFT; // width limit = CANVAS_MIN_WIDTH
        const expectResult = component.previewCanvas.nativeElement.width;
        component.onResize(event);
        expect(component.previewCanvas.nativeElement.width).toEqual(expectResult);
    });

    it('onResize should not set the height of preview canvas if its not between CANVAS_MIN_HEIGHT and height limit', () => {
        component.isResizingHeight = true;
        component.previewCanvas.nativeElement.height = 0;
        const limitY = component.baseCanvas.nativeElement.getBoundingClientRect().y;
        const event = jasmine.createSpyObj('MouseEvent', ['preventDefault']);
        event.clientY = CANVAS_MIN_HEIGHT + limitY + 1; // height = CANVAS_MIN_HEIGHT + 1
        component.drawingContainerHeight = CANVAS_MIN_HEIGHT + CANVAS_MARGIN_TOP; // height limit = CANVAS_MIN_HEIGHT
        const expectResult = component.previewCanvas.nativeElement.height;
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
        dimensionsUpdatedSubjectStub.next([width, height]);
        expect(component.drawingContainerWidth).toEqual(width);
        expect(component.drawingContainerHeight).toEqual(height);
    });
});
