import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSliderModule } from '@angular/material/slider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ToolbarService } from '@app/services/toolbar/toolbar.service';
import { PencilService } from '@app/services/tools/pencil/pencil-service';
import { RectangleService } from '@app/services/tools/rectangle/rectangle.service';
import { SidebarComponent } from './sidebar.component';

describe('SidebarComponent', () => {
    let component: SidebarComponent;
    let fixture: ComponentFixture<SidebarComponent>;
    let toolbarServiceMock: jasmine.SpyObj<ToolbarService>;
    let pencilToolMock: jasmine.SpyObj<PencilService>;

    beforeEach(async(() => {
        toolbarServiceMock = jasmine.createSpyObj('ToolbarService', ['getTools', 'applyCurrentToolColor']);
        pencilToolMock = jasmine.createSpyObj('PencilService', ['resetContext']);

        TestBed.configureTestingModule({
            declarations: [SidebarComponent],
            imports: [MatIconModule, MatTooltipModule, MatSidenavModule, BrowserAnimationsModule, MatSliderModule],
            providers: [
                { provide: MatDialog, useValue: {} },
                { provide: ToolbarService, useValue: toolbarServiceMock },
                { provide: PencilService, useValue: pencilToolMock },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();

        toolbarServiceMock = TestBed.inject(ToolbarService) as jasmine.SpyObj<ToolbarService>;
        pencilToolMock = TestBed.inject(PencilService) as jasmine.SpyObj<PencilService>;
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SidebarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('isCurrentTool should return true if the parameter is the currentTool', () => {
        toolbarServiceMock.currentTool = pencilToolMock;
        const currentTool = toolbarServiceMock.currentTool;
        const result = component.isCurrentTool(currentTool);
        expect(result).toEqual(true);
    });

    it('isCurrentTool should return false if the parameter is not the currentTool', () => {
        const anotherTool = new RectangleService(new DrawingService());
        toolbarServiceMock.currentTool = pencilToolMock;
        const result = component.isCurrentTool(anotherTool);
        expect(result).toEqual(false);
    });

    it('onToolChanged should call resetContext of currentTool change the currentTool, call applyCurrentToolColor of toolbarService and open the MatSideNav if the parameter is not the currentTool', () => {
        const anotherTool = new RectangleService(new DrawingService());
        toolbarServiceMock.currentTool = pencilToolMock;
        const spySideNav = spyOn(component.sidenavProperties, 'open');
        component.onToolChanged(anotherTool);
        expect(pencilToolMock.resetContext).toHaveBeenCalled();
        expect(toolbarServiceMock.currentTool).toEqual(anotherTool);
        expect(toolbarServiceMock.applyCurrentToolColor).toHaveBeenCalled();
        expect(spySideNav).toHaveBeenCalled();
    });

    it('onToolChanged should toggle the MatSideNav if the parameter is not the currentTool', () => {
        toolbarServiceMock.currentTool = pencilToolMock;
        const currentTool = pencilToolMock;
        const spySideNav = spyOn(component.sidenavProperties, 'toggle');
        component.onToolChanged(currentTool);
        expect(spySideNav).toHaveBeenCalled();
    });

    it('createNewDrawing should call the createNewDrawing of the CreateNewDrawingComponent child', () => {
        const spyNewDrawingChild = jasmine.createSpyObj('CreateNewDrawingComponent', ['createNewDrawing']);
        component.newDrawingRef = spyNewDrawingChild;
        component.createNewDrawing();
        expect(spyNewDrawingChild.createNewDrawing).toHaveBeenCalled();
    });

    it('get currentTool should return the current tool of toolbarService', () => {
        toolbarServiceMock.currentTool = pencilToolMock;
        const currentTool = toolbarServiceMock.currentTool;
        expect(component.currentTool).toEqual(currentTool);
    });

    it('set currentTool should set the current tool of toolbarService', () => {
        const currentTool = pencilToolMock;
        component.currentTool = currentTool;
        expect(toolbarServiceMock.currentTool).toEqual(currentTool);
    });
});
