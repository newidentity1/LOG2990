import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSliderModule } from '@angular/material/slider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogMock } from '@app/classes/mat-dialog-test-helper';
import { SidebarComponent } from '@app/components/sidebar/sidebar.component';
import { KeyShortcut } from '@app/enums/key-shortcuts.enum';
import { ShortcutService } from '@app/services/shortcut/shortcut.service';
import { ToolbarService } from '@app/services/toolbar/toolbar.service';
import { BrushService } from '@app/services/tools/brush/brush.service';
import { PencilService } from '@app/services/tools/pencil/pencil-service';
import { RectangleService } from '@app/services/tools/rectangle/rectangle.service';
import { EditorComponent } from './editor.component';

describe('EditorComponent', () => {
    let component: EditorComponent;
    let fixture: ComponentFixture<EditorComponent>;
    let toolbarServiceMock: ToolbarService;
    let pencilServiceSpy: jasmine.SpyObj<PencilService>;
    let brushServiceSpy: jasmine.SpyObj<BrushService>;
    let rectangleServiceSpy: jasmine.SpyObj<RectangleService>;
    let shortcutService: ShortcutService;

    beforeEach(async(() => {
        toolbarServiceMock = jasmine.createSpyObj('ToolbarService', ['onKeyDown', 'onKeyPress', 'onKeyUp', 'changeTool']);

        pencilServiceSpy = jasmine.createSpyObj('PencilService', ['resetContext']);
        brushServiceSpy = jasmine.createSpyObj('BrushService', ['resetContext']);
        rectangleServiceSpy = jasmine.createSpyObj('RectangleService', ['resetContext']);

        TestBed.configureTestingModule({
            declarations: [EditorComponent],
            imports: [MatIconModule, MatTooltipModule, MatSidenavModule, BrowserAnimationsModule, MatSliderModule],
            providers: [
                { provide: MatDialog, useClass: MatDialogMock },
                { provide: ToolbarService, useValue: toolbarServiceMock },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();

        toolbarServiceMock = TestBed.inject(ToolbarService);

        // adding a few shortcuts
        toolbarServiceMock.keyShortcuts = new Map();
        toolbarServiceMock.keyShortcuts
            .set(KeyShortcut.Pencil, pencilServiceSpy)
            .set(KeyShortcut.Brush, brushServiceSpy)
            .set(KeyShortcut.Rectangle, rectangleServiceSpy);

        shortcutService = TestBed.inject(ShortcutService);
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EditorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
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

    it('initializeShortcuts should call addShortcut of shortcut service', () => {
        // tslint:disable-next-line:no-any / reason spying on function
        const addShortcutSpy = spyOn<any>(shortcutService, 'addShortcut').and.callThrough();
        component.initializeShortcuts();
        expect(addShortcutSpy).toHaveBeenCalled();
    });

    it('tool shortcut should call changeTool of toolbar service', () => {
        const shortcutEvent = new KeyboardEvent('keydown', { key: KeyShortcut.Pencil });
        document.dispatchEvent(shortcutEvent);
        expect(toolbarServiceMock.changeTool).toHaveBeenCalledWith(pencilServiceSpy);
    });

    it('tool shortcut should call createNewDrawing of SidebarComponent', () => {
        // tslint:disable-next-line:no-empty / reason: creating mock component
        component.toolbarRef = { createNewDrawing: () => {} } as SidebarComponent;
        // tslint:disable-next-line:no-any / reason: spying on mock component function
        const createNewDrawingSpy = spyOn<any>(component.toolbarRef, 'createNewDrawing').and.callThrough();
        const shortcutEvent = new KeyboardEvent('keydown', { key: 'control.o' });
        document.dispatchEvent(shortcutEvent);
        expect(createNewDrawingSpy).toHaveBeenCalled();
    });
});
