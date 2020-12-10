import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { Tool } from '@app/classes/tool/tool';
import { StampProperties } from '@app/classes/tools-properties/stamp-properties';
import { Vec2 } from '@app/classes/vec2';
import * as CONSTANTS from '@app/constants/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class StampService extends Tool {
    finalPosition: Vec2 = { x: 0, y: 0 };
    private altDown: boolean = false;
    private renderer: Renderer2;
    private rotateImageCanvas: HTMLCanvasElement;
    private resizeImageCanvas: HTMLCanvasElement;
    private imagePreview: HTMLImageElement = new Image();

    constructor(drawingService: DrawingService, private rendererFactory: RendererFactory2) {
        super(drawingService);
        this.name = 'Stamp';
        this.tooltip = 'Étampe(d)';
        this.iconName = 'insert_emoticon';
        this.toolProperties = new StampProperties();
        this.renderer = this.rendererFactory.createRenderer(null, null);
        this.rotateImageCanvas = this.renderer.createElement('canvas');
        this.resizeImageCanvas = this.renderer.createElement('canvas');
        const properties = this.toolProperties as StampProperties;
        this.imagePreview.src = properties.currentSticker.src;
        this.imagePreview.crossOrigin = '';
    }

    onClick(): void {
        this.draw();
        this.executedCommand.emit(this.clone());
    }

    draw(): void {
        this.drawingService.baseCtx.drawImage(this.imagePreview, this.finalPosition.x, this.finalPosition.y);
    }

    onMouseMove(event: MouseEvent): void {
        this.drawingService.previewCtx.canvas.style.cursor = 'none';
        const properties = this.toolProperties as StampProperties;
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.finalPosition.x = event.x - this.drawingService.baseCtx.canvas.getBoundingClientRect().x - properties.size / 2;
        this.finalPosition.y = event.y - this.drawingService.baseCtx.canvas.getBoundingClientRect().y - properties.size / 2;
        this.drawingService.previewCtx.drawImage(this.imagePreview, this.finalPosition.x, this.finalPosition.y);
    }

    onMouseScroll(event: WheelEvent): void {
        const properties = this.toolProperties as StampProperties;
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        properties.angle =
            (properties.angle + Math.sign(event.deltaY) * (this.altDown ? 1 : CONSTANTS.DEFAULT_ROTATION_ANGLE)) % CONSTANTS.MAXIMUM_ROTATION_ANGLE;
        this.updateImagePreviewURL();
        this.drawingService.previewCtx.drawImage(this.imagePreview, this.finalPosition.x, this.finalPosition.y);
    }

    onKeyDown(event: KeyboardEvent): void {
        this.altDown = event.key === 'Alt' ? true : this.altDown;
    }

    onKeyUp(event: KeyboardEvent): void {
        this.altDown = event.key === 'Alt' ? false : this.altDown;
    }

    updateImagePreviewURL(): void {
        const properties = this.toolProperties as StampProperties;
        const image = new Image();
        image.crossOrigin = '';
        image.src = properties.currentSticker.src;
        image.onload = () => {
            this.resizeImageCanvas.width = properties.size;
            this.resizeImageCanvas.height = properties.size;
            const ctx = this.resizeImageCanvas.getContext('2d') as CanvasRenderingContext2D;
            ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, properties.size, properties.size);
            image.src = this.resizeImageCanvas.toDataURL();
            image.onload = () => {
                this.rotateImageCanvas.width = properties.size;
                this.rotateImageCanvas.height = properties.size;
                const cctx = this.rotateImageCanvas.getContext('2d') as CanvasRenderingContext2D;
                cctx.translate(this.rotateImageCanvas.width / 2, this.rotateImageCanvas.height / 2);
                cctx.rotate((properties.angle * Math.PI) / CONSTANTS.ANGLE_180);
                cctx.drawImage(image, -image.width / 2, -image.width / 2);
                cctx.setTransform(1, 0, 0, 1, 0, 0);
                this.imagePreview.src = cctx.canvas.toDataURL();
            };
        };
    }

    clone(): Tool {
        const stampClone: StampService = new StampService(this.drawingService, this.rendererFactory);
        stampClone.imagePreview = new Image(this.imagePreview.width, this.imagePreview.height);
        stampClone.imagePreview.src = this.imagePreview.src;
        stampClone.finalPosition.x = this.finalPosition.x;
        stampClone.finalPosition.y = this.finalPosition.y;
        return stampClone;
    }
}
