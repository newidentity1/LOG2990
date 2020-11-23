import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool/tool';
import { BasicShapeProperties } from '@app/classes/tools-properties/basic-shape-properties';
import * as CONSTANTS from '@app/constants/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class GridService extends Tool {
    static dx: number = 25;
    isGrid: boolean = false;
    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.name = 'Grid';
        this.tooltip = 'Grille (g)';
        this.iconName = 'grid_on';
        this.toolProperties = new BasicShapeProperties();
    }

    draw(): void {
        this.isGrid = !this.isGrid;
        this.generateGrid();
    }

    private generateGrid(): void {
        this.drawingService.clearCanvas(this.drawingService.gridCtx);
        if (this.isGrid) {
            const m: number = (this.drawingService.canvas.height - (this.drawingService.canvas.height % GridService.dx)) / GridService.dx;
            const n: number = (this.drawingService.canvas.width - (this.drawingService.canvas.width % GridService.dx)) / GridService.dx;

            for (let i = 0; i < m + 1; i++) {
                this.drawingService.gridCtx.beginPath();
                this.drawingService.gridCtx.lineTo(0, i * GridService.dx);
                this.drawingService.gridCtx.lineTo(this.drawingService.canvas.width, i * GridService.dx);
                this.drawingService.gridCtx.stroke();
            }

            for (let i = 0; i < n + 1; i++) {
                this.drawingService.gridCtx.beginPath();
                this.drawingService.gridCtx.lineTo(i * GridService.dx, 0);
                this.drawingService.gridCtx.lineTo(i * GridService.dx, this.drawingService.canvas.height);
                this.drawingService.gridCtx.stroke();
            }
        } else {
            this.drawingService.clearCanvas(this.drawingService.gridCtx);
        }
    }
    setDeltaX(size: number): void {
        GridService.dx = size;
        this.generateGrid();
    }

    private roundUp(n: number): number {
        const dy = n % CONSTANTS.GRID_MULTIPLE;
        if (dy >= CONSTANTS.ROUND_UP) {
            n = n - dy + CONSTANTS.GRID_MULTIPLE;
        } else {
            n = n - dy;
        }
        return n;
    }

    setCanvasOpacity(n: number): void {
        console.log('slideruse');
        const ctx = this.drawingService.gridCtx;
        ctx.globalAlpha = n / CONSTANTS.MAX_COLOR_VALUE;
        this.generateGrid();
    }

    resetContext(): void {
        this.generateGrid();
    }

    getDeltaX(): number {
        return GridService.dx;
    }

    onKeyUp(event: KeyboardEvent): void {
        if (event.code === 'NumpadAdd') {
            GridService.dx = this.roundUp(GridService.dx + CONSTANTS.GRID_MULTIPLE);
        } else if (event.code === 'NumpadSubtract' && GridService.dx > CONSTANTS.GRID_MULTIPLE) {
            GridService.dx = this.roundUp(GridService.dx - CONSTANTS.GRID_MULTIPLE);
        }
        this.generateGrid();
    }
}
