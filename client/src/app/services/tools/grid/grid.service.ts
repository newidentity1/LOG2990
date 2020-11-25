import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool/tool';
import { BasicShapeProperties } from '@app/classes/tools-properties/basic-shape-properties';
import * as CONSTANTS from '@app/constants/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class GridService extends Tool {
    private size: number;
    isGrid: boolean = false;
    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.name = 'Grid';
        this.tooltip = 'Grille (g)';
        this.iconName = 'grid_on';
        this.size = CONSTANTS.GRID_BEGIN_SIZE;
        this.toolProperties = new BasicShapeProperties();
    }

    draw(): void {
        this.isGrid = !this.isGrid;
        this.generateGrid();
    }

    private generateGrid(): void {
        this.drawingService.clearCanvas(this.drawingService.gridCtx);
        if (this.isGrid) {
            const m: number = (this.drawingService.canvas.height - (this.drawingService.canvas.height % this.size)) / this.size;
            const n: number = (this.drawingService.canvas.width - (this.drawingService.canvas.width % this.size)) / this.size;

            for (let i = 0; i < m + 1; i++) {
                this.drawingService.gridCtx.beginPath();
                this.drawingService.gridCtx.lineTo(0, i * this.size);
                this.drawingService.gridCtx.lineTo(this.drawingService.canvas.width, i * this.size);
                this.drawingService.gridCtx.stroke();
            }

            for (let i = 0; i < n + 1; i++) {
                this.drawingService.gridCtx.beginPath();
                this.drawingService.gridCtx.lineTo(i * this.size, 0);
                this.drawingService.gridCtx.lineTo(i * this.size, this.drawingService.canvas.height);
                this.drawingService.gridCtx.stroke();
            }
        } else {
            this.drawingService.clearCanvas(this.drawingService.gridCtx);
        }
    }
    setGridSize(size: number | null): void {
        this.size = size !== null ? size : 0;
        this.generateGrid();
    }

    private round(n: number): number {
        const dy = n % CONSTANTS.GRID_MULTIPLE;
        if (dy >= CONSTANTS.ROUND) {
            n = n - dy + CONSTANTS.GRID_MULTIPLE;
        } else {
            n = n - dy;
        }
        return n;
    }

    setCanvasOpacity(n: number | null): void {
        if (n !== null) {
            console.log('slideruse');
            const ctx = this.drawingService.gridCtx;
            ctx.globalAlpha = (n * CONSTANTS.MAX_COLOR_VALUE) / (CONSTANTS.MAXIMUM_THICKNESS * CONSTANTS.MAX_COLOR_VALUE);
            this.generateGrid();
        }
    }

    resetContext(): void {
        this.generateGrid();
    }

    getGridSize(): number {
        return this.size;
    }

    onKeyUp(event: KeyboardEvent): void {
        if (event.code === 'NumpadAdd') {
            this.size = this.round(this.size + CONSTANTS.GRID_MULTIPLE);
        } else if (event.code === 'NumpadSubtract' && this.size > CONSTANTS.GRID_MULTIPLE) {
            this.size = this.round(this.size - CONSTANTS.GRID_MULTIPLE);
        } else if (event.code === 'KeyG') {
            this.draw();
        }
        this.generateGrid();
    }
}
