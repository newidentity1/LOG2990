import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool/tool';
import { BrushProperties } from '@app/classes/tools-properties/brush-properties';
import { Vec2 } from '@app/classes/vec2';
import { DEFAULT_CALLIGRAPHY_LINE_LENGTH } from '@app/constants/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { PencilService } from '@app/services/tools/pencil/pencil-service';

@Injectable({
    providedIn: 'root',
})
export class CalligraphyService extends PencilService {
    lineLength: number = DEFAULT_CALLIGRAPHY_LINE_LENGTH;
    lineAngle: number = 0;
    private pathDataAngle: number[] = [];
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
        // TODO: verifier bug avec ALT+TAB
        this.atlDown = event.key === 'Alt' ? false : this.atlDown;
    }

    onMouseScroll(event: WheelEvent): void {
        // TODO default rotation angle
        this.lineAngle = (this.lineAngle + Math.sign(event.deltaY) * (this.atlDown ? 1 : 15)) % 360;
        if (this.lineAngle < 0) this.lineAngle = 360 + this.lineAngle;
        this.drawCursor(this.mousePosition);
    }

    onMouseDown(event: MouseEvent): void {
        super.onMouseDown(event);
        if (this.mouseDown) {
            this.pathDataAngle.push(this.lineAngle);
        }
    }

    onMouseUp(): void {
        if (this.mouseDown) {
            this.draw(this.drawingService.baseCtx);
            this.executedCommand.emit(this.clone());
        }
        this.mouseDown = false;
        this.clearPath();
        this.clearPathAngle();
    }

    onMouseMove(event: MouseEvent): void {
        this.mousePosition = this.getPositionFromMouse(event);
        if (this.mouseDown) {
            this.pathData.push(this.mousePosition);
            this.pathDataAngle.push(this.lineAngle);
            this.drawStrokeToNextPoint(this.drawingService.previewCtx, this.mousePosition, this.pathData[this.pathData.length - 2], this.lineAngle);
        } else {
            this.drawCursor(this.mousePosition);
        }
    }

    drawStrokeToNextPoint(ctx: CanvasRenderingContext2D, currentPoint: Vec2, lastPoint: Vec2, lineAngle: number): void {
        const distanceToNextPoint = this.distanceBetweenPoints(currentPoint, lastPoint);
        const angleToNextPoint = this.angleBetweenPoints(currentPoint, lastPoint);

        for (let j = 0; j < distanceToNextPoint; j++) {
            const x = currentPoint.x + Math.sin(angleToNextPoint) * j;
            const y = currentPoint.y + Math.cos(angleToNextPoint) * j;

            ctx.beginPath();
            ctx.lineTo(
                x - (this.lineLength / 2) * Math.cos((lineAngle * Math.PI) / 180),
                y - (this.lineLength / 2) * Math.sin((lineAngle * Math.PI) / 180),
            );
            ctx.lineTo(
                x + (this.lineLength / 2) * Math.cos((lineAngle * Math.PI) / 180),
                y + (this.lineLength / 2) * Math.sin((lineAngle * Math.PI) / 180),
            );
            ctx.stroke();
        }
    }

    draw(ctx: CanvasRenderingContext2D): void {
        for (let i = 1; i < this.pathData.length; i++) {
            this.drawStrokeToNextPoint(ctx, this.pathData[i], this.pathData[i - 1], this.pathDataAngle[i]);
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

    private clearPathAngle(): void {
        this.pathDataAngle = [];
    }

    copyTool(tool: CalligraphyService): void {
        tool.mouseDownCoord = this.mouseDownCoord;
        tool.lineLength = this.lineLength;
        tool.lineAngle = this.lineAngle;
        tool.pathData = this.pathData;
        tool.pathDataAngle = this.pathDataAngle;
    }

    clone(): Tool {
        const calligraphyClone: CalligraphyService = new CalligraphyService(this.drawingService);
        this.copyTool(calligraphyClone);
        return calligraphyClone;
    }

    applyCurrentSettings(): void {
        super.applyCurrentSettings();
        this.drawingService.setThickness(2);
    }
}
