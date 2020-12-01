import { Injectable } from '@angular/core';
import { DEFAULT_ROTATION_ANGLE, STRAIGHT_ANGLE } from '@app/constants/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class RotateSelectionService {
    private angle: number = 0;

    constructor(private drawingService: DrawingService) {}

    scroll(event: WheelEvent, selectionImageData: ImageData): void {
        const tempCtx = this.drawingService.canvas.getContext('2d');
        if (!tempCtx) return;
        const tempCanvas = tempCtx.canvas;
        const canvas = this.drawingService.previewCtx.canvas;
        const ctx = this.drawingService.previewCtx;

        tempCtx.putImageData(selectionImageData, 0, 0);
        this.drawingService.clearCanvas(ctx);

        ctx.save();
        this.angle += (Math.sign(event.deltaY) * (DEFAULT_ROTATION_ANGLE * Math.PI)) / STRAIGHT_ANGLE;
        ctx.beginPath();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(this.angle);
        ctx.translate(-canvas.width / 2, -canvas.height / 2);
        ctx.drawImage(tempCanvas, 0, 0);
        ctx.restore();
    }
}
