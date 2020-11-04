import { Injectable } from '@angular/core';
import { BasicShapeProperties } from '@app/classes/tools-properties/basic-shape-properties';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { PencilService } from '@app/services/tools/pencil/pencil-service';

@Injectable({
    providedIn: 'root',
})
export class EraseService extends PencilService {
    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.name = 'Eraser';
        this.tooltip = 'Efface(e)';
        this.iconName = 'kitchen';
        this.toolProperties = new BasicShapeProperties();
        this.clearPath();
    }

    onMouseMove(event: MouseEvent): void {
        const mousePosition = this.getPositionFromMouse(event);
        if (this.mouseDown) {
            this.pathData.push(mousePosition);
            // On dessine sur le canvas de prévisualisation et on l'efface à chaque déplacement de la souris
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.draw(this.drawingService.previewCtx);
        }
        this.drawCursor(mousePosition);
    }

    onMouseUp(event: MouseEvent): void {
        const mouseUpPosition = this.getPositionFromMouse(event);
        if (this.mouseDown) {
            if (this.pathData.length === 1 && mouseUpPosition.x === this.mouseDownCoord.x && mouseUpPosition.y === this.mouseDownCoord.y) {
                this.drawingService.baseCtx.clearRect(
                    mouseUpPosition.x - this.toolProperties.thickness / 2,
                    mouseUpPosition.y - this.toolProperties.thickness / 2,
                    this.toolProperties.thickness,
                    this.toolProperties.thickness,
                );
            } else {
                this.draw(this.drawingService.baseCtx);
            }
            this.executedCommand.emit(this.clone());
        }
        this.mouseDown = false;
        this.clearPath();
    }

    draw(ctx: CanvasRenderingContext2D): void {
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

    protected drawCursor(position: Vec2): void {
        const cursorCtx = this.drawingService.previewCtx;
        if (!this.mouseDown) {
            this.drawingService.clearCanvas(cursorCtx);
        }
        this.drawingService.setFillColor('white');
        this.drawingService.setStrokeColor('black');
        cursorCtx.beginPath();
        cursorCtx.fillRect(
            position.x - this.toolProperties.thickness / 2,
            position.y - this.toolProperties.thickness / 2,
            this.toolProperties.thickness,
            this.toolProperties.thickness,
        );

        cursorCtx.lineWidth = 1;
        cursorCtx.strokeRect(
            position.x - this.toolProperties.thickness / 2,
            position.y - this.toolProperties.thickness / 2,
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
