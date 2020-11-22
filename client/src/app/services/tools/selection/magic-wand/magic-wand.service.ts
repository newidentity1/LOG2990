import { Injectable } from '@angular/core';
import { Pixel } from '@app/classes/pixel';
import { Vec2 } from '@app/classes/vec2';
import { IMAGE_DATA_OPACITY_INDEX, MAX_COLOR_VALUE } from '@app/constants/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class MagicWandService {
    imgData: ImageData;
    // private imgDataWithOutline: ImageData;
    private startingPosition: Vec2 = { x: 0, y: 0 };
    private shapeOutlineIndexes: number[] = [];

    constructor(private drawingService: DrawingService) {}

    copyMagicSelectionRight(selectionPixelPosition: Vec2): void {
        const selectionCtx = this.drawingService.previewCtx;
        this.startingPosition = { x: this.drawingService.canvas.width, y: this.drawingService.canvas.height } as Vec2;
        const selectionSize = { x: 0, y: 0 } as Vec2;

        const startingColor = this.drawingService.baseCtx.getImageData(selectionPixelPosition.x, selectionPixelPosition.y, 1, 1).data;
        this.changeTransparentToWhite(startingColor);

        this.imgData = this.drawingService.baseCtx.getImageData(0, 0, this.drawingService.canvas.width, this.drawingService.canvas.height);
        const areaToClear = this.drawingService.baseCtx.getImageData(0, 0, this.drawingService.canvas.width, this.drawingService.canvas.height);

        let y = 0;
        for (let i = 0; i < this.imgData.data.length; i += IMAGE_DATA_OPACITY_INDEX + 1) {
            const x = (i / (IMAGE_DATA_OPACITY_INDEX + 1)) % this.imgData.width;
            if (x === 0) y++;
            const pixelToCheckData = [
                this.imgData.data[i],
                this.imgData.data[i + 1],
                this.imgData.data[i + 2],
                this.imgData.data[i + IMAGE_DATA_OPACITY_INDEX],
            ];
            const pixelToCheck = new Uint8ClampedArray(pixelToCheckData);
            if (this.isColorMatchingStartingColor(pixelToCheck, startingColor)) {
                this.startingPosition.x = Math.min(this.startingPosition.x, x);
                this.startingPosition.y = Math.min(this.startingPosition.y, y);
                selectionSize.x = Math.max(selectionSize.x, x - this.startingPosition.x + 1);
                selectionSize.y = Math.max(selectionSize.y, y - this.startingPosition.y + 1);
                areaToClear.data[i] = 0;
                areaToClear.data[i + 1] = 0;
                areaToClear.data[i + 2] = 0;
                areaToClear.data[i + IMAGE_DATA_OPACITY_INDEX] = 0;

                if (this.imgData.data[i + IMAGE_DATA_OPACITY_INDEX] === 0) {
                    this.imgData.data[i] = MAX_COLOR_VALUE;
                    this.imgData.data[i + 1] = MAX_COLOR_VALUE;
                    this.imgData.data[i + 2] = MAX_COLOR_VALUE;
                    this.imgData.data[i + IMAGE_DATA_OPACITY_INDEX] = MAX_COLOR_VALUE;
                }
            } else {
                this.imgData.data[i] = 0;
                this.imgData.data[i + 1] = 0;
                this.imgData.data[i + 2] = 0;
                this.imgData.data[i + IMAGE_DATA_OPACITY_INDEX] = 0;
                continue;
            }
        }
        selectionCtx.putImageData(this.imgData, 0, 0, 0, 0, this.imgData.width, this.imgData.height);
        this.imgData = selectionCtx.getImageData(this.startingPosition.x, this.startingPosition.y, selectionSize.x, selectionSize.y);
        selectionCtx.canvas.width = selectionSize.x;
        selectionCtx.canvas.height = selectionSize.y;
        selectionCtx.canvas.style.left = this.startingPosition.x + 'px';
        selectionCtx.canvas.style.top = this.startingPosition.y + 'px';
        selectionCtx.putImageData(this.imgData, 0, 0, 0, 0, this.imgData.width, this.imgData.height);
        this.drawingService.baseCtx.putImageData(areaToClear, 0, 0);
        selectionCtx.canvas.style.cursor = 'move';
    }

    copyMagicSelectionLeft(selectionPixelPosition: Vec2): void {
        this.shapeOutlineIndexes = [];
        const canvasWidth = this.drawingService.canvas.width;
        const canvasHeight = this.drawingService.canvas.height;
        this.startingPosition = { x: canvasWidth, y: canvasHeight } as Vec2;
        const selectionSize = { x: 0, y: 0 } as Vec2;

        const startingColor = this.drawingService.baseCtx.getImageData(selectionPixelPosition.x, selectionPixelPosition.y, 1, 1).data;
        this.changeTransparentToWhite(startingColor);

        this.imgData = new ImageData(canvasWidth, canvasHeight);
        const areaToClear = this.drawingService.baseCtx.getImageData(0, 0, canvasWidth, canvasHeight);

        const matrix = this.generatePixelMatrix();
        const queue: Vec2[] = [selectionPixelPosition];
        while (queue.length > 0) {
            const pixel = queue.pop();
            if (pixel) {
                matrix[pixel.x][pixel.y].status = 1;
                let offset = (pixel.y * canvasWidth + pixel.x) * (IMAGE_DATA_OPACITY_INDEX + 1);
                // select pixel
                this.imgData.data[offset] = startingColor[0];
                this.imgData.data[offset + 1] = startingColor[1];
                this.imgData.data[offset + 2] = startingColor[2];
                this.imgData.data[offset + IMAGE_DATA_OPACITY_INDEX] = startingColor[IMAGE_DATA_OPACITY_INDEX];

                areaToClear.data[offset] = MAX_COLOR_VALUE;
                areaToClear.data[offset + 1] = MAX_COLOR_VALUE;
                areaToClear.data[offset + 2] = MAX_COLOR_VALUE;
                areaToClear.data[offset + IMAGE_DATA_OPACITY_INDEX] = MAX_COLOR_VALUE;

                this.startingPosition.x = Math.min(this.startingPosition.x, pixel.x);
                this.startingPosition.y = Math.min(this.startingPosition.y, pixel.y);
                selectionSize.x = Math.max(selectionSize.x, pixel.x - this.startingPosition.x + 1);
                selectionSize.y = Math.max(selectionSize.y, pixel.y - this.startingPosition.y + 1);

                for (let i = -1; i < 2; i++) {
                    for (let j = -1; j < 2; j++) {
                        offset = ((pixel.y + j) * canvasWidth + pixel.x + i) * (IMAGE_DATA_OPACITY_INDEX + 1);

                        const pixelToCheckData = [
                            areaToClear.data[offset],
                            areaToClear.data[offset + 1],
                            areaToClear.data[offset + 2],
                            areaToClear.data[offset + IMAGE_DATA_OPACITY_INDEX],
                        ];
                        const pixelToCheck = new Uint8ClampedArray(pixelToCheckData);

                        const neighboorPixel = { x: pixel.x + i, y: pixel.y + j };
                        if (neighboorPixel.x >= 0 && neighboorPixel.x < canvasWidth && neighboorPixel.y >= 0 && neighboorPixel.y < canvasHeight) {
                            if (matrix[neighboorPixel.x][neighboorPixel.y].status === 0) {
                                if (this.isColorMatchingStartingColor(pixelToCheck, startingColor)) {
                                    queue.push(neighboorPixel);
                                } else {
                                    this.shapeOutlineIndexes.push(offset);
                                }
                            }
                        }
                    }
                }
            }
        }
        // this.imgDataWithOutline = new ImageData(selectionSize.x, selectionSize.y);
        // this.imgDataWithOutline.data.set(this.imgData.data);
        // for (const index of this.shapeOutlineIndexes) {
        //     this.imgDataWithOutline.data[index] = MAX_COLOR_VALUE - 255;
        //     this.imgDataWithOutline.data[index + 1] = MAX_COLOR_VALUE - 0;
        //     this.imgDataWithOutline.data[index + 2] = MAX_COLOR_VALUE - 0;
        //     this.imgDataWithOutline.data[index + IMAGE_DATA_OPACITY_INDEX] = MAX_COLOR_VALUE;
        // }
        // this.drawSelectionOutline(this.imgData.width, this.imgData.height);

        const selectionCtx = this.drawingService.previewCtx;
        selectionCtx.putImageData(this.imgData, 0, 0, 0, 0, this.imgData.width, this.imgData.height);
        this.imgData = selectionCtx.getImageData(this.startingPosition.x, this.startingPosition.y, selectionSize.x, selectionSize.y);
        selectionCtx.canvas.width = selectionSize.x;
        selectionCtx.canvas.height = selectionSize.y;
        selectionCtx.canvas.style.left = this.startingPosition.x + 'px';
        selectionCtx.canvas.style.top = this.startingPosition.y + 'px';
        selectionCtx.putImageData(this.imgData, 0, 0, 0, 0, this.imgData.width, this.imgData.height);
        this.drawingService.baseCtx.putImageData(areaToClear, 0, 0);
        selectionCtx.canvas.style.cursor = 'move';
    }

    private generatePixelMatrix(): Pixel[][] {
        const matrix: Pixel[][] = [];
        for (let i = 0; i < this.drawingService.canvas.width; i++) {
            const line: Pixel[] = [];
            for (let j = 0; j < this.drawingService.canvas.height; j++) {
                const pixel: Pixel = { x: i, y: j, status: 0 };
                line.push(pixel);
            }
            matrix.push(line);
        }
        return matrix;
    }

    private changeTransparentToWhite(transparentPixel: Uint8ClampedArray) {
        if (transparentPixel[IMAGE_DATA_OPACITY_INDEX] === 0) {
            transparentPixel[0] = MAX_COLOR_VALUE;
            transparentPixel[1] = MAX_COLOR_VALUE;
            transparentPixel[2] = MAX_COLOR_VALUE;
            transparentPixel[IMAGE_DATA_OPACITY_INDEX] = MAX_COLOR_VALUE;
        }
    }

    private isColorMatchingStartingColor(pixelToCheck: Uint8ClampedArray, startingColor: Uint8ClampedArray): boolean {
        // checking white and transparent color
        if (
            startingColor[0] === MAX_COLOR_VALUE &&
            startingColor[1] === MAX_COLOR_VALUE &&
            startingColor[2] === MAX_COLOR_VALUE &&
            startingColor[IMAGE_DATA_OPACITY_INDEX] === MAX_COLOR_VALUE &&
            pixelToCheck[IMAGE_DATA_OPACITY_INDEX] === 0
        ) {
            return true;
        }
        return (
            pixelToCheck[0] === startingColor[0] &&
            pixelToCheck[1] === startingColor[1] &&
            pixelToCheck[2] === startingColor[2] &&
            pixelToCheck[IMAGE_DATA_OPACITY_INDEX] === startingColor[IMAGE_DATA_OPACITY_INDEX]
        );
    }

    drawSelectionOutline(width: number, height: number): void {
        // this.drawingService.previewCtx
        // .putImageData(this.imgDataWithOutline, -this.startingPosition.x, -this.startingPosition.y, 0, 0, width, height);
    }
}
