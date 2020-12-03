import { Injectable, RendererFactory2, Renderer2 } from '@angular/core';
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
    private renderer: Renderer2;
    private selectionImageCanvas: HTMLCanvasElement;

    constructor(private drawingService: DrawingService, private rendererFactory: RendererFactory2) {
        this.renderer = this.rendererFactory.createRenderer(null, null);
        this.selectionImageCanvas = this.renderer.createElement('canvas');
    }

    scroll(event: WheelEvent, selectionImageData: ImageData): void {
        this.angle += (Math.sign(event.deltaY) * (DEFAULT_ROTATION_ANGLE * Math.PI)) / STRAIGHT_ANGLE;
        this.rotateImage(selectionImageData);
    }

    rotateImage(image: ImageData): void {
        const tempCtx = this.selectionImageCanvas.getContext('2d') as CanvasRenderingContext2D;
        this.selectionImageCanvas.width = image.width;
        this.selectionImageCanvas.height = image.height;
        const ctx = this.drawingService.previewCtx;
        tempCtx.putImageData(image, 0, 0);
        this.drawingService.clearCanvas(ctx);

        ctx.save();
        ctx.translate(this.selectionImageCanvas.width / 2, this.selectionImageCanvas.height / 2);
        ctx.rotate(this.angle);
        ctx.translate(-this.selectionImageCanvas.width / 2, -this.selectionImageCanvas.height / 2);
        ctx.drawImage(this.selectionImageCanvas, 0, 0);
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
