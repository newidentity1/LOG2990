import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { CommunicationService } from '@app/services/communication.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { FireBaseService } from '@app/services/fire/fire-base.service';
import { Drawing } from '@common/communication/drawing';
import { NgImageSliderComponent } from 'ng-image-slider';
import { GalleryComponent } from './gallery.component';

describe('GalleryComponent', () => {
    let component: GalleryComponent;
    let fixture: ComponentFixture<GalleryComponent>;
    let drawingServiceSpy: jasmine.SpyObj<DrawingService>;
    let communicationSpy: jasmine.SpyObj<CommunicationService>;
    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let slider: jasmine.SpyObj<NgImageSliderComponent>;
    let fireBaseService: jasmine.SpyObj<FireBaseService>;
    let fakeDrawing: Drawing;

    beforeEach(async(() => {
        drawingServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);
        communicationSpy = jasmine.createSpyObj('CommunicationService', ['deleteDraw']);
        slider = jasmine.createSpyObj('NgImageSliderComponent', ['setSliderImages']);
        TestBed.configureTestingModule({
            declarations: [GalleryComponent],
            imports: [HttpClientTestingModule, MatDialogModule, FormsModule, ReactiveFormsModule],
            providers: [
                { provide: DrawingService, useValue: drawingServiceSpy },
                { provide: FireBaseService, useValue: fireBaseService },
                { provide: NgImageSliderComponent, useValue: slider },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
        drawingServiceSpy = TestBed.inject(DrawingService) as jasmine.SpyObj<DrawingService>;
        communicationSpy = TestBed.inject(CommunicationService) as jasmine.SpyObj<CommunicationService>;
        fireBaseService = TestBed.inject(FireBaseService) as jasmine.SpyObj<FireBaseService>;
        slider = TestBed.inject(NgImageSliderComponent) as jasmine.SpyObj<NgImageSliderComponent>;

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

    it('deleteDraw should delete the current draw', () => {
        component.slider = slider;
        component['fireBaseService'] = fireBaseService;
        const fakeDrawing1: Drawing = { _id: 'test', name: 'test', tags: [], url: 'test' };
        component.drawings.push(fakeDrawing1);
        component.deleteDraw();
        expect(communicationSpy.deleteDraw).toHaveBeenCalled();
    });

    it('continueDraw should add the choosing draw to the canvas', () => {
        component.slider = slider;
        const fakeDrawing1: Drawing = { _id: 'test', name: 'test', tags: [], url: 'test' };
        component.drawings.push(fakeDrawing1);
        component.continueDraw(0);
        expect(drawingServiceSpy.clearCanvas).toHaveBeenCalled();
    });

    it('updateDrawings should update drawings from the server', () => {
        component.slider = slider;
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
});
