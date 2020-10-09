import { Injectable } from '@angular/core';
import { Color } from '@app/classes/color/color';
import { Tool } from '@app/classes/tool/tool';
import { BasicShapeProperties } from '@app/classes/tools-properties/basic-shape-properties';
import { Vec2 } from '@app/classes/vec2';
import * as CONSTANTS from '@app/constants/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class BucketService extends Tool {
    private openList: Vec2[] = [];
    private closeList: Vec2[] = [];
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

    onClick(event: MouseEvent): void {
        const mousePosition = this.getPositionFromMouse(event);
        this.openList.push(mousePosition);
        this.startPixel = this.drawingService.baseCtx.getImageData(mousePosition.x, mousePosition.y, 1, 1);
        this.fill(this.fillColor);
    }

    fill(fillColor: Color): void {
        this.setColors(fillColor);
        let secure = 0;
        while (this.openList.length !== 0) {
            this.addNeighbours(this.openList);
            secure++;
        }
        this.clearList(this.closeList);
        this.clearList(this.openList);
    }

    showList(list: Vec2[]): void {
        if (list.length === 0) {
            console.log('VIDE');
        } else {
            for (const pixel of list) {
                console.log(pixel.x, pixel.y);
            }
        }
    }

    clearList(list: Vec2[]): void {
        if (list.length === 0) {
            console.log('VIDE');
        } else {
            while (list.length !== 0) {
                list.pop();
            }
        }
    }
    copyList(list: Vec2[]): Vec2[] {
        const newList: Vec2[] = [];
        for (const point of list) {
            const newPoint: Vec2 = { x: point.x, y: point.y };
            newList.push(newPoint);
        }
        return newList;
    }

    addNeighbours(pixels: Vec2[]): void {
        const newList: Vec2[] = this.copyList(this.openList);
        // this.showList(this.openList);
        this.clearList(this.openList);
        for (const pixel of newList) {
            const topPixel: Vec2 = { x: pixel.x, y: pixel.y + 1 };
            if (this.checkColor(topPixel)) {
                this.openList.push(topPixel);
                this.colorPixel(topPixel);
                // console.log('top');
            }

            const downPixel: Vec2 = { x: pixel.x, y: pixel.y - 1 };
            if (this.checkColor(downPixel)) {
                this.openList.push(downPixel);
                this.colorPixel(downPixel);
                // console.log('down');
            }

            const leftPixel: Vec2 = { x: pixel.x - 1, y: pixel.y };
            if (this.checkColor(leftPixel)) {
                this.openList.push(leftPixel);
                this.colorPixel(leftPixel);
                // console.log('left');
            }

            const rightPixel: Vec2 = { x: pixel.x + 1, y: pixel.y };
            if (this.checkColor(rightPixel)) {
                this.openList.push(rightPixel);
                this.colorPixel(rightPixel);
                // console.log('right');
            }
        }
        // this.showList(this.openList);
    }

    checkColor(point: Vec2): boolean {
        const pixel: ImageData = this.drawingService.baseCtx.getImageData(point.x, point.y, 1, 1);
        // console.log(pixel.data[0], this.startPixel.data[0]);
        if (
            pixel.data[0] === this.startPixel.data[0] &&
            pixel.data[1] === this.startPixel.data[1] &&
            pixel.data[2] === this.startPixel.data[2] &&
            pixel.data[3] / CONSTANTS.MAX_COLOR_VALUE === this.startPixel.data[3]
        ) {
            return true;
        }
        // console.log('autre couleur');
        return false;
    }

    colorPixel(pixel: Vec2): void {
        this.setColors(this.fillColor);
        this.drawingService.baseCtx.fillRect(pixel.x, pixel.y, 1, 1);
    }

    setColors(primaryColor: Color): void {
        this.drawingService.setColor(primaryColor.toStringRGBA());
    }

    resetContext(): void {
        this.mouseDown = false;
        this.setThickness(this.toolProperties.thickness);
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
    }
}
