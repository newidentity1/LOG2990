import { Injectable, OnDestroy } from '@angular/core';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { Subscription } from 'rxjs';
import { ResizeService } from '../resize/resize.service';

@Injectable({
    providedIn: 'root',
})
export class AutomaticSavingService implements OnDestroy {
    recovering: boolean = false;
    subscribeImageDrawn: Subscription;

    constructor(private drawingService: DrawingService, private undoRedoService: UndoRedoService, private resizeService: ResizeService) {
        this.subscribeImageDrawn = this.resizeService.imageDrawn.subscribe(() => {
            this.save();
        });
    }

    ngOnDestroy(): void {
        this.subscribeImageDrawn.unsubscribe();
    }

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
            this.drawingService.baseCtx.drawImage(img, 0, 0);
        };
    }

    savedDrawingExists(): boolean {
        return localStorage.getItem('savedDrawing') ? true : false;
    }
}
