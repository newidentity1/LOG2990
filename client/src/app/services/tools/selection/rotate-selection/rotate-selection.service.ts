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
    leftOffset: number = 0;
    topOffset: number = 0;

    constructor(private drawingService: DrawingService, private rendererFactory: RendererFactory2) {
        this.renderer = this.rendererFactory.createRenderer(null, null);
        this.selectionImageCanvas = this.renderer.createElement('canvas');
    }

    scroll(event: WheelEvent, selectionImageData: ImageData, altDown: boolean): void {
        this.angle = (this.angle + (Math.sign(event.deltaY) * (altDown ? 1 : DEFAULT_ROTATION_ANGLE * Math.PI)) / ANGLE_180) % (Math.PI * 2);
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
        const diagonale = Math.sqrt(width * width + height * height);
        const diagonaleStartingAngle = Math.atan(height / width);

        let newWidth = (diagonale / 2) * Math.cos(diagonaleStartingAngle - (this.angle % (Math.PI / 2))) * 2;
        let newHeight = (diagonale / 2) * Math.sin(diagonaleStartingAngle + (this.angle % (Math.PI / 2))) * 2;

        if ((this.angle >= Math.PI / 2 && this.angle < Math.PI) || (this.angle >= (3 * Math.PI) / 2 && this.angle < Math.PI * 2)) {
            [newWidth, newHeight] = [newHeight, newWidth];
        }

        this.leftOffset = (newWidth - width) / 2;
        this.topOffset = (newHeight - height) / 2;
        ctx.canvas.width = newWidth;
        ctx.canvas.height = newHeight;

        ctx.canvas.style.left = this.originalOffsetLeft - this.leftOffset + 'px';
        ctx.canvas.style.top = this.originalOffsetTop - this.topOffset + 'px';
        ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2);
        ctx.rotate(this.angle);
        ctx.translate(-ctx.canvas.width / 2 + this.leftOffset, -ctx.canvas.height / 2 + this.topOffset);
        ctx.drawImage(this.selectionImageCanvas, 0, 0, width, height);
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

        this.drawingService.clearCanvas(ctx);
        ctx.putImageData(
            this.rotatedImage.image,
            0,
            0,
            this.originalOffsetLeft - this.leftOffset >= 0 ? 0 : -(this.originalOffsetLeft - this.leftOffset),
            this.originalOffsetTop - this.topOffset >= 0 ? 0 : -(this.originalOffsetTop - this.topOffset),
            this.drawingService.canvas.width - (this.originalOffsetLeft - this.leftOffset),
            this.drawingService.canvas.height - (this.originalOffsetTop - this.topOffset),
        );
        this.drawingService.clearCanvas(tempCtx);
    }
}
