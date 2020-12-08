import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool/tool';
import { StampProperties } from '@app/classes/tools-properties/stamp-properties';
import { Vec2 } from '@app/classes/vec2';
import { DEFAULT_ROTATION_ANGLE, MAXIMUM_ROTATION_ANGLE } from '@app/constants/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class StampService extends Tool {
    src: string = '../../../assets/stamp/1.png';
    finalPosition: Vec2 = { x: 0, y: 0 };
    uploadedImage: File;
    size: number = 100;
    private angle: number = 144;
    private atlDown: boolean = false;
    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.name = 'Stamp';
        this.tooltip = 'Étampe(d)';
        this.iconName = 'insert_emoticon';
        this.toolProperties = new StampProperties();
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

        // image.onload = () => {
        //     image.style.transform = `rotate(${this.angle}deg)`;
        // };

        this.finalPosition.x = event.x - this.drawingService.baseCtx.canvas.getBoundingClientRect().x - image.width / 2;
        this.finalPosition.y = event.y - this.drawingService.baseCtx.canvas.getBoundingClientRect().y - image.height / 2;
        const cursorCtx = this.drawingService.previewCtx;
        this.drawingService.clearCanvas(cursorCtx);
        this.drawingService.previewCtx.drawImage(image, this.finalPosition.x, this.finalPosition.y);
        this.drawingService.previewCtx.canvas.style.cursor = 'none';
    }

    onMouseScroll(event: WheelEvent): void {
        const previewCtx = this.drawingService.previewCtx.canvas.getContext('2d');
        this.angle = (this.angle + Math.sign(event.deltaY) * (this.atlDown ? 1 : DEFAULT_ROTATION_ANGLE)) % MAXIMUM_ROTATION_ANGLE;
        if (this.angle < 0) this.angle = MAXIMUM_ROTATION_ANGLE + this.angle;
        previewCtx?.rotate(this.angle);
    }

    onKeyDown(event: KeyboardEvent): void {
        this.atlDown = event.key === 'Alt' ? true : this.atlDown;
    }

    onKeyUp(event: KeyboardEvent): void {
        // TODO: verifier bug avec ALT+TAB
        this.atlDown = event.key === 'Alt' ? false : this.atlDown;
    }
}
