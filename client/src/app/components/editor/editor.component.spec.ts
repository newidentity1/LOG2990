import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSliderModule } from '@angular/material/slider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToolbarService } from '@app/services/toolbar/toolbar.service';
import { EditorComponent } from './editor.component';

describe('EditorComponent', () => {
    let component: EditorComponent;
    let fixture: ComponentFixture<EditorComponent>;
    let toolbarServiceMock: ToolbarService;

    beforeEach(async(() => {
        toolbarServiceMock = jasmine.createSpyObj('ToolbarService', ['onKeyDown', 'onKeyPress', 'onKeyUp', 'initializeColors']);

        TestBed.configureTestingModule({
            declarations: [EditorComponent],
            imports: [MatIconModule, MatTooltipModule, MatSidenavModule, BrowserAnimationsModule, MatSliderModule],
            providers: [
                { provide: MatDialog, useValue: {} },
                { provide: ToolbarService, useValue: toolbarServiceMock },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();

        toolbarServiceMock = TestBed.inject(ToolbarService);
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EditorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should call the toolbar onKeyDown when receiving a keyboard event and should not call createNewDrawing event if not ctrl', () => {
        const eventSpy = jasmine.createSpyObj('KeyboardEvent', ['preventDefault']);
        eventSpy.key = '1';
        const spyToolbar = jasmine.createSpyObj('SidebarComponent', ['createNewDrawing']);
        component.toolbarRef = spyToolbar;

        component.onKeyDown(eventSpy);
        expect(eventSpy.preventDefault).toHaveBeenCalled();
        expect(spyToolbar.createNewDrawing).not.toHaveBeenCalled();
        expect(toolbarServiceMock.onKeyDown).toHaveBeenCalled();
        expect(toolbarServiceMock.onKeyDown).toHaveBeenCalledWith(eventSpy);
        expect(component.isCtrlDown).toEqual(false);
    });

    it('should call the toolbar onKeyDown when receiving a keyboard event and should set isCtrlDown to true if event is ctrl', () => {
        const eventSpy = jasmine.createSpyObj('KeyboardEvent', ['preventDefault']);
        eventSpy.key = 'Control';
        const spyToolbar = jasmine.createSpyObj('SidebarComponent', ['createNewDrawing']);
        component.toolbarRef = spyToolbar;

        component.onKeyDown(eventSpy);
        expect(eventSpy.preventDefault).toHaveBeenCalled();
        expect(spyToolbar.createNewDrawing).not.toHaveBeenCalled();
        expect(toolbarServiceMock.onKeyDown).toHaveBeenCalled();
        expect(toolbarServiceMock.onKeyDown).toHaveBeenCalledWith(eventSpy);
        expect(component.isCtrlDown).toEqual(true);
    });

    it('should call the toolbar onKeyDown when receiving a keyboard event and should set call createNewDrawing of child if ctrl+o happened', () => {
        const eventSpy = jasmine.createSpyObj('KeyboardEvent', ['preventDefault']);
        const spyToolbar = jasmine.createSpyObj('SidebarComponent', ['createNewDrawing']);
        component.toolbarRef = spyToolbar;

        eventSpy.key = 'Control';
        component.onKeyDown(eventSpy);
        expect(eventSpy.preventDefault).toHaveBeenCalled();
        expect(spyToolbar.createNewDrawing).not.toHaveBeenCalled();
        expect(toolbarServiceMock.onKeyDown).toHaveBeenCalled();
        expect(toolbarServiceMock.onKeyDown).toHaveBeenCalledWith(eventSpy);
        expect(component.isCtrlDown).toEqual(true);

        eventSpy.key = 'o';
        component.onKeyDown(eventSpy);
        expect(eventSpy.preventDefault).toHaveBeenCalled();
        expect(spyToolbar.createNewDrawing).toHaveBeenCalled();
        expect(toolbarServiceMock.onKeyDown).toHaveBeenCalled();
        expect(toolbarServiceMock.onKeyDown).toHaveBeenCalledWith(eventSpy);
        expect(component.isCtrlDown).toEqual(false);
    });

    it('should call the toolbar onKeyDown when receiving a keyboard event and event is not ctrl', () => {
        const eventSpy = jasmine.createSpyObj('KeyboardEvent', ['preventDefault']);
        eventSpy.key = '1';
        component.onKeyDown(eventSpy);
        expect(eventSpy.preventDefault).toHaveBeenCalled();
        expect(toolbarServiceMock.onKeyDown).toHaveBeenCalled();
        expect(toolbarServiceMock.onKeyDown).toHaveBeenCalledWith(eventSpy);
        expect(component.isCtrlDown).toEqual(false);
    });
    it('should call the toolbar onKeyDown when receiving a keyboard event', () => {
        const eventSpy = jasmine.createSpyObj('KeyboardEvent', ['preventDefault']);
        component.onKeyDown(eventSpy);
        expect(eventSpy.preventDefault).toHaveBeenCalled();
        expect(toolbarServiceMock.onKeyDown).toHaveBeenCalled();
        expect(toolbarServiceMock.onKeyDown).toHaveBeenCalledWith(eventSpy);
    });

    it('should call the toolbar onKeyPress when receiving a keyboard event', () => {
        const eventSpy = jasmine.createSpyObj('KeyboardEvent', ['preventDefault']);
        component.onKeyPress(eventSpy);
        expect(eventSpy.preventDefault).toHaveBeenCalled();
        expect(toolbarServiceMock.onKeyPress).toHaveBeenCalled();
        expect(toolbarServiceMock.onKeyPress).toHaveBeenCalledWith(eventSpy);
    });

    it('should call the toolbar onKeyUp when receiving a keyboard event', () => {
        const eventSpy = jasmine.createSpyObj('KeyboardEvent', ['preventDefault']);
        component.onKeyUp(eventSpy);
        expect(eventSpy.preventDefault).toHaveBeenCalled();
        expect(toolbarServiceMock.onKeyUp).toHaveBeenCalled();
        expect(toolbarServiceMock.onKeyUp).toHaveBeenCalledWith(eventSpy);
    });
});
