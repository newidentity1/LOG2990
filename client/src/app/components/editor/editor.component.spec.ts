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
import { SelectionType } from '@app/enums/selection-type.enum';
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
        toolbarServiceMock = jasmine.createSpyObj('ToolbarService', [
            'onKeyDown',
            'onKeyUp',
            'changeTool',
            'changeSelectionTool',
            'triggerSelectAll',
            'undo',
            'redo',
        ]);

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

    it('should call initializeShortcuts', () => {
        // tslint:disable-next-line: no-any / reason: spy on private function
        const spyInitializeShortcuts = spyOn<any>(component, 'initializeShortcuts');
        component.ngOnInit();
        expect(spyInitializeShortcuts).toHaveBeenCalled();
    });

    it('should call computeDimensionsDrawingContainer with parameter true', () => {
        const spyComputeDims = spyOn(component, 'computeDimensionsDrawingContainer');
        const delay = 1000;
        jasmine.clock().install();
        component.ngAfterViewInit();
        jasmine.clock().tick(delay);
        expect(spyComputeDims).toHaveBeenCalledWith(true);
        jasmine.clock().uninstall();
    });

    it('should call the toolbar onKeyUp when receiving a keyboard event', () => {
        const eventSpy = jasmine.createSpyObj('KeyboardEvent', ['preventDefault']);
        component.onKeyUp(eventSpy);
        expect(eventSpy.preventDefault).toHaveBeenCalled();
        expect(toolbarServiceMock.onKeyUp).toHaveBeenCalled();
        expect(toolbarServiceMock.onKeyUp).toHaveBeenCalledWith(eventSpy);
    });

    it('should call the computeDimensionsDrawingContainer with parameter false when receiving a resize event', () => {
        const spyComputeDims = spyOn(component, 'computeDimensionsDrawingContainer');
        component.onResize();
        expect(spyComputeDims).toHaveBeenCalledWith(false);
    });

    it('initializeShortcuts should call addShortcut of shortcut service', () => {
        const addShortcutSpy = spyOn(shortcutService, 'addShortcut').and.callThrough();
        // tslint:disable-next-line:no-string-literal / reason: calling private function
        component['initializeShortcuts']();
        expect(addShortcutSpy).toHaveBeenCalled();
    });

    it('tool shortcut should call changeTool of toolbar service', () => {
        const shortcutEvent = new KeyboardEvent('keydown', { key: KeyShortcut.Pencil });
        document.dispatchEvent(shortcutEvent);
        expect(toolbarServiceMock.changeTool).toHaveBeenCalledWith(pencilServiceSpy);
    });

    it('rectangle selection tool shortcut should call changeSelectionTool of toolbar service', () => {
        const shortcutEvent = new KeyboardEvent('keydown', { key: KeyShortcut.RectangleSelect });
        document.dispatchEvent(shortcutEvent);
        expect(toolbarServiceMock.changeSelectionTool).toHaveBeenCalledWith(SelectionType.RectangleSelection);
    });

    it('ellipse selection tool shortcut should call changeSelectionTool of toolbar service', () => {
        const shortcutEvent = new KeyboardEvent('keydown', { key: KeyShortcut.EllipseSelect });
        document.dispatchEvent(shortcutEvent);
        expect(toolbarServiceMock.changeSelectionTool).toHaveBeenCalledWith(SelectionType.EllipseSelection);
    });

    it('tool shortcut should call createNewDrawing of SidebarComponent', () => {
        // tslint:disable-next-line:no-empty / reason: creating mock component
        component.toolbarRef = { createNewDrawing: () => {} } as SidebarComponent;
        const createNewDrawingSpy = spyOn(component.toolbarRef, 'createNewDrawing').and.callThrough();
        const shortcutEvent = new KeyboardEvent('keydown', { key: 'control.o' });
        document.dispatchEvent(shortcutEvent);
        expect(createNewDrawingSpy).toHaveBeenCalled();
    });

    it('tool shortcut should call createNewDrawing of SidebarComponent', () => {
        // tslint:disable-next-line:no-empty / reason: creating mock component
        component.toolbarRef = { openGallery: () => {} } as SidebarComponent;
        // tslint:disable-next-line:no-any / reason: spying on mock component function
        const openGallerySpy = spyOn<any>(component.toolbarRef, 'openGallery').and.callThrough();
        const shortcutEvent = new KeyboardEvent('keydown', { key: 'control.g' });
        document.dispatchEvent(shortcutEvent);
        expect(openGallerySpy).toHaveBeenCalled();
    });

    it('tool shortcut should call createNewDrawing of SidebarComponent', () => {
        // tslint:disable-next-line:no-empty / reason: creating mock component
        component.toolbarRef = { uploadImage: () => {} } as SidebarComponent;
        // tslint:disable-next-line:no-any / reason: spying on mock component function
        const uploadImageSpy = spyOn<any>(component.toolbarRef, 'uploadImage').and.callThrough();
        const shortcutEvent = new KeyboardEvent('keydown', { key: 'control.s' });
        document.dispatchEvent(shortcutEvent);
        expect(uploadImageSpy).toHaveBeenCalled();
    });

    it('tool shortcut should call exportDrawing of SidebarComponent', () => {
        // tslint:disable-next-line:no-empty / reason: creating mock component
        component.toolbarRef = { exportDrawing: () => {} } as SidebarComponent;

        const createNewDrawingSpy = spyOn(component.toolbarRef, 'exportDrawing').and.callThrough();
        const shortcutEvent = new KeyboardEvent('keydown', { key: 'control.e' });
        document.dispatchEvent(shortcutEvent);
        expect(createNewDrawingSpy).toHaveBeenCalled();
    });

    it('select all shortcut should call triggerSelectAll of toolbar service', () => {
        const shortcutEvent = new KeyboardEvent('keydown', { key: 'control.a' });
        document.dispatchEvent(shortcutEvent);
        expect(toolbarServiceMock.triggerSelectAll).toHaveBeenCalled();
    });

    it('tool shortcut should call undo of toolbar service', () => {
        const shortcutEvent = new KeyboardEvent('keydown', { key: 'control.z' });
        document.dispatchEvent(shortcutEvent);
        expect(toolbarServiceMock.undo).toHaveBeenCalled();
    });

    it('tool shortcut should call undo of toolbar service', () => {
        const shortcutEvent = new KeyboardEvent('keydown', { key: 'control.shift.z' });
        document.dispatchEvent(shortcutEvent);
        expect(toolbarServiceMock.redo).toHaveBeenCalled();
    });

    it('keydown event should call onKeyDown of toolbar', () => {
        const shortcutEvent = new KeyboardEvent('keydown', { key: 'Escape' });
        document.dispatchEvent(shortcutEvent);
        expect(toolbarServiceMock.onKeyDown).toHaveBeenCalledWith(shortcutEvent);
    });
});
