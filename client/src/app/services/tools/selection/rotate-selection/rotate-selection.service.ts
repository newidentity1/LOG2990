import { Injectable } from '@angular/core';
import { DEFAULT_ROTATION_ANGLE, STRAIGHT_ANGLE } from '@app/constants/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';

interface RotatedImage {
    image: ImageData;
    angle: number;
}

@Injectable({
    providedIn: 'root',
})
export class RotateSelectionService {
    angle: number = 0;
    rotatedImage: RotatedImage;

    constructor(private drawingService: DrawingService) {}

    scroll(event: WheelEvent, selectionImageData: ImageData): void {
        this.angle += (Math.sign(event.deltaY) * (DEFAULT_ROTATION_ANGLE * Math.PI)) / STRAIGHT_ANGLE;
        this.rotateImage(selectionImageData);
    }

    rotateImage(image: ImageData): void {
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d') as CanvasRenderingContext2D;
        const canvas = this.drawingService.previewCtx.canvas;
        const ctx = this.drawingService.previewCtx;
        tempCtx.putImageData(image, 0, 0);
        this.drawingService.clearCanvas(ctx);

        // ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(this.angle);
        ctx.translate(-canvas.width / 2, -canvas.height / 2);
        ctx.drawImage(tempCanvas, 0, 0);
        ctx.setTransform(1, 0, 0, 1, 0, 0);

        this.rotatedImage = {
            angle: this.angle,
            image: this.drawingService.previewCtx.getImageData(
                0,
                0,
                this.drawingService.previewCtx.canvas.width,
                this.drawingService.previewCtx.canvas.height,
            ),
        };
        this.drawingService.clearCanvas(tempCtx);
    }
}
