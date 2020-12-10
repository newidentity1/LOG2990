import { Injectable } from '@angular/core';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { PencilService } from '@app/services/tools/pencil/pencil.service';

@Injectable({
    providedIn: 'root',
})
export class EraseService extends PencilService {
    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.name = 'Eraser';
        this.tooltip = 'Efface(e)';
        this.iconName = 'kitchen';
        this.clearPath();
    }

    onMouseMove(event: MouseEvent): void {
        this.currentMousePosition = this.getPositionFromMouse(event);
        if (this.mouseDown) {
            this.pathData.push(this.currentMousePosition);
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.draw(this.drawingService.previewCtx);
        }
        this.drawCursor();
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            this.draw(this.drawingService.baseCtx);
            this.executedCommand.emit(this.clone());
        }
        this.mouseDown = false;
        this.clearPath();
    }

    draw(ctx: CanvasRenderingContext2D): void {
        if (this.pathData.length === 1 && this.pathData[0].x === this.mouseDownCoord.x && this.pathData[0].y === this.mouseDownCoord.y) {
            this.drawingService.baseCtx.clearRect(
                this.pathData[0].x - this.toolProperties.thickness / 2,
                this.pathData[0].y - this.toolProperties.thickness / 2,
                this.toolProperties.thickness,
                this.toolProperties.thickness,
            );
            return;
        }

        this.drawingService.setStrokeColor('white');
        ctx.miterLimit = 1;
        ctx.lineCap = 'butt';
        ctx.lineJoin = 'miter';
        ctx.beginPath();
        for (const point of this.pathData) {
            ctx.lineTo(point.x, point.y);
        }
        ctx.stroke();
    }

    protected drawCursor(): void {
        const cursorCtx = this.drawingService.previewCtx;
        if (!this.mouseDown) {
            this.drawingService.clearCanvas(cursorCtx);
        }
        this.drawingService.setFillColor('white');
        this.drawingService.setStrokeColor('black');
        cursorCtx.beginPath();
        cursorCtx.fillRect(
            this.currentMousePosition.x - this.toolProperties.thickness / 2,
            this.currentMousePosition.y - this.toolProperties.thickness / 2,
            this.toolProperties.thickness,
            this.toolProperties.thickness,
        );

        cursorCtx.lineWidth = 1;
        cursorCtx.strokeRect(
            this.currentMousePosition.x - this.toolProperties.thickness / 2,
            this.currentMousePosition.y - this.toolProperties.thickness / 2,
            this.toolProperties.thickness,
            this.toolProperties.thickness,
        );
        cursorCtx.lineWidth = this.toolProperties.thickness;
    }

    clone(): EraseService {
        const eraserClone: EraseService = new EraseService(this.drawingService);
        this.copyTool(eraserClone);
        return eraserClone;
    }
}
