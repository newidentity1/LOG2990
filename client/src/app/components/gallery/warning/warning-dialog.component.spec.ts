import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { WarningDialogComponent } from './warning-dialog.component';

describe('WarningDialogComponent', () => {
    let component: WarningDialogComponent;
    let fixture: ComponentFixture<WarningDialogComponent>;
    let drawingServiceSpy: jasmine.SpyObj<DrawingService>;

    const mockDialog = {
        closeAll: jasmine.createSpy('closeAll'),
    };

    beforeEach(async(() => {
        drawingServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas', 'emitCreateNewDrawingEvent']);

        TestBed.configureTestingModule({
            declarations: [WarningDialogComponent],
            providers: [
                { provide: MatDialog, useValue: mockDialog },
                { provide: MAT_DIALOG_DATA, useValue: [] },
                { provide: DrawingService, useValue: drawingServiceSpy },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();

        drawingServiceSpy = TestBed.inject(DrawingService) as jasmine.SpyObj<DrawingService>;

        const canvas = document.createElement('canvas');
        canvas.width = canvasTestHelper.canvas.width;
        canvas.height = canvasTestHelper.canvas.height;
        drawingServiceSpy.canvas = canvas;
        drawingServiceSpy.baseCtx = canvas.getContext('2d') as CanvasRenderingContext2D;
        drawingServiceSpy.previewCtx = canvas.getContext('2d') as CanvasRenderingContext2D;
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(WarningDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('deleteCanvas should call loadImage', (done) => {
        const spyLoadImage = spyOn(component, 'loadImage');
        component.data = { drawing: { _id: '1', name: 'test', tags: [], url: drawingServiceSpy.canvas.toDataURL() } };
        component.deleteCanvas();

        setTimeout(() => {
            expect(spyLoadImage).toHaveBeenCalled();
            done();
            // tslint:disable-next-line: no-magic-numbers / reason: waiting for image to load
        }, 200);
    });

    it('loadImage should set the image on the canvas and close the dialogue', () => {
        // tslint:disable: no-string-literal /reason: waiting for image to load
        const drawImageSpy = spyOn(component['resizeService'], 'resizeFromImage');
        const spyCancel = spyOn(component, 'cancel');
        const imageSize = 10;
        const image = new Image();
        image.width = imageSize;
        image.height = imageSize;
        // tslint:disable: no-string-literal /reason: waiting for image to load
        component['image'] = image;

        component.loadImage();

        expect(spyCancel).toHaveBeenCalled();
        expect(drawImageSpy).toHaveBeenCalledWith(image);
    });

    it('cancel should close dialog', () => {
        component.cancel();
        expect(mockDialog.closeAll).toHaveBeenCalled();
    });
});
