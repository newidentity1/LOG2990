import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class DrawingService {
    baseCtx: CanvasRenderingContext2D;
    previewCtx: CanvasRenderingContext2D;
    canvas: HTMLCanvasElement;

    private thickness: number;

    clearCanvas(context: CanvasRenderingContext2D): void {
        context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    getThickness() {
        return this.thickness;
    }

    setThickness(thickness: number): void {
        this.thickness = thickness;
        this.baseCtx.lineWidth = thickness;
        this.previewCtx.lineWidth = thickness;
    }
}
