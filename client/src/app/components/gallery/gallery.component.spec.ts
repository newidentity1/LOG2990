import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { DeleteService } from '@app/services/firebase/delete/delete.service';
import { Drawing } from '@common/communication/drawing';
import { GalleryComponent } from './gallery.component';

describe('GalleryComponent', () => {
    let component: GalleryComponent;
    let fixture: ComponentFixture<GalleryComponent>;
    let drawingServiceSpy: jasmine.SpyObj<DrawingService>;
    let deleteServiceSpy: jasmine.SpyObj<DeleteService>;
    let fakeDrawing: Drawing;

    beforeEach(async(() => {
        drawingServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);
        TestBed.configureTestingModule({
            declarations: [GalleryComponent],
            imports: [HttpClientTestingModule, MatDialogModule, FormsModule],
            providers: [
                { provide: DrawingService, useValue: drawingServiceSpy },
                { provide: DeleteService, useValue: deleteServiceSpy },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
        drawingServiceSpy = TestBed.inject(DrawingService) as jasmine.SpyObj<DrawingService>;
        deleteServiceSpy = TestBed.inject(DeleteService) as jasmine.SpyObj<DeleteService>;

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
        expect(component.validateTag(tag)).toEqual(true);
    });

    it('validateTag should return false when tag isnt valid and its not unique', () => {
        const tag = 'tag1';
        component.drawingTags = [tag];
        const emptyTag = '';
        expect(component.validateTag(emptyTag)).toEqual(false);
        expect(component.validateTag(tag)).toEqual(false);
    });
});
