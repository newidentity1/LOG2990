import { Injectable } from '@angular/core';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class ClipboardService {
    clipboardImage: ImageData;

    constructor(private drawingService: DrawingService) {}

    copySelection(imageData: ImageData): void {
        this.clipboardImage = new ImageData(new Uint8ClampedArray(imageData.data), imageData.width, imageData.height);
    }

    pasteSelection(): void {
        // TODO make this better
        // this.isAreaSelected = true;
        // this.moveSelectionService.imgData = this.clipboardImage;
        // this.selectionImageData = this.moveSelectionService.imgData;
        this.drawingService.previewCtx.canvas.width = this.clipboardImage.width;
        this.drawingService.previewCtx.canvas.height = this.clipboardImage.height;
        this.drawingService.previewCtx.putImageData(this.clipboardImage, 0, 0);
        this.drawingService.previewCtx.canvas.style.cursor = 'move';
        // this.drawSelectionBox({ x: 0, y: 0 }, this.positiveWidth, this.positiveHeight);
    }
}
