import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { ANGLE_180, DEFAULT_ROTATION_ANGLE } from '@app/constants/constants';
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
    originalWidth: number;
    originalHeight: number;
    originalOffsetLeft: number;
    originalOffsetTop: number;

    constructor(private drawingService: DrawingService, private rendererFactory: RendererFactory2) {
        this.renderer = this.rendererFactory.createRenderer(null, null);
        this.selectionImageCanvas = this.renderer.createElement('canvas');
    }

    scroll(event: WheelEvent, selectionImageData: ImageData): void {
        this.angle = (this.angle + (Math.sign(event.deltaY) * (DEFAULT_ROTATION_ANGLE * Math.PI)) / ANGLE_180) % (Math.PI * 2);
        if (this.angle < 0) this.angle += Math.PI * 2;
        this.rotateImage(selectionImageData);
    }

    rotateImage(image: ImageData): void {
        const tempCtx = this.selectionImageCanvas.getContext('2d') as CanvasRenderingContext2D;
        this.selectionImageCanvas.width = image.width;
        this.selectionImageCanvas.height = image.height;
        const ctx = this.drawingService.previewCtx;
        tempCtx.putImageData(image, 0, 0);
        this.drawingService.clearCanvas(ctx);

        const width = this.originalWidth;
        const height = this.originalHeight;
        const diag = Math.sqrt(width * width + height * height);
        const angleInitiale = Math.atan(height / width);

        let w2 = (diag / 2) * Math.cos(angleInitiale - (this.angle % (Math.PI / 2))) * 2;
        let h2 = (diag / 2) * Math.sin(angleInitiale + (this.angle % (Math.PI / 2))) * 2;

        if ((this.angle >= Math.PI / 2 && this.angle < Math.PI) || (this.angle >= (3 * Math.PI) / 2 && this.angle < Math.PI * 2)) {
            [w2, h2] = [h2, w2];
        }

        const depHor = (w2 - width) / 2;
        const depVer = (h2 - height) / 2;
        ctx.canvas.width = w2;
        ctx.canvas.height = h2;

        ctx.canvas.style.left = this.originalOffsetLeft - depHor + 'px';
        ctx.canvas.style.top = this.originalOffsetTop - depVer + 'px';

        ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2);
        ctx.rotate(this.angle);
        ctx.translate(-ctx.canvas.width / 2 + depHor, -ctx.canvas.height / 2 + depVer);
        ctx.drawImage(this.selectionImageCanvas, 0, 0, this.originalWidth, this.originalHeight);
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
