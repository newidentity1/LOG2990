import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class DrawingService {
    baseCtx: CanvasRenderingContext2D;
    previewCtx: CanvasRenderingContext2D;
    canvas: HTMLCanvasElement;
    childEvent: BehaviorSubject<string> = new BehaviorSubject<string>('Canvas Size has been set');

    // Send events between components
    emitChildEvent(msg: string): void {
        this.childEvent.next(msg);
    }

    childEventListener(): Observable<string> {
        return this.childEvent.asObservable();
    }

    clearCanvas(context: CanvasRenderingContext2D): void {
        context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    // https://stackoverflow.com/questions/17386707/how-to-check-if-a-canvas-is-blank
    CanvasEmpty(context: CanvasRenderingContext2D, canvas: HTMLCanvasElement): boolean {
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
