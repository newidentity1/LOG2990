import { EventEmitter, Injectable } from '@angular/core';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';

@Injectable({
    providedIn: 'root',
})
export class AutomaticSavingService {
    recovering: boolean = false;
    recoverImage: EventEmitter<HTMLImageElement> = new EventEmitter<HTMLImageElement>();

    constructor(private drawingService: DrawingService, private undoRedoService: UndoRedoService) {}

    save(): void {
        const canvas = this.drawingService.canvas;
        const isCanvasEmpty = this.drawingService.canvasEmpty(this.drawingService.baseCtx, canvas);
        if (!isCanvasEmpty) localStorage.setItem('savedDrawing', canvas.toDataURL());
        else localStorage.clear();
    }

    recover(): void {
        this.recovering = true;
        const dataURL = localStorage.getItem('savedDrawing');
        const img = new Image();
        this.undoRedoService.resetUndoRedo();
        img.src = dataURL ? dataURL : '';
        img.onload = () => {
            this.drawingService.clearCanvas(this.drawingService.baseCtx);
            this.recoverImage.emit(img);
        };
    }

    savedDrawingExists(): boolean {
        return localStorage.getItem('savedDrawing') ? true : false;
    }
}
