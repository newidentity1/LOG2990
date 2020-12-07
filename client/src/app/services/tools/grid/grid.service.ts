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
    private firstUse: boolean = true;
    isGrid: boolean = true;
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
            const row: number = (this.drawingService.canvas.height - (this.drawingService.canvas.height % this.size)) / this.size;
            const column: number = (this.drawingService.canvas.width - (this.drawingService.canvas.width % this.size)) / this.size;

            for (let i = 0; i <= row; i++) {
                this.drawingService.gridCtx.beginPath();
                this.drawingService.gridCtx.lineTo(0, i * this.size);
                this.drawingService.gridCtx.lineTo(this.drawingService.canvas.width, i * this.size);
                this.drawingService.gridCtx.stroke();
            }

            for (let i = 0; i <= column; i++) {
                this.drawingService.gridCtx.beginPath();
                this.drawingService.gridCtx.lineTo(i * this.size, 0);
                this.drawingService.gridCtx.lineTo(i * this.size, this.drawingService.canvas.height);
                this.drawingService.gridCtx.stroke();
            }
        }
    }
    setGridSize(size: number | null): void {
        this.size = size !== null ? size : 0;
        this.generateGrid();
    }

    setCanvasOpacity(n: number | null): void {
        if (n !== null) {
            const ctx = this.drawingService.gridCtx;
            ctx.globalAlpha = (n * CONSTANTS.MAX_COLOR_VALUE) / (CONSTANTS.MAXIMUM_THICKNESS * CONSTANTS.MAX_COLOR_VALUE);
            this.generateGrid();
        }
    }

    resetContext(): void {
        if (!this.firstUse) {
            this.isGrid = !this.isGrid;
        } else {
            this.firstUse = false;
        }
        this.draw();
    }

    getGridSize(): number {
        return this.size;
    }

    onKeyUp(event: KeyboardEvent): void {
        if (event.key === '=') {
            this.size = this.size + CONSTANTS.GRID_MULTIPLE_OPACITY_AND_SIZE;
        } else if (event.key === '-' && this.size > CONSTANTS.GRID_MULTIPLE_OPACITY_AND_SIZE) {
            this.size = this.size - CONSTANTS.GRID_MULTIPLE_OPACITY_AND_SIZE;
        } else if (event.code === 'KeyG') {
            this.draw();
        }
        this.generateGrid();
    }
}
