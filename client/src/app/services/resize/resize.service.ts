import { EventEmitter, Injectable } from '@angular/core';
import { Command } from '@app/classes/commands/command';
import { Vec2 } from '@app/classes/vec2';
import { CANVAS_MARGIN_LEFT, CANVAS_MIN_HEIGHT, CANVAS_MIN_WIDTH, DEFAULT_HEIGHT, DEFAULT_WIDTH } from '@app/constants/constants';
import { ControlPoint } from '@app/enums/control-point.enum';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class ResizeService extends Command {
    private newWidth: number = 0;
    private newHeight: number = 0;
    private img: HTMLImageElement = new Image();
    canvasSize: Vec2 = { x: DEFAULT_WIDTH, y: DEFAULT_HEIGHT };
    imageDrawn: EventEmitter<void> = new EventEmitter<void>();
    isResizing: boolean = false;
    controlPoint: ControlPoint | null = null;

    constructor(private drawingService: DrawingService) {
        super();
    }

    resizeFromImage(img: HTMLImageElement): void {
        this.img = img;
        this.newWidth = img.width;
        this.newHeight = img.height;
        this.execute();
        this.drawImage();
        this.executedCommand.emit(this.clone());
    }

    resize(newWidth: number, newHeight: number): void {
        this.newWidth = newWidth;
        this.newHeight = newHeight;

        const imgDataURL = this.drawingService.canvas.toDataURL();
        this.execute();

        this.img.src = imgDataURL;
        this.img.onload = () => {
            this.drawImage();
            this.executedCommand.emit(this.clone());
        };
    }

    onResizeStart(controlPoint: ControlPoint): void {
        this.isResizing = true;
        this.controlPoint = controlPoint;
    }

    resetResize(): void {
        this.isResizing = false;
        this.controlPoint = null;
    }

    onResizeWidth(event: MouseEvent, drawingContainerWidth: number): void {
        if (this.controlPoint !== ControlPoint.BottomCenter && this.controlPoint !== ControlPoint.TopCenter && this.isResizing) {
            event.preventDefault();
            let newWidth = event.clientX - this.drawingService.canvas.getBoundingClientRect().x;
            const widthLimit = drawingContainerWidth - CANVAS_MARGIN_LEFT;
            if (newWidth < CANVAS_MIN_WIDTH) {
                newWidth = CANVAS_MIN_WIDTH;
            } else if (newWidth > widthLimit) {
                newWidth = widthLimit;
            }
            this.drawingService.previewCtx.canvas.width = newWidth;
        }
    }

    onResizeHeight(event: MouseEvent, drawingContainerHeight: number): void {
        if (this.controlPoint !== ControlPoint.CenterLeft && this.controlPoint !== ControlPoint.CenterRight && this.isResizing) {
            event.preventDefault();
            let newHeight = event.clientY - this.drawingService.canvas.getBoundingClientRect().y;
            const heightLimit = drawingContainerHeight - CANVAS_MARGIN_LEFT;
            if (newHeight < CANVAS_MIN_HEIGHT) {
                newHeight = CANVAS_MIN_HEIGHT;
            } else if (newHeight > heightLimit) {
                newHeight = heightLimit;
            }
            this.drawingService.previewCtx.canvas.height = newHeight;
        }
    }

    execute(): void {
        this.drawingService.baseCtx.canvas.width = this.newWidth;
        this.drawingService.baseCtx.canvas.height = this.newHeight;
        this.drawingService.previewCtx.canvas.width = this.newWidth;
        this.drawingService.previewCtx.canvas.height = this.newHeight;
        this.canvasSize.x = this.newWidth;
        this.canvasSize.y = this.newHeight;
    }

    copy(resizeService: ResizeService): void {
        resizeService.newWidth = this.newWidth;
        resizeService.newHeight = this.newHeight;
        resizeService.canvasSize = this.canvasSize;
        resizeService.img = new Image();
        resizeService.img.src = this.img.src;
        resizeService.img.crossOrigin = this.img.crossOrigin;
    }

    clone(): ResizeService {
        const resizeServiceClone = new ResizeService(this.drawingService);
        this.copy(resizeServiceClone);
        return resizeServiceClone;
    }

    drawImage(): void {
        setTimeout(() => {
            this.drawingService.baseCtx.drawImage(this.img, 0, 0);
            this.imageDrawn.emit();
        }, 0);
    }
}
