import { EventEmitter, Injectable } from '@angular/core';
import { Command } from '@app/classes/commands/command';
import { Vec2 } from '@app/classes/vec2';
import { DEFAULT_HEIGHT, DEFAULT_WIDTH } from '@app/constants/constants';
import { AutomaticSavingService } from '@app/services/automatic-saving/automatic-saving.service';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class ResizeService extends Command {
    newWidth: number = 0;
    newHeight: number = 0;
    canvasSize: Vec2 = { x: DEFAULT_WIDTH, y: DEFAULT_HEIGHT };
    baseCtx: CanvasRenderingContext2D;
    imgData: ImageData;
    canvasResizedData: EventEmitter<string> = new EventEmitter<string>();

    constructor(private drawingService: DrawingService, private automaticSavingService: AutomaticSavingService) {
        super();
        this.baseCtx = drawingService.baseCtx;
    }

    resize(newWidth: number, newHeight: number): void {
        this.newWidth = newWidth;
        this.newHeight = newHeight;
        this.imgData = this.baseCtx.getImageData(0, 0, newWidth, newHeight);
        this.execute();
        this.executedCommand.emit(this.clone());
    }

    execute(): void {
        this.canvasSize.x = this.newWidth;
        this.canvasSize.y = this.newHeight;
        this.drawingService.baseCtx.canvas.width = this.newWidth;
        this.drawingService.baseCtx.canvas.height = this.newHeight;
        this.drawingService.previewCtx.canvas.width = this.newWidth;
        this.drawingService.previewCtx.canvas.height = this.newHeight;
    }

    copy(resizeService: ResizeService): void {
        resizeService.newWidth = this.newWidth;
        resizeService.newHeight = this.newHeight;
        resizeService.canvasSize = this.canvasSize;
        resizeService.imgData = this.imgData;
        resizeService.baseCtx = this.baseCtx;
    }

    clone(): ResizeService {
        const resizeServiceClone = new ResizeService(this.drawingService, this.automaticSavingService);
        this.copy(resizeServiceClone);
        return resizeServiceClone;
    }

    drawImage(): void {
        this.baseCtx.putImageData(this.imgData, 0, 0);
        this.automaticSavingService.save();
    }
}
