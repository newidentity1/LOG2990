import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { MatDialogMock } from '@app/classes/mat-dialog-test-helper';
import * as CONSTANTS from '@app/constants/constants';
import { CommunicationService } from '@app/services/communication/communication.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { FireBaseService } from '@app/services/fire-base/fire-base.service';
import { Drawing } from '@common/communication/drawing';
import { NgImageSliderComponent, NgImageSliderModule } from 'ng-image-slider';
import { of } from 'rxjs';
import { GalleryDialogComponent } from './gallery-dialog.component';

describe('GalleryDialogComponent', () => {
    let component: GalleryDialogComponent;
    let fixture: ComponentFixture<GalleryDialogComponent>;
    let drawingServiceSpy: jasmine.SpyObj<DrawingService>;
    let communicationSpy: jasmine.SpyObj<CommunicationService>;
    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let sliderSpy: jasmine.SpyObj<NgImageSliderComponent>;
    let fireBaseServiceSpy: jasmine.SpyObj<FireBaseService>;
    let fakeDrawing: Drawing;
    let mockDialog: MatDialog;

    beforeEach(async(() => {
        drawingServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas', 'canvasEmpty']);
        fireBaseServiceSpy = jasmine.createSpyObj('fireBaseServiceSpy', ['deleteImage']);
        communicationSpy = jasmine.createSpyObj('CommunicationService', ['deleteDrawing', 'getDrawings']);
        sliderSpy = jasmine.createSpyObj('NgImageSliderComponent', ['setSliderImages']);
        TestBed.configureTestingModule({
            declarations: [GalleryDialogComponent, NgImageSliderComponent],
            imports: [HttpClientTestingModule, MatDialogModule, FormsModule, ReactiveFormsModule, NgImageSliderModule],
            providers: [
                { provide: DrawingService, useValue: drawingServiceSpy },
                { provide: FireBaseService, useValue: fireBaseServiceSpy },
                { provide: CommunicationService, useValue: communicationSpy },
                { provide: NgImageSliderComponent, useValue: sliderSpy },
                { provide: MatDialog, useClass: MatDialogMock },
                { provide: MAT_DIALOG_DATA, useValue: [] },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
        mockDialog = TestBed.inject(MatDialog);
        drawingServiceSpy = TestBed.inject(DrawingService) as jasmine.SpyObj<DrawingService>;
        communicationSpy = TestBed.inject(CommunicationService) as jasmine.SpyObj<CommunicationService>;

        const data: Drawing[] = [];
        communicationSpy.getDrawings.and.returnValue(of(data));
        sliderSpy.setSliderImages.and.callFake(() => {
            return;
        });

        const drawingCanvas = document.createElement('canvas');
        drawingCanvas.width = canvasTestHelper.canvas.width;
        drawingCanvas.height = canvasTestHelper.canvas.height;
        baseCtxStub = drawingCanvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = drawingCanvas.getContext('2d') as CanvasRenderingContext2D;
        drawingServiceSpy.canvas = drawingCanvas;
        drawingServiceSpy.baseCtx = baseCtxStub; // Jasmine doesnt copy properties with underlying data
        drawingServiceSpy.previewCtx = previewCtxStub;

        fakeDrawing = {} as Drawing;
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GalleryDialogComponent);
        component = fixture.componentInstance;
        component.isDrawing = true;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('updateDrawings should update drawings from the server ', () => {
        const totalDrawings: Drawing[] = [];
        const fakeDrawing1: Drawing = { _id: 'test', name: 'test', tags: [], url: 'test' };
        const fakeDrawing2: Drawing = { _id: 'test', name: 'test', tags: ['tag1'], url: 'test' };
        totalDrawings.push(fakeDrawing1, fakeDrawing2);
        // tslint:disable-next-line:no-string-literal / reason: accessing on private member
        component['updateDrawings'](totalDrawings);

        expect(component.tab.length).toEqual(totalDrawings.length + 1);
    });

    it('getDrawingTagsToString should return the tags of the drawing in string', () => {
        const tags = ['tag1', 'tag2'];
        fakeDrawing.tags = tags;
        // tslint:disable-next-line:no-string-literal / reason: access on private member
        expect(component['getDrawingTagsToString'](fakeDrawing)).toEqual('tag1,tag2');
    });

    it('continueDraw should open warning dialog if canvas is not empty', (done) => {
        const drawImageSpy = spyOn(drawingServiceSpy.baseCtx, 'drawImage');
        const closeAllDialogSpy = spyOn(mockDialog, 'closeAll').and.callThrough();
        drawingServiceSpy.canvasEmpty.and.returnValue(true);
        drawingServiceSpy.clearCanvas(baseCtxStub);
        const fakeDrawing1: Drawing = { _id: 'test', name: 'test', tags: [], url: drawingServiceSpy.canvas.toDataURL() };
        component.drawings.push(fakeDrawing1);
        component.continueDrawing(1);

        setTimeout(() => {
            expect(drawingServiceSpy.clearCanvas).toHaveBeenCalled();
            expect(drawImageSpy).toHaveBeenCalled();
            expect(closeAllDialogSpy).toHaveBeenCalled();
            done();
            // tslint:disable-next-line: no-magic-numbers / reason: waiting for image to load
        }, 200);
    });

    it('continueDraw should open warning dialog if canvas is not empty', () => {
        drawingServiceSpy.canvasEmpty.and.returnValue(false);
        // tslint:disable-next-line:no-string-literal
        component['drawingService'].baseCtx.fillRect(0, 0, CONSTANTS.DEFAULT_MITER_LIMIT, CONSTANTS.DEFAULT_MITER_LIMIT);
        // tslint:disable-next-line:no-any / reason: spying on function
        const openWarningDialogSpy = spyOn<any>(component, 'openWarningDialog');
        const fakeDrawing1: Drawing = { _id: 'test', name: 'test', tags: [], url: 'test' };
        component.drawings.push(fakeDrawing1);
        component.continueDrawing(0);

        expect(openWarningDialogSpy).toHaveBeenCalled();
    });

    it('openWarningDialog shoul open warning dialog ', () => {
        const fakeDrawing1 = {} as Drawing;
        // tslint:disable-next-line:no-any
        const dialogOpenSpy = spyOn<any>(mockDialog, 'open').and.callThrough();
        // tslint:disable-next-line:no-string-literal / reason: accessing on private member
        component['openWarningDialog'](fakeDrawing1);

        expect(dialogOpenSpy).toHaveBeenCalled();
    });

    it('deleteDrawing should delete the current draw from the middle image on the slider', () => {
        const fakeDrawing1: Drawing = { _id: 'test', name: 'test', tags: [], url: 'test' };
        const fakeDrawing2: Drawing = { _id: 'test', name: 'test', tags: [], url: 'test' };
        const fakeDrawing3: Drawing = { _id: 'test', name: 'test', tags: [], url: 'test' };
        const fakeDrawing4: Drawing = { _id: 'test', name: 'test', tags: [], url: 'test' };
        component.slider.visiableImageIndex = 0;
        component.drawings.push(fakeDrawing1);
        component.drawings.push(fakeDrawing2);
        component.drawings.push(fakeDrawing3);
        component.drawings.push(fakeDrawing4);
        communicationSpy.deleteDrawing.and.returnValue(of());
        component.deleteDrawing();

        expect(fireBaseServiceSpy.deleteImage).toHaveBeenCalled();
        expect(communicationSpy.deleteDrawing).toHaveBeenCalled();
    });

    it('deleteDrawing should delete the current draw from the left image of the slider', () => {
        const fakeDrawing1: Drawing = { _id: 'test', name: 'test', tags: [], url: 'test' };
        component.slider.visiableImageIndex = 0;
        component.drawings.push(fakeDrawing1);
        communicationSpy.deleteDrawing.and.returnValue(of(''));
        component.deleteDrawing();

        expect(fireBaseServiceSpy.deleteImage).toHaveBeenCalled();
        expect(communicationSpy.deleteDrawing).toHaveBeenCalled();
        fixture.detectChanges();
    });

    it('deleteDrawing should not call deleteImage of firebase service if no drawings are available', () => {
        component.drawings.length = 0;
        component.deleteDrawing();
        expect(fireBaseServiceSpy.deleteImage).not.toHaveBeenCalled();
    });

    it('getDrawing should get all the drawing present on the server', () => {
        // tslint:disable-next-line:no-any / reason: spying on private member
        const spy = spyOn<any>(component, 'transformData');
        // tslint:disable-next-line:no-string-literal / reason: accessing on private member
        component['getDrawings']();
        expect(spy).toHaveBeenCalledWith([]);
    });

    it('transformData should call updateDrawings and set isDrawing to true', () => {
        const fakeDrawing1: Drawing = { _id: 'test', name: 'test', tags: [], url: 'test' };
        const fakeDrawing2: Drawing = { _id: 'test', name: 'test', tags: [], url: 'test' };
        const fakeDrawing3: Drawing = { _id: 'test', name: 'test', tags: [], url: 'test' };
        const fakeDrawing4: Drawing = { _id: 'test', name: 'test', tags: [], url: 'test' };
        const data: Drawing[] = [];
        data.push(fakeDrawing1);
        data.push(fakeDrawing2);
        data.push(fakeDrawing3);
        data.push(fakeDrawing4);
        // tslint:disable-next-line:no-any / reason: spying on private member
        const spy = spyOn<any>(component, 'updateDrawings');
        // tslint:disable-next-line:no-string-literal / reason: accessing on private member
        component['transformData'](data);

        expect(spy).not.toHaveBeenCalled();
        expect(component.isDrawing).toBeTrue();
    });

    it('transformData should call updateDrawings and set isDrawing to false', () => {
        const data: Drawing[] = [];
        // tslint:disable-next-line:no-any / reason: spying on private member
        const spy = spyOn<any>(component, 'updateDrawings');
        // tslint:disable-next-line:no-string-literal / reason: accessing on private member
        component['transformData'](data);

        expect(spy).not.toHaveBeenCalled();
    });

    it('addTag should add the tag and call updateDrawingsBydrawingTags', () => {
        const tag = 'tag1';
        // tslint:disable-next-line:no-any / reason: spying on private member
        const spyUpdateDrawingsBydrawingTags = spyOn<any>(component, 'updateDrawingsBydrawingTags');
        component.addTag(tag);

        expect(component.drawingTags[0]).toEqual(tag);
        expect(spyUpdateDrawingsBydrawingTags).toHaveBeenCalled();
    });

    it('deleteTag should delete the tag if it exist and call updateDrawingsBydrawingTags', () => {
        const tag = 'tag1';
        // tslint:disable-next-line:no-any / reason: spying on private member
        const spyUpdateDrawingsBydrawingTags = spyOn<any>(component, 'updateDrawingsBydrawingTags');
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

        // tslint:disable-next-line:no-string-literal / reason: accessing on private member
        expect(component['drawingsFilteredBydrawingTags']()).toEqual(component.drawings);
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

        // tslint:disable-next-line:no-string-literal / reason: spying on private member
        expect(component['drawingsFilteredBydrawingTags']()).toEqual([fakeDrawing1, fakeDrawing2]);
    });

    it('updateDrawingsBydrawingTags should call drawingsFilteredBydrawingTags and updateDrawings', () => {
        // tslint:disable-next-line:no-any / reason: spying on private member
        const spyDrawingsFilteredBydrawingTags = spyOn<any>(component, 'drawingsFilteredBydrawingTags');
        // tslint:disable-next-line:no-any / reason: spying on private member
        const spyUpdateDrawings = spyOn<any>(component, 'updateDrawings');
        // tslint:disable-next-line:no-string-literal / reason: accessing on private member
        component['updateDrawingsBydrawingTags']();

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
