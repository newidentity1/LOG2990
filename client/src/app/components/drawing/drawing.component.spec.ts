import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SVGFilterComponent } from '@app/components/svgfilter/svgfilter.component';
import { CANVAS_MARGIN_LEFT, CANVAS_MARGIN_TOP, CANVAS_MIN_HEIGHT, CANVAS_MIN_WIDTH, DEFAULT_HEIGHT, DEFAULT_WIDTH } from '@app/constants/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ToolbarService } from '@app/services/toolbar/toolbar.service';
import { DrawingComponent } from './drawing.component';

describe('DrawingComponent', () => {
    let component: DrawingComponent;
    let fixture: ComponentFixture<DrawingComponent>;
    let drawingServiceStub: DrawingService;
    let toolbarServiceSpy: jasmine.SpyObj<ToolbarService>;

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
        ]);

        TestBed.configureTestingModule({
            declarations: [DrawingComponent, SVGFilterComponent],
            providers: [
                { provide: DrawingService, useValue: drawingServiceStub },
                { provide: ToolbarService, useValue: toolbarServiceSpy },
            ],
        }).compileComponents();
        toolbarServiceSpy = TestBed.inject(ToolbarService) as jasmine.SpyObj<ToolbarService>;
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DrawingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have a default WIDTH and HEIGHT', () => {
        const height = component.height;
        const width = component.width;
        expect(height).toEqual(DEFAULT_HEIGHT);
        expect(width).toEqual(DEFAULT_WIDTH);
    });

    it(' onMouseMove should call toolbarService onMouseMove when receiving a mouse event', () => {
        const event = {} as MouseEvent;
        component.onMouseMove(event);
        expect(toolbarServiceSpy.onMouseMove).toHaveBeenCalled();
        expect(toolbarServiceSpy.onMouseMove).toHaveBeenCalledWith(event);
    });

    it('  onMouseDown should call toolbarService onMouseDown when receiving a mouse event', () => {
        const event = {} as MouseEvent;
        component.onMouseDown(event);
        expect(toolbarServiceSpy.onMouseDown).toHaveBeenCalled();
        expect(toolbarServiceSpy.onMouseDown).toHaveBeenCalledWith(event);
    });

    it('  onMouseUp should call toolbarService onMouseUp when receiving a mouse event', () => {
        const event = {} as MouseEvent;
        component.onMouseUp(event);
        expect(toolbarServiceSpy.onMouseUp).toHaveBeenCalled();
        expect(toolbarServiceSpy.onMouseUp).toHaveBeenCalledWith(event);
    });

    it(' should not call the toolbarService onMouse when receiving a mouseMove if isResizingWidth or isResizingHeight', () => {
        const event = {} as MouseEvent;
        component.isResizingHeight = true;
        component.onMouseMove(event);
        expect(toolbarServiceSpy.onMouseMove).not.toHaveBeenCalled();

        component.isResizingHeight = false;
        component.isResizingWidth = true;
        component.onMouseMove(event);
        expect(toolbarServiceSpy.onMouseMove).not.toHaveBeenCalled();
    });

    it(' should not call the toolbarService onMouse when receiving a mouseDown if isResizingWidth or isResizingHeight', () => {
        const event = {} as MouseEvent;
        component.isResizingHeight = true;
        component.onMouseDown(event);
        expect(toolbarServiceSpy.onMouseDown).not.toHaveBeenCalled();

        component.isResizingHeight = false;
        component.isResizingWidth = true;
        component.onMouseDown(event);
        expect(toolbarServiceSpy.onMouseDown).not.toHaveBeenCalled();
    });

    it(' should call the toolbarService onMouse when receiving a mouseUp if isResizingWidth and isResizingHeight are false', () => {
        const event = {} as MouseEvent;
        component.onMouseUp(event);
        expect(toolbarServiceSpy.onMouseUp).toHaveBeenCalledWith(event);
    });

    it('onMouseUp should change width of base canvas when isResizingWidth is true', () => {
        const event = {} as MouseEvent;
        component.isResizingWidth = true;
        component.previewCanvas.nativeElement.width = CANVAS_MIN_WIDTH;
        // setTimeout(() => {
        component.onMouseUp(event);
        // expect(component.baseCanvas.nativeElement.width).toEqual(CANVAS_MIN_WIDTH);
        expect(component.isResizingWidth).toEqual(false);
        // }, 0);
    });

    it(' should call the toolbarService onMouseEnter when mouseEnter', () => {
        const event = {} as MouseEvent;
        component.onMouseEnter(event);
        expect(toolbarServiceSpy.onMouseEnter).toHaveBeenCalled();
    });

    it(' should call the toolbarService onMouseLeave when mouseLeave', () => {
        const event = {} as MouseEvent;
        component.onMouseLeave(event);
        expect(toolbarServiceSpy.onMouseLeave).toHaveBeenCalled();
    });

    it(' should call the toolbarService onDoubleClick when doubleClick', () => {
        const event = {} as MouseEvent;
        component.onDoubleClick(event);
        expect(toolbarServiceSpy.onDoubleClick).toHaveBeenCalled();
    });

    it(' should call the toolbarService onClick when click', () => {
        const event = {} as MouseEvent;
        component.onClick(event);
        expect(toolbarServiceSpy.onClick).toHaveBeenCalled();
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
        const mouseEvent = {} as MouseEvent;
        const spyResizeWidth = spyOn(component, 'onResizeWidthStart').and.callThrough();
        const spyResizeHeight = spyOn(component, 'onResizeHeightStart').and.callThrough();
        component.onResizeBothStart(mouseEvent);
        expect(spyResizeWidth).toHaveBeenCalledWith(mouseEvent);
        expect(spyResizeHeight).toHaveBeenCalledWith(mouseEvent);
    });
});
