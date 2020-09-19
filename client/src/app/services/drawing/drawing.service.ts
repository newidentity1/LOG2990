import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class DrawingService {
    baseCtx: CanvasRenderingContext2D;
    previewCtx: CanvasRenderingContext2D;
    canvas: HTMLCanvasElement;

    clearCanvas(context: CanvasRenderingContext2D): void {
        context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    setThickness(thickness: number): void {
        this.baseCtx.lineWidth = thickness;
        this.previewCtx.lineWidth = thickness;
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
        console.log(this.previewCtx.strokeStyle);
    }
}
