import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class DrawingService {
    baseCtx: CanvasRenderingContext2D;
    previewCtx: CanvasRenderingContext2D;
    canvas: HTMLCanvasElement;
    createNewDrawingSubject: Subject<void> = new Subject<void>();

    setWhiteBackground(): void {
        console.log(this.canvas.width, this.canvas.height);
        this.baseCtx.globalCompositeOperation = 'destination-over';
        this.baseCtx.fillStyle = '#FFFFFF';
        this.baseCtx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.baseCtx.fillStyle = '#000000';
        this.baseCtx.globalCompositeOperation = 'source-over';
    }

    emitCreateNewDrawingEvent(): void {
        this.createNewDrawingSubject.next();
    }

    createNewDrawingEventListener(): Observable<void> {
        return this.createNewDrawingSubject.asObservable();
    }

    clearCanvas(context: CanvasRenderingContext2D): void {
        context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    // https://stackoverflow.com/questions/17386707/how-to-check-if-a-canvas-is-blank
    canvasEmpty(context: CanvasRenderingContext2D, canvas: HTMLCanvasElement): boolean {
        const pixelBuffer = new Uint32Array(context.getImageData(0, 0, canvas.width, canvas.height).data.buffer);
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
}
