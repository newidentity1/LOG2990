import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { MatDialogMock } from '@app/classes/mat-dialog-test-helper';
import { CommunicationService } from '@app/services/communication/communication.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { FireBaseService } from '@app/services/firebase/fire-base.service';
import { Drawing } from '@common/communication/drawing';
import { NgImageSliderComponent, NgImageSliderModule } from 'ng-image-slider';
import { Observable, of } from 'rxjs';
// import { Observable } from 'rxjs';
import { GalleryComponent } from './gallery.component';
// import { of } from 'rxjs';

describe('GalleryComponent', () => {
    let component: GalleryComponent;
    let fixture: ComponentFixture<GalleryComponent>;
    let drawingServiceSpy: jasmine.SpyObj<DrawingService>;
    let communicationSpy: jasmine.SpyObj<CommunicationService>;
    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let sliderSpy: jasmine.SpyObj<NgImageSliderComponent>;
    let fireBaseServiceSpy: jasmine.SpyObj<FireBaseService>;
    // let warningRefSpy: jasmine.SpyObj<MatDialogRef>;
    let fakeDrawing: Drawing;
    let dialog: MatDialog;

    beforeEach(async(() => {
        drawingServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas', 'canvasEmpty']);
        fireBaseServiceSpy = jasmine.createSpyObj('fireBaseServiceSpy', ['deleteImage']);
        communicationSpy = jasmine.createSpyObj('CommunicationService', ['deleteDrawing', 'getDrawings']);
        sliderSpy = jasmine.createSpyObj('NgImageSliderComponent', ['setSliderImages']);
        TestBed.configureTestingModule({
            declarations: [GalleryComponent, NgImageSliderComponent],
            imports: [HttpClientTestingModule, MatDialogModule, FormsModule, ReactiveFormsModule, NgImageSliderModule],
            providers: [
                { provide: DrawingService, useValue: drawingServiceSpy },
                { provide: FireBaseService, useValue: fireBaseServiceSpy },
                { provide: CommunicationService, useValue: communicationSpy },
                { provide: NgImageSliderComponent, useValue: sliderSpy },
                { provide: MatDialogRef, useValue: sliderSpy },
                { provide: MatDialog, useClass: MatDialogMock },
                { provide: MAT_DIALOG_DATA, useValue: [] },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
        dialog = TestBed.inject(MatDialog);
        drawingServiceSpy = TestBed.inject(DrawingService) as jasmine.SpyObj<DrawingService>;
        communicationSpy = TestBed.inject(CommunicationService) as jasmine.SpyObj<CommunicationService>;

        const data: Drawing[] = [];
        communicationSpy.deleteDrawing.and.returnValue(new Observable());
        communicationSpy.getDrawings.and.returnValue(of(data));
        sliderSpy.setSliderImages.and.callFake(() => {
            return;
        });
        //  component.slider = sliderSpy;
        const drawingCanvas = document.createElement('canvas');
        drawingCanvas.width = canvasTestHelper.canvas.width;
        drawingCanvas.height = canvasTestHelper.canvas.height;
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        drawingServiceSpy.baseCtx = baseCtxStub; // Jasmine doesnt copy properties with underlying data
        drawingServiceSpy.previewCtx = previewCtxStub;
        drawingServiceSpy.canvas = drawingCanvas;

        fakeDrawing = {} as Drawing;
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GalleryComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('deleteDrawing should delete the current draw', () => {
        const fakeDrawing1: Drawing = { _id: 'test', name: 'test', tags: [], url: 'test' };
        component.slider.visiableImageIndex = 0;
        component.drawings.push(fakeDrawing1);
        of(component.deleteDrawing());
        expect(fireBaseServiceSpy.deleteImage).toHaveBeenCalled();
        expect(communicationSpy.deleteDrawing).toHaveBeenCalled();
    });

    it('deleteDrawing should delete the current draw', () => {
        component.drawings.length = 0;
        component.deleteDrawing();
        expect(fireBaseServiceSpy.deleteImage).not.toHaveBeenCalled();
    });

    it('getDrawing should get all the drawing present on the server', () => {
        const spy = spyOn(component, 'transformData');
        component.getDrawings();
        expect(spy).toHaveBeenCalledWith([]);
    });

    it('transformData should call updateDrawings and set isDrawing to true', () => {
        const fakeDrawing1: Drawing = { _id: 'test', name: 'test', tags: [], url: 'test' };
        const data: Drawing[] = [];
        data.push(fakeDrawing1);
        const spy = spyOn(component, 'updateDrawings');
        // tslint:disable-next-line:no-string-literal
        component['transformData'](data);
        expect(spy).toHaveBeenCalled();
        expect(component.isDrawing).toBeTrue();
    });

    it('transformData should call updateDrawings and set isDrawing to false', () => {
        const data: Drawing[] = [];
        const spy = spyOn(component, 'updateDrawings');
        // tslint:disable-next-line:no-string-literal
        component['transformData'](data);
        expect(spy).toHaveBeenCalled();
        expect(component.isDrawing).not.toBeTrue();
    });

    // it('continueDraw should add the choosing draw to the canvas', () => {
    //     component.isCanvasEmpty = true;
    //     const fakeDrawing1: Drawing = { _id: 'test', name: 'test', tags: [], url: 'test' };
    //     component.drawings.push(fakeDrawing1);
    //     component.continueDrawing(0);
    //     expect(drawingServiceSpy.clearCanvas).not.toHaveBeenCalled();
    // });

    it('updateDrawings should update drawings from the server', () => {
        const totalDrawings: Drawing[] = [];
        const fakeDrawing1: Drawing = { _id: 'test', name: 'test', tags: [], url: 'test' };
        totalDrawings.push(fakeDrawing1);
        component.updateDrawings(totalDrawings);
        expect(component.tab.length).toEqual(1);
    });

    it('getDrawingTagsToString should return the tags of the drawing in string', () => {
        const tags = ['tag1', 'tag2'];
        fakeDrawing.tags = tags;
        expect(component.getDrawingTagsToString(fakeDrawing)).toEqual('tag1,tag2');
    });

    it('addTag should add the tag and call updateDrawingsBydrawingTags', () => {
        const tag = 'tag1';
        const spyUpdateDrawingsBydrawingTags = spyOn(component, 'updateDrawingsBydrawingTags');
        component.addTag(tag);
        expect(component.drawingTags[0]).toEqual(tag);
        expect(spyUpdateDrawingsBydrawingTags).toHaveBeenCalled();
    });

    it('deleteTag should delete the tag if it exist and call updateDrawingsBydrawingTags', () => {
        const tag = 'tag1';
        const spyUpdateDrawingsBydrawingTags = spyOn(component, 'updateDrawingsBydrawingTags');
        component.drawingTags = [tag];
        component.deleteTag('tagDoesntExist');
        expect(component.drawingTags[0]).toEqual(tag);
        expect(spyUpdateDrawingsBydrawingTags).not.toHaveBeenCalled();
        component.deleteTag('tag1');
        expect(component.drawingTags.length).toEqual(0);
        expect(spyUpdateDrawingsBydrawingTags).toHaveBeenCalled();
    });

    it('drawingsFilteredBydrawingTags should return all the drawings when there is no tags ', () => {
        component.drawingTags = [];
        component.drawings = [fakeDrawing];
        expect(component.drawingsFilteredBydrawingTags()).toEqual(component.drawings);
    });

    it('drawingsFilteredBydrawingTags should filter only the drawings with the tag with no duplicates', () => {
        component.drawingTags = ['1', '2'];
        const fakeDrawing1 = {} as Drawing;
        fakeDrawing1.tags = ['1', '2'];
        const fakeDrawing2 = {} as Drawing;
        fakeDrawing2.tags = ['1', '3'];
        const fakeDrawing3 = {} as Drawing;
        fakeDrawing3.tags = ['3', '4'];
        component.drawings = [fakeDrawing1, fakeDrawing2, fakeDrawing3];
        expect(component.drawingsFilteredBydrawingTags()).toEqual([fakeDrawing1, fakeDrawing2]);
    });

    it('updateDrawingsBydrawingTags should call drawingsFilteredBydrawingTags and updateDrawings', () => {
        const spyDrawingsFilteredBydrawingTags = spyOn(component, 'drawingsFilteredBydrawingTags');
        const spyUpdateDrawings = spyOn(component, 'updateDrawings');
        component.updateDrawingsBydrawingTags();
        expect(spyDrawingsFilteredBydrawingTags).toHaveBeenCalled();
        expect(spyUpdateDrawings).toHaveBeenCalled();
    });

    it('validateTag should return true when tag is valid and its unique', () => {
        const tag = 'tag1';
        component.tagForm.setValue(tag);
        expect(component.validateTag(tag)).toEqual(true);
    });

    it('validateTag should return false when tag is empty or its not unique', () => {
        const tag = 'tag1';
        component.drawingTags = [tag];
        const emptyTag = '';
        expect(component.validateTag(emptyTag)).toEqual(false);
        expect(component.validateTag(tag)).toEqual(false);
    });

    it('validateTag should return false when tag isnt valid', () => {
        const tag = '.@/,.';
        component.tagForm.setValue(tag);
        expect(component.validateTag(tag)).toEqual(false);
    });

    it('exportDrawing should open dialog', () => {
        // tslint:disable-next-line:no-any / reason: spying on function
        spyOn<any>(dialog, 'open').and.callThrough();
        component.openDialog();
        expect(dialog.open).toHaveBeenCalled();
    });
});
