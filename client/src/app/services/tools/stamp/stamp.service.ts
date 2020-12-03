import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool/tool';
import { StampProperties } from '@app/classes/tools-properties/stamp-properties';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class StampService extends Tool {
    src: string = '../../../assets/stamp/1.png';
    imageData: ImageData;
    finalPosition: Vec2 = { x: 0, y: 0 };
    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.name = 'Stamp';
        this.tooltip = 'Étampe(d)';
        this.iconName = 'insert_emoticon';
        this.toolProperties = new StampProperties();
        this.src = '../../../assets/stamp/1.png';
    }

    onClick(event: MouseEvent): void {
        console.log('on est ici');
        this.drawingService.baseCtx.putImageData(
            this.imageData,
            this.finalPosition.x,
            this.finalPosition.y,
            0,
            0,
            this.imageData.width,
            this.imageData.height,
        );
    }

    getImageData(): void {
        const image = new Image();
        image.crossOrigin = '';
        image.src = this.src;
        image.onload = () => {
            this.drawingService.previewCtx.canvas.width = image.width;
            this.drawingService.previewCtx.canvas.height = image.height;
            this.drawingService.previewCtx.drawImage(image, 0, 0);
            this.imageData = this.drawingService.previewCtx.getImageData(0, 0, image.width, image.height);
            // this.drawingService.clearCanvas(this.drawingService.previewCtx);
        };
    }

    onMouseMove(event: MouseEvent): void {
        const x = event.clientX - this.drawingService.baseCtx.canvas.getBoundingClientRect().x;
        const y = event.clientY - this.drawingService.baseCtx.canvas.getBoundingClientRect().y;
        this.moveSelection(x, y);
    }

    moveSelection(moveX: number, moveY: number): void {
        this.getImageData();
        this.finalPosition.x = moveX - this.imageData.width / 2;
        this.finalPosition.y = moveY - this.imageData.height / 2;

        this.drawingService.previewCtx.canvas.style.left = moveX - this.imageData.width / 2 + 'px';
        this.drawingService.previewCtx.canvas.style.top = moveY - this.imageData.height / 2 + 'px';

        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.drawingService.previewCtx.putImageData(
            this.imageData,
            0,
            0,
            this.finalPosition.x >= 0 ? 0 : -this.finalPosition.x,
            this.finalPosition.y >= 0 ? 0 : -this.finalPosition.y,
            this.drawingService.canvas.width - this.finalPosition.x,
            this.drawingService.canvas.height - this.finalPosition.y,
        );
        const selectionCtx = this.drawingService.previewCtx;
        selectionCtx.canvas.style.cursor = 'none';
    }

    resetContext(): void {
        console.log('Reset');
        const previewCtx = this.drawingService.previewCtx;
        const baseCtx = this.drawingService.baseCtx;
        previewCtx.lineCap = baseCtx.lineCap = 'butt';
        previewCtx.lineJoin = baseCtx.lineJoin = 'miter';
        this.mouseDown = false;
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.setThickness(this.toolProperties.thickness);
    }
}
