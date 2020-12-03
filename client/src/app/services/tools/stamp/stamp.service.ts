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
        //
        // this.drawingService.baseCtx.putImageData(this.image, 0, 0, 0, 0, this.image.width, this.image.height);
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
        this.moveSelection(event.x, event.y);
    }

    moveSelection(moveX: number, moveY: number): void {
        this.getImageData();
        this.finalPosition.x = moveX;
        this.finalPosition.y = moveY;

        this.drawingService.previewCtx.canvas.style.left = moveX + 'px';
        this.drawingService.previewCtx.canvas.style.top = moveY + 'px';

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
    }
}
