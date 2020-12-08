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
    let undoRedoService: jasmine.SpyObj<UndoRedoService>;
    let resizeService: jasmine.SpyObj<ResizeService>;

    beforeEach(() => {
        drawingServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas', 'setStrokeColor', 'setThickness', 'canvasEmpty']);
        undoRedoService = jasmine.createSpyObj('UndoRdoService', ['resetUndoRedo']);
        resizeService = jasmine.createSpyObj('ResizeService', ['resizeFromImage'], { imageDrawn: new EventEmitter<void>() });

        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawingServiceSpy },
                { provide: UndoRedoService, useValue: undoRedoService },
                { provide: ResizeService, useValue: resizeService },
            ],
        });
        service = TestBed.inject(AutomaticSavingService);
        drawingServiceSpy = TestBed.inject(DrawingService) as jasmine.SpyObj<DrawingService>;
        undoRedoService = TestBed.inject(UndoRedoService) as jasmine.SpyObj<UndoRedoService>;
        resizeService = TestBed.inject(ResizeService) as jasmine.SpyObj<ResizeService>;

        drawingServiceSpy.canvas = canvasTestHelper.canvas;
        drawingServiceSpy.baseCtx = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        drawingServiceSpy.previewCtx = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('ngOnDestroy should unsubscribe listeners', () => {
        const unsubscribeSpy = spyOn(service['subscribeImageDrawn'], 'unsubscribe');
        service.ngOnDestroy();
        expect(unsubscribeSpy).toHaveBeenCalled();
    });
});
