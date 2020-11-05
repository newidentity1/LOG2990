import { Injectable } from '@angular/core';
import { Color } from '@app/classes/color/color';
import { Pixel } from '@app/classes/pixel';
import { Tool } from '@app/classes/tool/tool';
import { BasicShapeProperties } from '@app/classes/tools-properties/basic-shape-properties';
import * as CONSTANTS from '@app/constants/constants';
import { MouseButton } from '@app/enums/mouse-button.enum';
import { ColorPickerService } from '@app/services/color-picker/color-picker.service';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class BucketService extends Tool {
    private openList: Pixel[] = [];
    private matrice: Pixel[][] = [];
    private image: ImageData;
    private width: number = 0;
    private height: number = 0;
    mouseLeft: boolean = true;

    private startPixelColor: Uint8ClampedArray;
    protected tolerance: number = 1;

    constructor(drawingService: DrawingService, private colorPickerService: ColorPickerService) {
        super(drawingService);
        this.name = 'Sceau de peinture';
        this.tooltip = 'Bucket(b)';
        this.iconName = 'format_paint';
        this.toolProperties = new BasicShapeProperties();
    }

    private generateMatrice(): void {
        for (let i = 0; i < this.width; i++) {
            const line: Pixel[] = [];
            for (let j = 0; j < this.height; j++) {
                const pixel: Pixel = { x: i, y: j, status: 0 };
                line.push(pixel);
            }
            this.matrice.push(line);
        }
    }

    onMouseDown(event: MouseEvent): void {
        this.width = this.drawingService.canvas.width;
        this.height = this.drawingService.canvas.height;
        this.image = this.drawingService.baseCtx.getImageData(0, 0, this.width, this.height);
        this.mouseDownCoord = this.getPositionFromMouse(event);
        this.startPixelColor = this.drawingService.baseCtx.getImageData(this.mouseDownCoord.x, this.mouseDownCoord.y, 1, 1).data;
        this.mouseDown = true;
        this.mouseLeft = event.button === MouseButton.Left;
        this.draw(this.drawingService.baseCtx);
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            this.mouseDown = false;
            this.executedCommand.emit(this.clone());
        }
    }

    floodFillLeft(): void {
        this.clearList(this.openList);
        const start: Pixel = { x: this.mouseDownCoord.x, y: this.mouseDownCoord.y, status: 0 };
        this.openList.push(start);
        while (this.openList.length !== 0) {
            this.addNeighbours(this.openList);
        }
    }

    floodFillRight(): void {
        const targetColor: Color = this.colorPickerService.primaryColor.getValue().clone();
        for (let i = 0; i < this.image.data.length; i += CONSTANTS.IMAGE_DATA_OPACITY_INDEX + 1) {
            if (
                this.image.data[i] >= this.startPixelColor[0] - this.tolerance &&
                this.image.data[i] < this.startPixelColor[0] + this.tolerance &&
                this.image.data[i + 1] >= this.startPixelColor[1] - this.tolerance &&
                this.image.data[i + 1] < this.startPixelColor[1] + this.tolerance &&
                this.image.data[i + 2] >= this.startPixelColor[2] - this.tolerance &&
                this.image.data[i + 2] < this.startPixelColor[2] + this.tolerance &&
                this.image.data[i + CONSTANTS.IMAGE_DATA_OPACITY_INDEX] >=
                    this.startPixelColor[CONSTANTS.IMAGE_DATA_OPACITY_INDEX] - this.tolerance &&
                this.image.data[i + CONSTANTS.IMAGE_DATA_OPACITY_INDEX] < this.startPixelColor[CONSTANTS.IMAGE_DATA_OPACITY_INDEX] + this.tolerance
            ) {
                this.image.data[i] = targetColor.getRed;
                this.image.data[i + 1] = targetColor.getGreen;
                this.image.data[i + 2] = targetColor.getBlue;
                this.image.data[i + CONSTANTS.IMAGE_DATA_OPACITY_INDEX] = targetColor.getOpacity * CONSTANTS.MAX_COLOR_VALUE;
            }
        }
    }

    setTolerance(tolerance: number | null): void {
        tolerance = tolerance === null ? 1 : tolerance;
        this.tolerance = CONSTANTS.MAX_COLOR_VALUE * (tolerance / CONSTANTS.POURCENTAGE);
    }

    resetContext(): void {
        this.mouseDown = false;
        this.setThickness(this.toolProperties.thickness);
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
    }

    private clearList(list: Pixel[]): void {
        list.length = 0;
    }

    private copyList(list: Pixel[]): Pixel[] {
        return list.slice();
    }

    private addNeighbours(pixels: Pixel[]): void {
        const newList: Pixel[] = this.copyList(this.openList);
        // this.showList(this.openList);
        this.clearList(this.openList);
        for (const pixel of newList) {
            const topPixel: Pixel = { x: pixel.x, y: pixel.y + 1, status: 0 };
            if (this.checkPosition(topPixel)) {
                this.checkPixel(this.matrice[topPixel.x][topPixel.y]);
            }

            const downPixel: Pixel = { x: pixel.x, y: pixel.y - 1, status: 0 };
            if (this.checkPosition(downPixel)) {
                this.checkPixel(this.matrice[downPixel.x][downPixel.y]);
            }

            const leftPixel: Pixel = { x: pixel.x - 1, y: pixel.y, status: 0 };
            if (this.checkPosition(leftPixel)) {
                this.checkPixel(this.matrice[leftPixel.x][leftPixel.y]);
            }

            const rightPixel: Pixel = { x: pixel.x + 1, y: pixel.y, status: 0 };
            if (this.checkPosition(rightPixel)) {
                this.checkPixel(this.matrice[rightPixel.x][rightPixel.y]);
            }
        }
    }

    private checkPixel(point: Pixel | null): void {
        if (point !== null) {
            if (this.checkColor(point) && point.status !== 1) {
                this.openList.push(point);
                this.colorPixel(point);
                point.status = 1;
            }
        }
    }

    private checkPosition(point: Pixel): boolean {
        if (point.x >= 0 && point.y >= 0 && point.x < this.width && point.y < this.height) {
            return true;
        }
        return false;
    }

    private checkColor(point: Pixel): boolean {
        const offset = (point.y * this.width + point.x) * (CONSTANTS.IMAGE_DATA_OPACITY_INDEX + 1);
        if (
            this.image.data[offset] >= this.startPixelColor[0] - this.tolerance &&
            this.image.data[offset] < this.startPixelColor[0] + this.tolerance &&
            this.image.data[offset + 1] >= this.startPixelColor[1] - this.tolerance &&
            this.image.data[offset + 1] < this.startPixelColor[1] + this.tolerance &&
            this.image.data[offset + 2] >= this.startPixelColor[2] - this.tolerance &&
            this.image.data[offset + 2] < this.startPixelColor[2] + this.tolerance &&
            this.image.data[offset + CONSTANTS.IMAGE_DATA_OPACITY_INDEX] >=
                this.startPixelColor[CONSTANTS.IMAGE_DATA_OPACITY_INDEX] - this.tolerance &&
            this.image.data[offset + CONSTANTS.IMAGE_DATA_OPACITY_INDEX] < this.startPixelColor[CONSTANTS.IMAGE_DATA_OPACITY_INDEX] + this.tolerance
        ) {
            return true;
        }
        return false;
    }

    private colorPixel(pixel: Pixel): void {
        const targetColor: Color = this.colorPickerService.primaryColor.getValue().clone();
        const offset = (pixel.y * this.width + pixel.x) * (CONSTANTS.IMAGE_DATA_OPACITY_INDEX + 1);
        this.drawingService.baseCtx.fillRect(pixel.x, pixel.y, 1, 1);
        this.image.data[offset] = targetColor.getRed;
        this.image.data[offset + 1] = targetColor.getGreen;
        this.image.data[offset + 2] = targetColor.getBlue;
        this.image.data[offset + CONSTANTS.IMAGE_DATA_OPACITY_INDEX] = targetColor.getOpacity * CONSTANTS.MAX_COLOR_VALUE;
    }

    copyBucket(bucket: BucketService): void {
        this.copyTool(bucket);
        bucket.width = this.width;
        bucket.height = this.height;
        bucket.image = this.image;
        bucket.startPixelColor = this.startPixelColor;
        bucket.mouseLeft = this.mouseLeft;
    }

    clone(): BucketService {
        const bucketClone: BucketService = new BucketService(this.drawingService, this.colorPickerService);
        this.copyBucket(bucketClone);
        return bucketClone;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        if (this.mouseLeft) {
            this.matrice.length = 0;
            this.generateMatrice();
            this.floodFillLeft();
        } else {
            this.floodFillRight();
        }
        ctx.putImageData(this.image, 0, 0);
    }
}
