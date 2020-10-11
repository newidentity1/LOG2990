import { Injectable } from '@angular/core';
import { Color } from '@app/classes/color/color';
import { Tool } from '@app/classes/tool/tool';
import { BasicShapeProperties } from '@app/classes/tools-properties/basic-shape-properties';
import { Vec2 } from '@app/classes/vec2';
import { MouseButton } from '@app/enums/mouse-button.enum';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class BucketService extends Tool {
    private openList: Vec2[] = [];
    // private targetColor: Color;
    private fillColor: Color = new Color('#00000000');
    private startPixel: ImageData;

    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.name = 'Bucket';
        this.tooltip = 'Bucket(1)';
        this.iconName = 'format_paint';
        this.toolProperties = new BasicShapeProperties();
    }

    onMouseDown(event: MouseEvent): void {
        if (event.button === MouseButton.Left) {
            this.floodFillLeft(this.fillColor, event);
        } else {
            this.floodFillRight(this.fillColor, event);
        }
    }

    floodFillLeft(fillColor: Color, event: MouseEvent): void {
        this.clearList(this.openList);
        const mousePosition = this.getPositionFromMouse(event);
        this.openList.push(mousePosition);
        this.startPixel = this.drawingService.baseCtx.getImageData(mousePosition.x, mousePosition.y, 1, 1);
        while (this.openList.length !== 0) {
            this.addNeighbours(this.openList);
        }
    }

    floodFillRight(fillColor: Color, event: MouseEvent): void {
        const mousePosition = this.getPositionFromMouse(event);
        this.startPixel = this.drawingService.baseCtx.getImageData(mousePosition.x, mousePosition.y, 1, 1);
        const pixel: Vec2 = { x: 0, y: 0 };
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

    setColors(primaryColor: Color): void {
        this.drawingService.setColor(primaryColor.toStringRGBA());
    }

    resetContext(): void {
        this.mouseDown = false;
        this.setThickness(this.toolProperties.thickness);
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
    }

    // private showList(list: Vec2[]): void {
    //     if (list.length === 0) {
    //         console.log('VIDE');
    //     } else {
    //         for (const pixel of list) {
    //             console.log(pixel.x, pixel.y);
    //         }
    //     }
    // }

    private clearList(list: Vec2[]): void {
        if (list.length === 0) {
            console.log('VIDE');
        } else {
            while (list.length !== 0) {
                list.pop();
            }
        }
    }
    private copyList(list: Vec2[]): Vec2[] {
        const newList: Vec2[] = [];
        for (const point of list) {
            const newPoint: Vec2 = { x: point.x, y: point.y };
            newList.push(newPoint);
        }
        return newList;
    }

    private addNeighbours(pixels: Vec2[]): void {
        const newList: Vec2[] = this.copyList(this.openList);
        // this.showList(this.openList);
        this.clearList(this.openList);
        for (const pixel of newList) {
            const topPixel: Vec2 = { x: pixel.x, y: pixel.y + 2 };
            this.checkPixel(topPixel);

            const downPixel: Vec2 = { x: pixel.x, y: pixel.y - 2 };
            this.checkPixel(downPixel);

            const leftPixel: Vec2 = { x: pixel.x - 2, y: pixel.y };
            this.checkPixel(leftPixel);

            const rightPixel: Vec2 = { x: pixel.x + 2, y: pixel.y };
            this.checkPixel(rightPixel);
        }
    }

    private checkPixel(point: Vec2): void {
        if (point !== null) {
            if (this.checkColor(point) && this.checkPosition(point)) {
                this.openList.push(point);
                this.colorPixel(point);
            }
        }
    }

    private checkPosition(point: Vec2): boolean {
        if (point.x >= 0 && point.y >= 0 && point.x < this.drawingService.canvas.width && point.y < this.drawingService.canvas.height) {
            return true;
        }
        return false;
    }

    private checkColor(point: Vec2): boolean {
        const pixel: ImageData = this.drawingService.baseCtx.getImageData(point.x, point.y, 1, 1);
        if (
            pixel.data[0] === this.startPixel.data[0] &&
            pixel.data[1] === this.startPixel.data[1] &&
            pixel.data[2] === this.startPixel.data[2] &&
            pixel.data[3] === this.startPixel.data[3]
        ) {
            return true;
        }
        return false;
    }

    private colorPixel(pixel: Vec2): void {
        this.setColors(this.fillColor);
        this.drawingService.baseCtx.fillRect(pixel.x - 1, pixel.y - 1, 3, 3);
    }
}
