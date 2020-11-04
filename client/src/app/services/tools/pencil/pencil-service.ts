import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool/tool';
import { BasicShapeProperties } from '@app/classes/tools-properties/basic-shape-properties';
import { Vec2 } from '@app/classes/vec2';
import { MouseButton } from '@app/enums/mouse-button.enum';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class PencilService extends Tool {
    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.name = 'Crayon';
        this.tooltip = 'Crayon(c)';
        this.iconName = 'create';
        this.toolProperties = new BasicShapeProperties();
        this.clearPath();
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        if (this.mouseDown) {
            this.clearPath();

            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.pathData.push(this.mouseDownCoord);
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            this.draw(this.drawingService.baseCtx);
            this.executedCommand.emit(this.clone());
        }
        this.mouseDown = false;
        this.clearPath();
    }

    onMouseMove(event: MouseEvent): void {
        const mousePosition = this.getPositionFromMouse(event);
        if (this.mouseDown) {
            this.pathData.push(mousePosition);
            // On dessine sur le canvas de prévisualisation et on l'efface à chaque déplacement de la souris
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.draw(this.drawingService.previewCtx);
        } else {
            this.drawCursor(mousePosition);
        }
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.beginPath();
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        for (const point of this.pathData) {
            ctx.lineTo(point.x, point.y);
        }
        ctx.stroke();
    }

    protected drawCursor(position: Vec2): void {
        const cursorCtx = this.drawingService.previewCtx;
        this.drawingService.clearCanvas(cursorCtx);
        cursorCtx.beginPath();
        cursorCtx.arc(position.x, position.y, this.toolProperties.thickness / 2, 0, Math.PI * 2);
        cursorCtx.fill();
    }

    protected clearPath(): void {
        this.pathData = [];
    }

    clone(): Tool {
        const pencilClone: PencilService = new PencilService(this.drawingService);
        this.copyTool(pencilClone);
        return pencilClone;
    }
}
