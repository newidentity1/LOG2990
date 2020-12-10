import { TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { PencilService } from '@app/services/tools/pencil/pencil.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';

describe('UndoRedoService', () => {
    let service: UndoRedoService;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let pencilServiceStub: PencilService;

    beforeEach(() => {
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas', 'setColor', 'setThickness']);
        pencilServiceStub = new PencilService(drawServiceSpy);

        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawServiceSpy }],
        });
        service = TestBed.inject(UndoRedoService);
        // tslint:disable:no-string-literal
        service['drawingService'].baseCtx = baseCtxStub;
        service['drawingService'].previewCtx = previewCtxStub;
        service['drawingService'].canvas = canvasTestHelper.canvas;
        const defaultUndoIndexValue = -1;
        service.undoIndex = defaultUndoIndexValue;
        service.commands = [];
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('canUndo should return false if isDrawing is true', () => {
        service.undoIndex = 1;
        expect(service.canUndo(true)).toEqual(false);
    });

    it('canUndo should return true if index > 0 and isDrawing is false', () => {
        service.undoIndex = 1;
        expect(service.canUndo(false)).toEqual(true);
    });

    it('canUndo should return false if index <= 0', () => {
        service.undoIndex = 0;
        expect(service.canUndo(false)).toEqual(false);
    });

    it('canRedo should return false if isDrawing is true', () => {
        service.undoIndex = 1;
        expect(service.canRedo(true)).toEqual(false);
    });

    it('canRedo should return true if there is a command and undoIndex is less than commands.length - 1 isDrawing is false', () => {
        service.addCommand(pencilServiceStub);
        service.addCommand(pencilServiceStub);
        service.undoIndex = 0;
        expect(service.canRedo(false)).toEqual(true);
    });

    it('canRedo should return false if undoIndex >= commands.length', () => {
        expect(service.canRedo(false)).toEqual(false);
    });

    it('addCommand should add a command to its commands array', () => {
        service.addCommand(pencilServiceStub);
        expect(service.undoIndex).toEqual(0);
        expect(service.commands.length).toEqual(1);
    });

    it('undo should do nothing if cannot undo', () => {
        service.undo(false);
        const undoDefaultIndexValue = -1;
        expect(service.undoIndex).toEqual(undoDefaultIndexValue);
    });

    it('undo should call clearCanvas twice for baseCtx and previewCtx and decrement undoIndex when canUndo is true', () => {
        service.addCommand(pencilServiceStub);
        service.addCommand(pencilServiceStub);
        service.undo(false);

        expect(service.undoIndex).toEqual(0);
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalledWith(drawServiceSpy.baseCtx);
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalledWith(drawServiceSpy.previewCtx);
    });

    it('undo should call clearCanvas twice for baseCtx and previewCtx and decrement undoIndex when canUndo is true', () => {
        service.addCommand(pencilServiceStub);
        service.addCommand(pencilServiceStub);

        // tslint:disable-next-line: no-any
        const applyCurrentSettingsSpy = spyOn<any>(pencilServiceStub, 'applyCurrentSettings');
        // tslint:disable-next-line: no-any
        const executeSpy = spyOn<any>(pencilServiceStub, 'execute');
        // tslint:disable-next-line: no-any
        const drawSpy = spyOn<any>(pencilServiceStub, 'drawImage');
        const delay = 1000;
        jasmine.clock().install();
        service.undo(false);
        jasmine.clock().tick(delay);

        expect(applyCurrentSettingsSpy).toHaveBeenCalled();
        expect(drawSpy).toHaveBeenCalled();
        expect(executeSpy).toHaveBeenCalled();
        jasmine.clock().uninstall();
    });

    it('undo should not call applyCurrentSettings, execute and drawImage if undoing the last command', () => {
        service.addCommand(pencilServiceStub);

        // tslint:disable-next-line: no-any
        const applyCurrentSettingsSpy = spyOn<any>(pencilServiceStub, 'applyCurrentSettings');
        // tslint:disable-next-line: no-any
        const executeSpy = spyOn<any>(pencilServiceStub, 'execute');
        // tslint:disable-next-line: no-any
        const drawSpy = spyOn<any>(pencilServiceStub, 'drawImage');
        const delay = 1000;
        jasmine.clock().install();
        service.undo(false);
        jasmine.clock().tick(delay);

        expect(applyCurrentSettingsSpy).not.toHaveBeenCalled();
        expect(drawSpy).not.toHaveBeenCalled();
        expect(executeSpy).not.toHaveBeenCalled();
        jasmine.clock().uninstall();
    });

    it('redo should do nothing if cannot redo', () => {
        service.redo(false);
        const undoDefaultIndexValue = -1;
        expect(service.undoIndex).toEqual(undoDefaultIndexValue);
    });

    it('undo should call increment undoIndex, call applyCurrentSettings, call execute and call drawImage if can redo', () => {
        service.addCommand(pencilServiceStub);
        service.addCommand(pencilServiceStub);
        service.undoIndex = 0;

        // tslint:disable-next-line: no-any
        const applyCurrentSettingsSpy = spyOn<any>(pencilServiceStub, 'applyCurrentSettings');
        // tslint:disable-next-line: no-any
        const executeSpy = spyOn<any>(pencilServiceStub, 'execute');
        // tslint:disable-next-line: no-any
        const drawSpy = spyOn<any>(pencilServiceStub, 'drawImage');
        const delay = 1000;
        jasmine.clock().install();
        service.redo(false);
        jasmine.clock().tick(delay);

        expect(applyCurrentSettingsSpy).toHaveBeenCalled();
        expect(drawSpy).toHaveBeenCalled();
        expect(executeSpy).toHaveBeenCalled();
        jasmine.clock().uninstall();
    });
});
