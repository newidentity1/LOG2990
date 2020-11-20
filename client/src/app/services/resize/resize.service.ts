import { EventEmitter, Injectable, OnDestroy } from '@angular/core';
import { Command } from '@app/classes/commands/command';
import { Vec2 } from '@app/classes/vec2';
import { DEFAULT_HEIGHT, DEFAULT_WIDTH } from '@app/constants/constants';
import { AutomaticSavingService } from '@app/services/automatic-saving/automatic-saving.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { Subscription } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ResizeService extends Command implements OnDestroy {
    newWidth: number = 0;
    newHeight: number = 0;
    canvasSize: Vec2 = { x: DEFAULT_WIDTH, y: DEFAULT_HEIGHT };
    baseCtx: CanvasRenderingContext2D;
    img: HTMLImageElement = new Image();
    canvasResizedData: EventEmitter<string> = new EventEmitter<string>();
    private subscribeRecoverImage: Subscription;

    constructor(private drawingService: DrawingService, private automaticSavingService: AutomaticSavingService) {
        super();
        this.subscribeRecoverImage = this.automaticSavingService.recoverImage.subscribe((img: HTMLImageElement) => {
            this.resizeFromImage(img);
        });
        this.baseCtx = drawingService.baseCtx;
    }

    ngOnDestroy(): void {
        this.subscribeRecoverImage.unsubscribe();
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
        resizeService.baseCtx = this.baseCtx;
    }

    clone(): ResizeService {
        const resizeServiceClone = new ResizeService(this.drawingService, this.automaticSavingService);
        this.copy(resizeServiceClone);
        return resizeServiceClone;
    }

    drawImage(): void {
        setTimeout(() => {
            this.drawingService.baseCtx.drawImage(this.img, 0, 0);
            this.automaticSavingService.save();
        }, 0);
    }
}
