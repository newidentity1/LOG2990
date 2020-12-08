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
    src: string = '../../../assets/stamp/1.png';
    finalPosition: Vec2 = { x: 0, y: 0 };
    size: number = 100;
    private angle: number = Math.PI;
    private atlDown: boolean = false;
    private renderer: Renderer2;
    private selectionImageCanvas: HTMLCanvasElement;
    private resizeImageCanvas: HTMLCanvasElement;
    private imagePreviewURL: string = '../../../assets/stamp/1.png';
    private imagePreview = new Image();
    constructor(drawingService: DrawingService, private rendererFactory: RendererFactory2) {
        super(drawingService);
        this.name = 'Stamp';
        this.tooltip = 'Étampe(d)';
        this.iconName = 'insert_emoticon';
        this.toolProperties = new StampProperties();
        this.renderer = this.rendererFactory.createRenderer(null, null);
        this.selectionImageCanvas = this.renderer.createElement('canvas');
        this.resizeImageCanvas = this.renderer.createElement('canvas');
    }

    onClick(event: MouseEvent): void {
        this.getImagePreviewURL();
        this.drawingService.baseCtx.drawImage(this.imagePreview, this.finalPosition.x, this.finalPosition.y);
    }

    onMouseMove(event: MouseEvent): void {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.finalPosition.x = event.x - this.drawingService.baseCtx.canvas.getBoundingClientRect().x - this.size / 2;
        this.finalPosition.y = event.y - this.drawingService.baseCtx.canvas.getBoundingClientRect().y - this.size / 2;
        this.drawingService.previewCtx.drawImage(this.imagePreview, this.finalPosition.x, this.finalPosition.y);
    }

    onMouseScroll(event: WheelEvent): void {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.getImagePreviewURL();
        this.angle =
            (this.angle + Math.sign(event.deltaY) * (this.atlDown ? 1 : CONSTANTS.DEFAULT_ROTATION_ANGLE)) % CONSTANTS.MAXIMUM_ROTATION_ANGLE;
        if (this.angle < 0) {
            this.angle = CONSTANTS.MAXIMUM_ROTATION_ANGLE + this.angle;
        }
        this.drawingService.previewCtx.drawImage(this.imagePreview, this.finalPosition.x, this.finalPosition.y);
    }
    onKeyDown(event: KeyboardEvent): void {
        this.atlDown = event.key === 'Alt' ? true : this.atlDown;
    }

    onKeyUp(event: KeyboardEvent): void {
        this.atlDown = event.key === 'Alt' ? false : this.atlDown;
    }

    getImagePreviewURL(): void {
        const image = new Image();
        image.crossOrigin = '';
        image.src = this.resizeImage();
        this.selectionImageCanvas.width = this.size;
        this.selectionImageCanvas.height = this.size;
        const ctx = this.selectionImageCanvas.getContext('2d') as CanvasRenderingContext2D;
        ctx.translate(this.selectionImageCanvas.width / 2, this.selectionImageCanvas.height / 2);
        ctx.rotate(this.angle);
        ctx.drawImage(image, -image.width / 2, -image.width / 2);
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.imagePreview.src = ctx.canvas.toDataURL();
    }

    resizeImage(): string {
        const image = new Image();
        image.crossOrigin = '';
        image.src = this.src;
        this.resizeImageCanvas.width = this.size;
        this.resizeImageCanvas.height = this.size;
        const ctx = this.resizeImageCanvas.getContext('2d') as CanvasRenderingContext2D;
        ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, this.size, this.size);
        return this.resizeImageCanvas.toDataURL();
    }
}
