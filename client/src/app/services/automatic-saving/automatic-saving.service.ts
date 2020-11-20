import { Injectable } from '@angular/core';
import { DrawingService } from '../drawing/drawing.service';
import { UndoRedoService } from '../undo-redo/undo-redo.service';

@Injectable({
    providedIn: 'root',
})
export class AutomaticSavingService {
    recovering: boolean = false;

    constructor(private drawingService: DrawingService, private undoRedoService: UndoRedoService) {}

    save(): void {
        const baseCanvas = this.drawingService.canvas;
        localStorage.setItem('savedDrawing', baseCanvas.toDataURL());
        localStorage.setItem('width', baseCanvas.width.toString());
        localStorage.setItem('height', baseCanvas.height.toString());
    }

    recover(): void {
        this.recovering = true;
        const dataURL = localStorage.getItem('savedDrawing');
        const img = new Image();
        this.undoRedoService.resetUndoRedo();
        img.src = dataURL ? dataURL : '';
        img.onload = () => {
            this.drawingService.clearCanvas(this.drawingService.baseCtx);
            this.drawingService.baseCtx.canvas.width = img.width;
            this.drawingService.baseCtx.canvas.height = img.height;
            this.drawingService.previewCtx.canvas.width = img.width;
            this.drawingService.previewCtx.canvas.height = img.height;
            this.drawingService.baseCtx.drawImage(img, 0, 0);
        };
    }
}
