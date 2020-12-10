import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class DrawingService {
    baseCtx: CanvasRenderingContext2D;
    previewCtx: CanvasRenderingContext2D;
    gridCtx: CanvasRenderingContext2D;
    canvas: HTMLCanvasElement;
    createNewDrawingSubject: Subject<void> = new Subject<void>();
    resetCanvasSizeSubject: Subject<void> = new Subject<void>();

    emitCreateNewDrawingEvent(): void {
        this.createNewDrawingSubject.next();
    }

    emitResetCanvasSizeEvent(): void {
        this.resetCanvasSizeSubject.next();
    }

    createNewDrawingEventListener(): Observable<void> {
        return this.createNewDrawingSubject.asObservable();
    }

    resetCanvasSizeEventListener(): Observable<void> {
        return this.resetCanvasSizeSubject.asObservable();
    }

    clearCanvas(context: CanvasRenderingContext2D): void {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    }

    // https://stackoverflow.com/questions/17386707/how-to-check-if-a-canvas-is-blank
    canvasEmpty(context: CanvasRenderingContext2D): boolean {
        const pixelBuffer = new Uint32Array(context.getImageData(0, 0, context.canvas.width, context.canvas.height).data.buffer);
        return !pixelBuffer.some((color) => color !== 0);
    }

    setThickness(thickness: number): void {
        if (this.baseCtx) this.baseCtx.lineWidth = thickness;

        if (this.previewCtx) this.previewCtx.lineWidth = thickness;
    }

    setColor(color: string): void {
        this.setFillColor(color);
        this.setStrokeColor(color);
    }

    setFillColor(color: string): void {
        this.baseCtx.fillStyle = color;
        this.previewCtx.fillStyle = color;
    }

    setStrokeColor(color: string): void {
        this.baseCtx.strokeStyle = color;
        this.previewCtx.strokeStyle = color;
    }

    setTextStyle(style: string): void {
        this.baseCtx.font = style;
        this.previewCtx.font = style;
    }

    setTextAlignment(alignment: string): void {
        this.baseCtx.textAlign = alignment as CanvasTextAlign;
        this.previewCtx.textAlign = alignment as CanvasTextAlign;
    }
}
