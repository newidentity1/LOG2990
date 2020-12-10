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
import { EyedropperService } from '@app/services/tools/eyedropper/eyedropper.service';
import { PencilService } from '@app/services/tools/pencil/pencil.service';
import { RectangleService } from '@app/services/tools/rectangle/rectangle.service';
import { SidebarComponent } from './sidebar.component';

describe('SidebarComponent', () => {
    let component: SidebarComponent;
    let fixture: ComponentFixture<SidebarComponent>;
    let toolbarServiceMock: jasmine.SpyObj<ToolbarService>;
    let pencilToolMock: jasmine.SpyObj<PencilService>;
    let eyedropperToolMock: jasmine.SpyObj<EyedropperService>;

    beforeEach(async(() => {
        toolbarServiceMock = jasmine.createSpyObj('ToolbarService', ['getTools', 'applyCurrentTool', 'initializeColors', 'changeTool']);
        pencilToolMock = jasmine.createSpyObj('PencilService', ['resetContext']);
        eyedropperToolMock = jasmine.createSpyObj('EyedropperService', ['resetContext']);

        TestBed.configureTestingModule({
            declarations: [SidebarComponent],
            imports: [MatIconModule, MatTooltipModule, MatSidenavModule, BrowserAnimationsModule, MatSliderModule],
            providers: [
                { provide: MatDialog, useValue: {} },
                { provide: ToolbarService, useValue: toolbarServiceMock },
                { provide: PencilService, useValue: pencilToolMock },
                { provide: EyedropperService, useValue: eyedropperToolMock },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();

        toolbarServiceMock = TestBed.inject(ToolbarService) as jasmine.SpyObj<ToolbarService>;
        pencilToolMock = TestBed.inject(PencilService) as jasmine.SpyObj<PencilService>;
        eyedropperToolMock = TestBed.inject(EyedropperService) as jasmine.SpyObj<EyedropperService>;

        toolbarServiceMock.currentTool = pencilToolMock;
        // tslint:disable-next-line:no-string-literal / reason : access private members
        toolbarServiceMock['tools'] = [pencilToolMock, eyedropperToolMock];
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

    it('onToolChanged should call resetContext of currentTool change the currentTool, call applyCurrentTool of toolbarService and open the MatSideNav if the parameter is not the currentTool', () => {
        const anotherTool = new RectangleService(new DrawingService());
        toolbarServiceMock.currentTool = pencilToolMock;
        const spySideNav = spyOn(component.sidenavProperties, 'open');
        component.onToolChanged(anotherTool);
        expect(toolbarServiceMock.changeTool).toHaveBeenCalled();
        expect(spySideNav).toHaveBeenCalled();
    });

    it('onToolChanged should not call changeTool and open the MatSideNav if the parameter is same as currentTool', () => {
        toolbarServiceMock.currentTool = pencilToolMock;
        const spySideNav = spyOn(component.sidenavProperties, 'open');
        component.onToolChanged(pencilToolMock);
        expect(toolbarServiceMock.changeTool).not.toHaveBeenCalled();
        expect(spySideNav).not.toHaveBeenCalled();
    });

    it('createNewDrawing should call the createNewDrawing of the CreateNewDrawingComponent child', () => {
        const spyNewDrawingChild = jasmine.createSpyObj('CreateNewDrawingComponent', ['createNewDrawing']);
        component.newDrawingRef = spyNewDrawingChild;
        component.createNewDrawing();
        expect(spyNewDrawingChild.createNewDrawing).toHaveBeenCalled();
    });

    it('exportDrawing should call the exportDrawing of the ExportDrawingComponent child', () => {
        const spyExportDrawingChild = jasmine.createSpyObj('ExportDrawingComponent', ['exportDrawing']);
        component.exportRef = spyExportDrawingChild;
        component.exportDrawing();
        expect(spyExportDrawingChild.exportDrawing).toHaveBeenCalled();
    });

    it('openGallery should call the openDialog of the GalleryComponent child', () => {
        const spyGallery = jasmine.createSpyObj('GalleryComponent', ['openDialog']);
        component.galleryRef = spyGallery;
        component.openGallery();
        expect(spyGallery.openDialog).toHaveBeenCalled();
    });

    it('Upload should call uploadImage', () => {
        const spyUplaod = jasmine.createSpyObj('UploadComponent', ['uploadImage']);
        component.uploadRef = spyUplaod;
        component.uploadImage();
        expect(spyUplaod.uploadImage).toHaveBeenCalled();
    });

    it('get currentTool should return the current tool of toolbarService', () => {
        toolbarServiceMock.currentTool = pencilToolMock;
        const currentTool = toolbarServiceMock.currentTool;
        expect(component.currentTool).toEqual(currentTool);
    });

    it('onTextPropertyChange should emit requesCanvasFocus', () => {
        const emitSpy = spyOn(component.requestCanvasFocus, 'emit');
        component.onTextPropertyChange();
        expect(emitSpy).toHaveBeenCalled();
    });
});
