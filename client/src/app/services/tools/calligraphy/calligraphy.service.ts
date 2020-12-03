import { Injectable } from '@angular/core';
import { BrushProperties } from '@app/classes/tools-properties/brush-properties';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { PencilService } from '@app/services/tools/pencil/pencil-service';

@Injectable({
    providedIn: 'root',
})
export class CalligraphyService extends PencilService {
    lineLength: number = 10; // TODO: use constants
    lineAngle: number = 0;
    private atlDown: boolean = false;

    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.name = 'Calligraphy';
        this.tooltip = 'Plume(p)';
        this.iconName = 'history_edu';
        this.toolProperties = new BrushProperties();
        this.clearPath();
    }

    onKeyDown(event: KeyboardEvent): void {
        this.atlDown = event.key === 'Alt' ? true : this.atlDown;
    }

    onKeyUp(event: KeyboardEvent): void {
        this.atlDown = event.key === 'Alt' ? false : this.atlDown;
    }

    onMouseScroll(event: WheelEvent): void {
        // TODO default rotation angle
        this.lineAngle = (this.lineAngle + Math.sign(event.deltaY) * (this.atlDown ? 1 : 15)) % 360;
        if (this.lineAngle < 0) this.lineAngle = 360 + this.lineAngle;
        this.drawCursor(this.mousePosition);
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            this.drawingService.baseCtx.drawImage(this.drawingService.previewCtx.canvas, 0, 0);
            this.executedCommand.emit(this.clone());
        }
        this.mouseDown = false;
        this.clearPath();
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.lineWidth = 2;
        const currentPoint = this.pathData[this.pathData.length - 1];
        const lastPoint = this.pathData[this.pathData.length - 2];

        const dist = this.distanceBetweenPoints(currentPoint, lastPoint);
        const angle = this.angleBetweenPoints(currentPoint, lastPoint);

        for (let i = 0; i < dist; i++) {
            const x = currentPoint.x + Math.sin(angle) * i;
            const y = currentPoint.y + Math.cos(angle) * i;

            ctx.beginPath();
            ctx.lineTo(
                x - (this.lineLength / 2) * Math.cos((this.lineAngle * Math.PI) / 180),
                y - (this.lineLength / 2) * Math.sin((this.lineAngle * Math.PI) / 180),
            );
            ctx.lineTo(
                x + (this.lineLength / 2) * Math.cos((this.lineAngle * Math.PI) / 180),
                y + (this.lineLength / 2) * Math.sin((this.lineAngle * Math.PI) / 180),
            );
            ctx.stroke();
        }
    }

    protected drawCursor(position: Vec2): void {
        if (this.mouseDown) return;
        const cursorCtx = this.drawingService.previewCtx;
        this.drawingService.clearCanvas(cursorCtx);
        cursorCtx.beginPath();
        cursorCtx.lineTo(
            position.x - (this.lineLength / 2) * Math.cos((this.lineAngle * Math.PI) / 180),
            position.y - (this.lineLength / 2) * Math.sin((this.lineAngle * Math.PI) / 180),
        );
        cursorCtx.lineTo(
            position.x + (this.lineLength / 2) * Math.cos((this.lineAngle * Math.PI) / 180),
            position.y + (this.lineLength / 2) * Math.sin((this.lineAngle * Math.PI) / 180),
        );
        cursorCtx.stroke();
    }

    private distanceBetweenPoints(point1: Vec2, point2: Vec2): number {
        return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
    }

    private angleBetweenPoints(point1: Vec2, point2: Vec2): number {
        return Math.atan2(point2.x - point1.x, point2.y - point1.y);
    }
}
