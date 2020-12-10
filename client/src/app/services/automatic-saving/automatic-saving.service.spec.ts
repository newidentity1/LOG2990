import { EventEmitter } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { AutomaticSavingService } from '@app/services/automatic-saving/automatic-saving.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ResizeService } from '@app/services/resize/resize.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';

// tslint:disable:no-string-literal / reason : access private members
describe('AutomaticSavingService', () => {
    let service: AutomaticSavingService;
    let drawingServiceSpy: jasmine.SpyObj<DrawingService>;
    let undoRedoServiceSpy: jasmine.SpyObj<UndoRedoService>;
    let resizeServiceSpy: jasmine.SpyObj<ResizeService>;

    beforeEach(() => {
        drawingServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas', 'setStrokeColor', 'setThickness', 'canvasEmpty']);
        undoRedoServiceSpy = jasmine.createSpyObj('UndoRedoService', ['resetUndoRedo']);
        resizeServiceSpy = jasmine.createSpyObj('ResizeService', ['resizeFromImage'], { imageDrawn: new EventEmitter<void>() });

        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawingServiceSpy },
                { provide: UndoRedoService, useValue: undoRedoServiceSpy },
                { provide: ResizeService, useValue: resizeServiceSpy },
            ],
        });
        service = TestBed.inject(AutomaticSavingService);
        drawingServiceSpy = TestBed.inject(DrawingService) as jasmine.SpyObj<DrawingService>;
        undoRedoServiceSpy = TestBed.inject(UndoRedoService) as jasmine.SpyObj<UndoRedoService>;
        resizeServiceSpy = TestBed.inject(ResizeService) as jasmine.SpyObj<ResizeService>;

        drawingServiceSpy.canvas = canvasTestHelper.canvas;
        drawingServiceSpy.baseCtx = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        drawingServiceSpy.previewCtx = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('subscribeToImageDrawing call save when image is drawn ', () => {
        const saveSpy = spyOn(service, 'save');
        service['subscribeToImageDrawing']();
        resizeServiceSpy.imageDrawn.emit();
        const delay = 1000;
        jasmine.clock().install();
        jasmine.clock().tick(delay);
        expect(saveSpy).toHaveBeenCalled();
        jasmine.clock().uninstall();
    });

    it('ngOnDestroy should unsubscribe listeners', () => {
        const unsubscribeSpy = spyOn(service['subscribeImageDrawn'], 'unsubscribe');
        service.ngOnDestroy();
        expect(unsubscribeSpy).toHaveBeenCalled();
    });

    it('clearStorage should clear the localStorage', () => {
        const clearStorageSpy = spyOn(Object.getPrototypeOf(localStorage), 'clear');
        service.clearStorage();
        expect(clearStorageSpy).toHaveBeenCalled();
    });

    it('save should set local storage if canvas is not empty', () => {
        drawingServiceSpy.canvasEmpty.and.callFake(() => {
            return false;
        });
        const localStorageSpy = spyOn(Object.getPrototypeOf(localStorage), 'setItem');
        service.save();
        expect(localStorageSpy).toHaveBeenCalled();
    });

    it('save should clear the storage if canvas is empty', () => {
        drawingServiceSpy.canvasEmpty.and.callFake(() => {
            return true;
        });
        const clearStorageSpy = spyOn(service, 'clearStorage');
        service.save();
        expect(clearStorageSpy).toHaveBeenCalled();
    });

    it('recover should call resetUndoRedo, clearCanvas and resizeFromImage', (done) => {
        drawingServiceSpy.canvasEmpty.and.callFake(() => {
            return false;
        });
        service.save();
        service.recover();
        setTimeout(() => {
            expect(undoRedoServiceSpy.resetUndoRedo).toHaveBeenCalled();
            expect(drawingServiceSpy.clearCanvas).toHaveBeenCalled();
            expect(resizeServiceSpy.resizeFromImage).toHaveBeenCalled();
            done();
            // tslint:disable-next-line: no-magic-numbers / reason: waiting for image to load
        }, 200);
    });

    it('savedDrawingExists should return true if localStorage is set', () => {
        service.save();
        expect(service.savedDrawingExists()).toEqual(true);
    });

    it('savedDrawingExists should return false if localStorage is empty', () => {
        service.clearStorage();
        expect(service.savedDrawingExists()).toEqual(false);
    });
});
