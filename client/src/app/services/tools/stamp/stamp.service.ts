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
    finalPosition: Vec2 = { x: 0, y: 0 };
    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.name = 'Stamp';
        this.tooltip = 'Étampe(d)';
        this.iconName = 'insert_emoticon';
        this.toolProperties = new StampProperties();
        this.src = '';
    }

    onClick(event: MouseEvent): void {
        const image = new Image();
        image.crossOrigin = '';
        image.src = this.src;
        this.drawingService.baseCtx.drawImage(image, this.finalPosition.x, this.finalPosition.y);
    }

    onMouseMove(event: MouseEvent): void {
        const image = new Image();
        image.crossOrigin = '';
        image.src = this.src;
        this.finalPosition.x = event.clientX - this.drawingService.baseCtx.canvas.getBoundingClientRect().x - image.width / 2;
        this.finalPosition.y = event.clientY - this.drawingService.baseCtx.canvas.getBoundingClientRect().y - image.height / 2;
        const cursorCtx = this.drawingService.previewCtx;
        this.drawingService.clearCanvas(cursorCtx);
        this.drawingService.previewCtx.drawImage(image, this.finalPosition.x, this.finalPosition.y);
        this.drawingService.previewCtx.canvas.style.cursor = 'none';
    }
}
