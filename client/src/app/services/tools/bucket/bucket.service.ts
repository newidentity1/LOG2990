import { Injectable } from '@angular/core';
import { Color } from '@app/classes/color/color';
import { Pixel } from '@app/classes/pixel';
import { Tool } from '@app/classes/tool/tool';
import { BasicShapeProperties } from '@app/classes/tools-properties/basic-shape-properties';
import * as CONSTANTS from '@app/constants/constants';
import { MouseButton } from '@app/enums/mouse-button.enum';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class BucketService extends Tool {
    private openList: Pixel[] = [];
    private matrice: Pixel[][] = [];
    private image: ImageData;

    private startPixelColor: Uint8ClampedArray;
    protected tolerance: number = 1;

    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.name = 'Bucket';
        this.tooltip = 'Bucket(1)';
        this.iconName = 'format_paint';
        this.toolProperties = new BasicShapeProperties();
    }

    private generateMatrice(): void {
        for (let i = 0; i < this.drawingService.canvas.width; i++) {
            const line: Pixel[] = [];
            for (let j = 0; j < this.drawingService.canvas.height; j++) {
                const pixel: Pixel = { x: i, y: j, status: 0 };
                line.push(pixel);
            }
            this.matrice.push(line);
        }
    }
    onMouseDown(event: MouseEvent): void {
        this.image = this.drawingService.baseCtx.getImageData(0, 0, this.drawingService.canvas.width, this.drawingService.canvas.height);
        const mousePosition = this.getPositionFromMouse(event);
        this.startPixelColor = this.drawingService.baseCtx.getImageData(mousePosition.x, mousePosition.y, 1, 1).data;
        if (event.button === MouseButton.Left) {
            this.generateMatrice();
            this.floodFillLeft(event);
        } else {
            this.floodFillRight(event);
        }
    }

    floodFillLeft(event: MouseEvent): void {
        this.clearList(this.openList);
        const mousePosition = this.getPositionFromMouse(event);
        const start: Pixel = { x: mousePosition.x, y: mousePosition.y, status: 0 };
        this.openList.push(start);
        let security = 0;
        while (this.openList.length !== 0 && security < this.drawingService.canvas.height * this.drawingService.canvas.width) {
            this.addNeighbours(this.openList);
            security++;
            console.log(security);
        }
        this.resetMatrice();
    }

    floodFillRight(event: MouseEvent): void {
        const pixel: Pixel = { x: 0, y: 0, status: 0 };
        for (let i = 0; i < this.drawingService.canvas.height; i++) {
            for (let j = 0; j < this.drawingService.canvas.width; j++) {
                pixel.x = j;
                pixel.y = i;
                if (this.checkColor(pixel)) {
                    this.colorPixel(pixel);
                }
            }
        }
    }

    setTolerance(tolerance: number | null): void {
        tolerance = tolerance === null ? 1 : tolerance;
        this.tolerance = CONSTANTS.MAX_COLOR_VALUE * (tolerance / CONSTANTS.POURCENTAGE);
        console.log(CONSTANTS.MAX_COLOR_VALUE * (tolerance / CONSTANTS.POURCENTAGE));
    }

    setColors(primaryColor: Color): void {
        this.drawingService.setColor(primaryColor.toStringRGBA());
    }

    resetContext(): void {
        this.mouseDown = false;
        this.setThickness(this.toolProperties.thickness);
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
    }

    private clearList(list: Pixel[]): void {
        if (list.length === 0) {
            console.log('VIDE');
        } else {
            while (list.length !== 0) {
                list.pop();
            }
        }
    }

    private resetMatrice(): void {
        for (const line of this.matrice) {
            for (const pixel of line) {
                pixel.status = 0;
            }
        }
    }

    private copyList(list: Pixel[]): Pixel[] {
        const newList: Pixel[] = [];
        for (const point of list) {
            const newPoint: Pixel = { x: point.x, y: point.y, status: point.status };
            newList.push(newPoint);
        }
        return newList;
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
        if (point.x >= 0 && point.y >= 0 && point.x < this.drawingService.canvas.width && point.y < this.drawingService.canvas.height) {
            return true;
        }
        return false;
    }

    private checkColor(point: Pixel): boolean {
        // tslint:disable-next-line:no-magic-numbers
        const offset = (point.y * this.image.width + point.x) * 4;
        if (
            this.image.data[offset + 0] >= this.startPixelColor[0] - this.tolerance &&
            this.image.data[offset + 0] < this.startPixelColor[0] + this.tolerance &&
            this.image.data[offset + 1] >= this.startPixelColor[1] - this.tolerance &&
            this.image.data[offset + 1] < this.startPixelColor[1] + this.tolerance &&
            this.image.data[offset + 2] >= this.startPixelColor[2] - this.tolerance &&
            this.image.data[offset + 2] < this.startPixelColor[2] + this.tolerance &&
            // tslint:disable-next-line:no-magic-numbers
            this.image.data[offset + 3] >= this.startPixelColor[CONSTANTS.INDEX_3] - this.tolerance &&
            // tslint:disable-next-line:no-magic-numbers
            this.image.data[offset + 3] < this.startPixelColor[CONSTANTS.INDEX_3] + this.tolerance
        ) {
            return true;
        }
        return false;
    }

    private colorPixel(pixel: Pixel): void {
        this.drawingService.baseCtx.fillRect(pixel.x, pixel.y, 1, 1);
    }
}
