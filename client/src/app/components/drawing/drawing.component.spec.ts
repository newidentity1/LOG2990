import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SVGFilterComponent } from '@app/components/svgfilter/svgfilter.component';
import { CANVAS_MIN_HEIGHT, CANVAS_MIN_WIDTH } from '@app/constants/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ToolbarService } from '@app/services/toolbar/toolbar.service';
import { of } from 'rxjs';
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
            'setColors',
            'createNewDrawingEventListener',
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
        component.dimensionsUpdatedEvent = of();
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
        const height = component.height;
        const width = component.width;
        expect(height).toEqual(expectHeight);
        expect(width).toEqual(expectWidth);
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

    it(' should not call the toolbarService onMouse when receiving a mouseMove and a mouseDown event if isResizingWidth or isResizingHeight', () => {
        const event = {} as MouseEvent;
        component.isResizingHeight = true;
        component.onMouseDown(event);
        component.onMouseMove(event);
        expect(toolbarServiceSpy.onMouseDown).not.toHaveBeenCalled();
        expect(toolbarServiceSpy.onMouseMove).not.toHaveBeenCalled();
    });
});
