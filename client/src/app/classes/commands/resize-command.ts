import { Vec2 } from '@app/classes/vec2';
import { DEFAULT_HEIGHT, DEFAULT_WIDTH } from '@app/constants/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { Command } from './command';

export class ResizeCommand extends Command {
    newWidth: number;
    newHeight: number;
    canvasSize: Vec2 = { x: DEFAULT_WIDTH, y: DEFAULT_HEIGHT };
    baseCtx: CanvasRenderingContext2D;
    imgData: ImageData;

    constructor(private drawingService: DrawingService) {
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

    copy(resizeCommand: ResizeCommand): void {
        resizeCommand.newWidth = this.newWidth;
        resizeCommand.newHeight = this.newHeight;
        resizeCommand.canvasSize = this.canvasSize;
        resizeCommand.imgData = this.imgData;
        resizeCommand.baseCtx = this.baseCtx;
    }

    clone(): ResizeCommand {
        const resizeCommandClone = new ResizeCommand(this.drawingService);
        this.copy(resizeCommandClone);
        return resizeCommandClone;
    }

    drawImage(): void {
        this.baseCtx.putImageData(this.imgData, 0, 0);
    }
}
