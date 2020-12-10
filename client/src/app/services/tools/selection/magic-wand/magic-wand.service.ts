import { Injectable } from '@angular/core';
import { Pixel } from '@app/classes/pixel';
import { Vec2 } from '@app/classes/vec2';
import { IMAGE_DATA_OPACITY_INDEX, MAGIC_WAND_OUTLINE_COLOR_ALTERNATION_VALUE, MAX_COLOR_VALUE } from '@app/constants/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class MagicWandService {
    imgData: ImageData;
    private imgDataWithOutline: ImageData;
    startingPosition: Vec2 = { x: 0, y: 0 };
    selectionSize: Vec2 = { x: 0, y: 0 };
    private areaToClear: ImageData;
    private shapeOutlineIndexes: number[] = [];
    private startingColor: Uint8ClampedArray;

    constructor(private drawingService: DrawingService) {}

    copyMagicSelection(selectionPixelPosition: Vec2, isLeftClick: boolean): void {
        this.initializeSelectionProperties(selectionPixelPosition);

        if (isLeftClick) this.copyMagicSelectionLeft(selectionPixelPosition);
        else this.copyMagicSelectionRight();

        this.selectionSize.x = this.selectionSize.x - this.startingPosition.x + 1;
        this.selectionSize.y = this.selectionSize.y - this.startingPosition.y + 1;
        this.drawOutline();
        this.copySelectionToPreviewCtx();
    }

    private initializeSelectionProperties(selectionPixelPosition: Vec2): void {
        this.startingPosition = { x: this.drawingService.canvas.width, y: this.drawingService.canvas.height };
        this.shapeOutlineIndexes = [];
        this.selectionSize = { x: 0, y: 0 };
        this.startingColor = this.drawingService.baseCtx.getImageData(selectionPixelPosition.x, selectionPixelPosition.y, 1, 1).data;
        this.changeTransparentToWhite(this.startingColor);
        this.areaToClear = this.drawingService.baseCtx.getImageData(0, 0, this.drawingService.canvas.width, this.drawingService.canvas.height);
    }

    private copyMagicSelectionRight(): void {
        this.imgData = this.drawingService.baseCtx.getImageData(0, 0, this.drawingService.canvas.width, this.drawingService.canvas.height);

        for (let i = 0; i < this.imgData.data.length; i += IMAGE_DATA_OPACITY_INDEX + 1) {
            const x = (i / (IMAGE_DATA_OPACITY_INDEX + 1)) % this.imgData.width;
            const y = Math.floor(i / (IMAGE_DATA_OPACITY_INDEX + 1) / this.imgData.width);

            const pixelToCheckData = [
                this.imgData.data[i],
                this.imgData.data[i + 1],
                this.imgData.data[i + 2],
                this.imgData.data[i + IMAGE_DATA_OPACITY_INDEX],
            ];
            const pixelToCheck = new Uint8ClampedArray(pixelToCheckData);
            if (this.isColorMatchingStartingColor(pixelToCheck, this.startingColor)) {
                this.startingPosition.x = Math.min(this.startingPosition.x, x);
                this.startingPosition.y = Math.min(this.startingPosition.y, y);
                this.selectionSize.x = Math.max(this.selectionSize.x, x);
                this.selectionSize.y = Math.max(this.selectionSize.y, y);
                this.areaToClear.data[i] = 0;
                this.areaToClear.data[i + 1] = 0;
                this.areaToClear.data[i + 2] = 0;
                this.areaToClear.data[i + IMAGE_DATA_OPACITY_INDEX] = 0;

                if (this.imgData.data[i + IMAGE_DATA_OPACITY_INDEX] === 0) {
                    this.imgData.data[i] = MAX_COLOR_VALUE;
                    this.imgData.data[i + 1] = MAX_COLOR_VALUE;
                    this.imgData.data[i + 2] = MAX_COLOR_VALUE;
                    this.imgData.data[i + IMAGE_DATA_OPACITY_INDEX] = MAX_COLOR_VALUE;
                }
            } else {
                const neighborPixels: Vec2[] = [];
                for (let j = -1; j < 2; j++) {
                    for (let k = -1; k < 2; k++) {
                        const neighborPixel: Vec2 = { x: x + k, y: y + j };
                        neighborPixels.push(neighborPixel);
                    }
                }
                const hasMatchingNeighbor = neighborPixels.some((neighborPixel) => {
                    const neighborPixelOffset =
                        (neighborPixel.y * this.drawingService.canvas.width + neighborPixel.x) * (IMAGE_DATA_OPACITY_INDEX + 1);

                    return (
                        this.imgData.data[neighborPixelOffset] === this.startingColor[0] &&
                        this.imgData.data[neighborPixelOffset + 1] === this.startingColor[1] &&
                        this.imgData.data[neighborPixelOffset + 2] === this.startingColor[2] &&
                        this.imgData.data[neighborPixelOffset + IMAGE_DATA_OPACITY_INDEX] === this.startingColor[IMAGE_DATA_OPACITY_INDEX]
                    );
                });
                if (hasMatchingNeighbor) {
                    this.shapeOutlineIndexes.push(i);
                }
                this.imgData.data[i] = 0;
                this.imgData.data[i + 1] = 0;
                this.imgData.data[i + 2] = 0;
                this.imgData.data[i + IMAGE_DATA_OPACITY_INDEX] = 0;
            }
        }
    }

    private copyMagicSelectionLeft(selectionPixelPosition: Vec2): void {
        const canvasWidth = this.drawingService.canvas.width;
        const canvasHeight = this.drawingService.canvas.height;

        this.imgData = new ImageData(canvasWidth, canvasHeight);

        const matrix = this.generatePixelMatrix();
        const queue: Vec2[] = [selectionPixelPosition];
        while (queue.length > 0) {
            const pixel = queue[queue.length - 1];
            queue.pop();

            matrix[pixel.x][pixel.y].status = 1;
            let offset = (pixel.y * canvasWidth + pixel.x) * (IMAGE_DATA_OPACITY_INDEX + 1);

            this.imgData.data[offset] = this.startingColor[0];
            this.imgData.data[offset + 1] = this.startingColor[1];
            this.imgData.data[offset + 2] = this.startingColor[2];
            this.imgData.data[offset + IMAGE_DATA_OPACITY_INDEX] = this.startingColor[IMAGE_DATA_OPACITY_INDEX];

            this.areaToClear.data[offset] = MAX_COLOR_VALUE;
            this.areaToClear.data[offset + 1] = MAX_COLOR_VALUE;
            this.areaToClear.data[offset + 2] = MAX_COLOR_VALUE;
            this.areaToClear.data[offset + IMAGE_DATA_OPACITY_INDEX] = MAX_COLOR_VALUE;

            this.startingPosition.x = Math.min(this.startingPosition.x, pixel.x);
            this.startingPosition.y = Math.min(this.startingPosition.y, pixel.y);
            this.selectionSize.x = Math.max(this.selectionSize.x, pixel.x);
            this.selectionSize.y = Math.max(this.selectionSize.y, pixel.y);

            for (let i = -1; i < 2; i++) {
                for (let j = -1; j < 2; j++) {
                    offset = ((pixel.y + j) * canvasWidth + pixel.x + i) * (IMAGE_DATA_OPACITY_INDEX + 1);

                    const pixelToCheckData = [
                        this.areaToClear.data[offset],
                        this.areaToClear.data[offset + 1],
                        this.areaToClear.data[offset + 2],
                        this.areaToClear.data[offset + IMAGE_DATA_OPACITY_INDEX],
                    ];
                    const pixelToCheck = new Uint8ClampedArray(pixelToCheckData);

                    const neighborPixel = { x: pixel.x + i, y: pixel.y + j };
                    if (neighborPixel.x >= 0 && neighborPixel.x < canvasWidth && neighborPixel.y >= 0 && neighborPixel.y < canvasHeight) {
                        if (matrix[neighborPixel.x][neighborPixel.y].status === 0) {
                            matrix[neighborPixel.x][neighborPixel.y].status = 1;
                            if (this.isColorMatchingStartingColor(pixelToCheck, this.startingColor)) {
                                queue.push(neighborPixel);
                            } else {
                                this.shapeOutlineIndexes.push(offset);
                            }
                        }
                    }
                }
            }
        }
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

    private changeTransparentToWhite(transparentPixel: Uint8ClampedArray): void {
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

    private drawOutline(): void {
        this.imgDataWithOutline = new ImageData(this.drawingService.canvas.width, this.drawingService.canvas.height);
        this.imgDataWithOutline.data.set(this.imgData.data);
        for (const index of this.shapeOutlineIndexes) {
            this.imgDataWithOutline.data[index] = (index % MAGIC_WAND_OUTLINE_COLOR_ALTERNATION_VALUE) * MAX_COLOR_VALUE;
            this.imgDataWithOutline.data[index + 1] = (index % MAGIC_WAND_OUTLINE_COLOR_ALTERNATION_VALUE) * MAX_COLOR_VALUE;
            this.imgDataWithOutline.data[index + 2] = (index % MAGIC_WAND_OUTLINE_COLOR_ALTERNATION_VALUE) * MAX_COLOR_VALUE;
            this.imgDataWithOutline.data[index + IMAGE_DATA_OPACITY_INDEX] = MAX_COLOR_VALUE;
        }
    }

    private copySelectionToPreviewCtx(): void {
        const canvasWidth = this.drawingService.canvas.width;
        const canvasHeight = this.drawingService.canvas.height;

        const selectionCtx = this.drawingService.previewCtx;
        selectionCtx.putImageData(this.imgData, 0, 0, 0, 0, canvasWidth, canvasHeight);
        this.imgData = selectionCtx.getImageData(this.startingPosition.x, this.startingPosition.y, this.selectionSize.x, this.selectionSize.y);
        selectionCtx.putImageData(this.imgDataWithOutline, 0, 0, 0, 0, canvasWidth, canvasHeight);
        this.imgDataWithOutline = selectionCtx.getImageData(
            this.startingPosition.x,
            this.startingPosition.y,
            this.selectionSize.x,
            this.selectionSize.y,
        );
        selectionCtx.canvas.width = this.selectionSize.x;
        selectionCtx.canvas.height = this.selectionSize.y;
        selectionCtx.canvas.style.left = this.startingPosition.x + 'px';
        selectionCtx.canvas.style.top = this.startingPosition.y + 'px';
        selectionCtx.putImageData(this.imgDataWithOutline, 0, 0, 0, 0, canvasWidth, canvasHeight);
        this.drawingService.baseCtx.putImageData(this.areaToClear, 0, 0);
        selectionCtx.canvas.style.cursor = 'move';
    }
}
