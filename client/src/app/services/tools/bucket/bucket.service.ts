import { Injectable } from '@angular/core';
import { Color } from '@app/classes/color/color';
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
    private image: ImageData;
    private width: number = 0;
    private height: number = 0;
    private mouseLeft: boolean = true;

    private startPixelColor: Uint8ClampedArray;
    protected tolerance: number = 1;

    constructor(drawingService: DrawingService, private colorPickerService: ColorPickerService) {
        super(drawingService);
        this.name = 'Bucket';
        this.tooltip = 'Sceau de peinture(b)';
        this.iconName = 'format_paint';
        this.toolProperties = new BasicShapeProperties();
    }

    onMouseDown(event: MouseEvent): void {
        this.width = this.drawingService.canvas.width;
        this.height = this.drawingService.canvas.height;
        this.image = this.drawingService.baseCtx.getImageData(0, 0, this.width, this.height);
        this.mouseDownCoord = this.getPositionFromMouse(event);
        this.startPixelColor = this.drawingService.baseCtx.getImageData(this.mouseDownCoord.x, this.mouseDownCoord.y, 1, 1).data;
        this.changeTransparentToWhite(this.startPixelColor);
        this.mouseDown = true;
        this.mouseLeft = event.button === MouseButton.Left;
        if (this.mouseLeft) {
            this.floodFillLeft();
        } else {
            this.floodFillRight();
        }
        this.draw(this.drawingService.baseCtx);
    }

    onMouseUp(): void {
        if (this.mouseDown) {
            this.mouseDown = false;
            this.executedCommand.emit(this.clone());
        }
    }

    private floodFillLeft(): void {
        const queue = [this.mouseDownCoord];
        while (queue.length > 0) {
            const pixel = queue[queue.length - 1];
            queue.pop();
            let offset = (pixel.y * this.width + pixel.x) * (CONSTANTS.IMAGE_DATA_OPACITY_INDEX + 1);
            this.colorPixel(offset);
            for (let i = -1; i < 2; i++) {
                for (let j = -1; j < 2; j++) {
                    offset = ((pixel.y + j) * this.width + pixel.x + i) * (CONSTANTS.IMAGE_DATA_OPACITY_INDEX + 1);
                    if (this.checkColor(offset)) queue.push({ x: pixel.x + i, y: pixel.y + j });
                }
            }
        }
    }

    private floodFillRight(): void {
        const targetColor: Color = this.colorPickerService.primaryColor.getValue().clone();
        for (let i = 0; i < this.image.data.length; i += CONSTANTS.IMAGE_DATA_OPACITY_INDEX + 1) {
            if (this.checkColor(i)) {
                this.image.data[i] = targetColor.getRed;
                this.image.data[i + 1] = targetColor.getGreen;
                this.image.data[i + 2] = targetColor.getBlue;
                this.image.data[i + CONSTANTS.IMAGE_DATA_OPACITY_INDEX] = targetColor.opacity * CONSTANTS.MAX_COLOR_VALUE;
            }
        }
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.putImageData(this.image, 0, 0);
    }

    setTolerance(tolerance: number | null): void {
        tolerance = tolerance === null ? 1 : tolerance;
        this.tolerance = CONSTANTS.MAX_COLOR_VALUE * (tolerance / CONSTANTS.MAX_PERCENTAGE);
    }

    resetContext(): void {
        this.mouseDown = false;
        this.setThickness(this.toolProperties.thickness);
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
    }

    private checkColor(index: number): boolean {
        if (
            this.startPixelColor[0] === CONSTANTS.MAX_COLOR_VALUE &&
            this.startPixelColor[1] === CONSTANTS.MAX_COLOR_VALUE &&
            this.startPixelColor[2] === CONSTANTS.MAX_COLOR_VALUE &&
            this.startPixelColor[CONSTANTS.IMAGE_DATA_OPACITY_INDEX] === CONSTANTS.MAX_COLOR_VALUE &&
            this.image.data[index + CONSTANTS.IMAGE_DATA_OPACITY_INDEX] === 0
        ) {
            return true;
        }
        return (
            this.image.data[index] >= this.startPixelColor[0] - this.tolerance &&
            this.image.data[index] < this.startPixelColor[0] + this.tolerance &&
            this.image.data[index + 1] >= this.startPixelColor[1] - this.tolerance &&
            this.image.data[index + 1] < this.startPixelColor[1] + this.tolerance &&
            this.image.data[index + 2] >= this.startPixelColor[2] - this.tolerance &&
            this.image.data[index + 2] < this.startPixelColor[2] + this.tolerance &&
            this.image.data[index + CONSTANTS.IMAGE_DATA_OPACITY_INDEX] >=
                this.startPixelColor[CONSTANTS.IMAGE_DATA_OPACITY_INDEX] - this.tolerance &&
            this.image.data[index + CONSTANTS.IMAGE_DATA_OPACITY_INDEX] < this.startPixelColor[CONSTANTS.IMAGE_DATA_OPACITY_INDEX] + this.tolerance
        );
    }

    private colorPixel(pixel: number): void {
        const targetColor: Color = this.colorPickerService.primaryColor.getValue().clone();
        this.image.data[pixel] = targetColor.getRed;
        this.image.data[pixel + 1] = targetColor.getGreen;
        this.image.data[pixel + 2] = targetColor.getBlue;
        this.image.data[pixel + CONSTANTS.IMAGE_DATA_OPACITY_INDEX] = targetColor.opacity * CONSTANTS.MAX_COLOR_VALUE;
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

    private changeTransparentToWhite(transparentPixel: Uint8ClampedArray): void {
        if (transparentPixel[CONSTANTS.IMAGE_DATA_OPACITY_INDEX] === 0) {
            transparentPixel[0] = CONSTANTS.MAX_COLOR_VALUE;
            transparentPixel[1] = CONSTANTS.MAX_COLOR_VALUE;
            transparentPixel[2] = CONSTANTS.MAX_COLOR_VALUE;
            transparentPixel[CONSTANTS.IMAGE_DATA_OPACITY_INDEX] = CONSTANTS.MAX_COLOR_VALUE;
        }
    }
}
