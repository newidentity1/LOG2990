import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool/tool';
import { BasicShapeProperties } from '@app/classes/tools-properties/basic-shape-properties';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class GridService extends Tool {
    private dx: number = 25;
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
            const m: number = (this.drawingService.canvas.height - (this.drawingService.canvas.height % this.dx)) / this.dx;
            const n: number = (this.drawingService.canvas.width - (this.drawingService.canvas.width % this.dx)) / this.dx;

            for (let i = 0; i < m + 1; i++) {
                this.drawingService.gridCtx.beginPath();
                this.drawingService.gridCtx.lineTo(0, i * this.dx);
                this.drawingService.gridCtx.lineTo(this.drawingService.canvas.width, i * this.dx);
                this.drawingService.gridCtx.stroke();
            }

            for (let i = 0; i < n + 1; i++) {
                this.drawingService.gridCtx.beginPath();
                this.drawingService.gridCtx.lineTo(i * this.dx, 0);
                this.drawingService.gridCtx.lineTo(i * this.dx, this.drawingService.canvas.height);
                this.drawingService.gridCtx.stroke();
            }
        } else {
            this.drawingService.clearCanvas(this.drawingService.gridCtx);
        }
    }
    setDeltaX(size: number): void {
        this.dx = this.roundUp(size);
        this.generateGrid();
    }

    private roundUp(n: number): number {
        const dy = n % 5;
        if (dy >= 3) {
            n = n - dy + 5;
        } else {
            n = n - dy;
        }
        return n;
    }

    setCanvasOpacity(n: number) {
        console.log('slideruse');
        const ctx = this.drawingService.gridCtx;
        ctx.globalAlpha = n / 255;
        this.generateGrid();
    }

    resetContext(): void {
        this.generateGrid();
    }

    getDeltaX(): number {
        return this.dx;
    }
}
