import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SVGFilterComponent } from '@app/components/svgfilter/svgfilter.component';
import { DEFAULT_HEIGHT, DEFAULT_WIDTH } from '@app/constants/constants';
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
        toolbarServiceSpy = jasmine.createSpyObj('ToolbarService', ['onMouseMove', 'onMouseDown', 'onMouseUp', 'setColors']);

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

    it(' should not call the toolbarService onMouse when receiving a mouseMove and a mouseDown event if isResizingWidth or isResizingHeight', () => {
        const event = {} as MouseEvent;
        component.isResizingHeight = true;
        component.onMouseDown(event);
        component.onMouseMove(event);
        expect(toolbarServiceSpy.onMouseDown).not.toHaveBeenCalled();
        expect(toolbarServiceSpy.onMouseMove).not.toHaveBeenCalled();
    });
});
