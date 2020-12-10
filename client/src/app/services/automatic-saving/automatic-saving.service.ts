import { Injectable, OnDestroy } from '@angular/core';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ResizeService } from '@app/services/resize/resize.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { Subscription } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AutomaticSavingService implements OnDestroy {
    recovering: boolean = false;
    private subscribeImageDrawn: Subscription;

    constructor(private drawingService: DrawingService, private undoRedoService: UndoRedoService, private resizeService: ResizeService) {
        this.subscribeToImageDrawing();
    }

    private subscribeToImageDrawing(): void {
        this.subscribeImageDrawn = this.resizeService.imageDrawn.subscribe(() => {
            this.save();
        });
    }

    ngOnDestroy(): void {
        this.subscribeImageDrawn.unsubscribe();
    }

    clearStorage(): void {
        localStorage.clear();
    }

    save(): void {
        const canvas = this.drawingService.canvas;
        const isCanvasEmpty = this.drawingService.canvasEmpty(this.drawingService.baseCtx);
        if (!isCanvasEmpty) localStorage.setItem('savedDrawing', canvas.toDataURL());
        else this.clearStorage();
    }

    recover(): void {
        this.recovering = true;
        const dataURL = localStorage.getItem('savedDrawing') as string;
        const img = new Image();
        this.undoRedoService.resetUndoRedo();
        img.src = dataURL;
        img.onload = () => {
            this.drawingService.clearCanvas(this.drawingService.baseCtx);
            this.resizeService.resizeFromImage(img);
        };
    }

    savedDrawingExists(): boolean {
        return Boolean(localStorage.getItem('savedDrawing'));
    }
}
