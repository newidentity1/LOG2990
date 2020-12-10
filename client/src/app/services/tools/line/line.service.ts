import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool/tool';
import { LineProperties } from '@app/classes/tools-properties/line-properties';
import { Vec2 } from '@app/classes/vec2';
import * as CONSTANTS from '@app/constants/constants';
import { MouseButton } from '@app/enums/mouse-button.enum';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class LineService extends Tool {
    private mouse: Vec2 = { x: 0, y: 0 };

    shift: boolean = false;
    lock180: boolean = false;
    lock90: boolean = false;
    lock45: boolean = false;

    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.name = 'Line';
        this.tooltip = 'Ligne(l)';
        this.iconName = 'show_chart';
        this.toolProperties = new LineProperties();
        this.clearPath();
    }

    onClick(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        const mousePosition = this.getPositionFromMouse(event);
        if (this.pathData.length > 0 && this.shift) {
            this.angleTransform(mousePosition);
            this.draw(this.drawingService.previewCtx);
        }
        this.pathData.push(mousePosition);
    }

    angleTransform(mousePosition: Vec2): void {
        if (this.lock180) {
            mousePosition.y = this.pathData[this.pathData.length - 1].y;
        } else if (this.lock45) {
            const dx = mousePosition.x - this.pathData[this.pathData.length - 1].x;
            const dy = mousePosition.y - this.pathData[this.pathData.length - 1].y;
            const sign = Math.sign(dx) * Math.sign(dy);
            mousePosition.y =
                sign * Math.tan(CONSTANTS.ANGLE_45) * (mousePosition.x - this.pathData[this.pathData.length - 1].x) +
                this.pathData[this.pathData.length - 1].y;
        } else if (this.lock90) {
            mousePosition.x = this.pathData[this.pathData.length - 1].x;
        }
    }

    onMouseMove(event: MouseEvent): void {
        this.mouse = this.getPositionFromMouse(event);
        if (this.shift) {
            this.clearlock();
            this.ajustementAngle(event);
        } else {
            this.afficherSegementPreview(this.mouse);
        }
    }

    onKeyDown(event: KeyboardEvent): void {
        event.preventDefault();
        if (event.key === 'Shift') {
            this.shift = true;
        }
        if (event.key === 'Backspace') {
            if (this.pathData.length >= 2) {
                this.pathData.pop();
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.afficherSegementPreview(this.mouse);
            }
        }
        if (event.code === 'Escape') {
            this.clearPath();
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
        }
    }

    onDoubleClick(event: MouseEvent): void {
        const mousePosition = this.getPositionFromMouse(event);
        if (mousePosition !== this.pathData[0] && this.pathData.length >= 1 && this.pathData.length > 2) {
            const x1: number = mousePosition.x;
            const y1: number = mousePosition.y;
            const x2: number = this.pathData[0].x;
            const y2: number = this.pathData[0].y;
            const distance: number = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
            if (distance <= CONSTANTS.MINIMAL_DISTANCE_PIXEL) {
                this.pathData.pop();
                this.pathData.pop();

                this.pathData.push(this.pathData[0]);
            }
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.draw(this.drawingService.baseCtx);
            this.executedCommand.emit(this.clone());
            this.clearPath();
        }
    }

    onKeyUp(event: KeyboardEvent): void {
        if (event.key === 'Shift') {
            this.shift = false;
            this.clearlock();
            this.pathData.push(this.mouse);
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.draw(this.drawingService.previewCtx);
            this.pathData.pop();
        }
    }

    setPointeSize(value: number | null): void {
        const lineProperties = this.toolProperties as LineProperties;
        value = value === null ? 1 : value;
        lineProperties.pointSize = value;
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.draw(this.drawingService.previewCtx);
    }

    setThickness(value: number | null): void {
        value = value === null ? 1 : value;
        this.toolProperties.thickness = value;
        this.drawingService.setThickness(value);
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.draw(this.drawingService.previewCtx);
    }

    setTypeDrawing(value: string): void {
        const lineProperties = this.toolProperties as LineProperties;
        lineProperties.withPoint = value[0] === 'A' ? true : false;

        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.draw(this.drawingService.previewCtx);
    }

    draw(ctx: CanvasRenderingContext2D): void {
        const lineProperties = this.toolProperties as LineProperties;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.miterLimit = 1;
        ctx.beginPath();
        for (const point of this.pathData) {
            ctx.lineTo(point.x, point.y);
        }
        ctx.stroke();
        if (lineProperties.withPoint) {
            ctx.beginPath();
            for (const point of this.pathData) {
                ctx.beginPath();
                ctx.arc(point.x, point.y, lineProperties.pointSize, 0, Math.PI * 2, false);
                ctx.fill();
            }
        }
    }

    private afficherSegementPreview(point: Vec2): void {
        this.pathData.push(point);
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.draw(this.drawingService.previewCtx);
        this.pathData.pop();
    }

    private clearPath(): void {
        this.pathData = [];
    }

    ajustementAngle(event: MouseEvent): void {
        let angle = 0;
        const mousePosition = this.getPositionFromMouse(event);
        if (mousePosition !== this.pathData[this.pathData.length - 1] && this.pathData.length >= 1) {
            const x1: number = mousePosition.x;
            const y1: number = mousePosition.y;
            const x2: number = this.pathData[this.pathData.length - 1].x;
            const y2: number = this.pathData[this.pathData.length - 1].y;
            const d1: number = Math.abs(x1 - x2);
            const d2: number = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
            angle = Math.acos(d1 / d2);
            angle = angle * ((CONSTANTS.ANGLE_90 * 2) / Math.PI);

            if (angle >= CONSTANTS.ANGLE_45 / 2 && angle <= CONSTANTS.ANGLE_45 + CONSTANTS.ANGLE_45 / 2) {
                this.lockAngle(event, CONSTANTS.ANGLE_45);
            }
            if (angle < CONSTANTS.ANGLE_90 && angle > CONSTANTS.ANGLE_45 + CONSTANTS.ANGLE_45 / 2) {
                this.lockAngle(event, CONSTANTS.ANGLE_90);
            }
            if (angle < CONSTANTS.ANGLE_45 / 2 && angle >= 0) {
                this.lockAngle(event, CONSTANTS.ANGLE_180);
            }
        }
    }

    private lockAngle(event: MouseEvent, angle: number): void {
        const mousePosition = this.getPositionFromMouse(event);
        const point: Vec2 = mousePosition;
        switch (angle) {
            case CONSTANTS.ANGLE_45:
                const dx = mousePosition.x - this.pathData[this.pathData.length - 1].x;
                const dy = mousePosition.y - this.pathData[this.pathData.length - 1].y;
                const sign = Math.sign(dy) * Math.sign(dx);
                this.lock45 = true;
                const defaultValue = +!sign * mousePosition.y;
                point.y =
                    defaultValue +
                    sign * Math.tan(CONSTANTS.ANGLE_45) * (point.x - this.pathData[this.pathData.length - 1].x) +
                    this.pathData[this.pathData.length - 1].y;
                break;
            case CONSTANTS.ANGLE_90:
                point.x = this.pathData[this.pathData.length - 1].x;
                this.lock90 = true;
                break;
            case CONSTANTS.ANGLE_180:
                this.lock180 = true;
                point.y = this.pathData[this.pathData.length - 1].y;
                break;
        }
        this.afficherSegementPreview(point);
    }

    private clearlock(): void {
        this.lock180 = false;
        this.lock90 = false;
        this.lock45 = false;
    }

    resetContext(): void {
        const previewCtx = this.drawingService.previewCtx;
        const baseCtx = this.drawingService.baseCtx;
        previewCtx.lineCap = baseCtx.lineCap = 'butt';
        previewCtx.lineJoin = baseCtx.lineJoin = 'miter';
        this.mouseDown = false;
        this.shift = false;
        this.clearlock();
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.clearPath();
        this.setThickness(this.toolProperties.thickness);
    }

    copyLine(lineCopy: LineService): void {
        this.copyTool(lineCopy);
        const lineProperties = this.toolProperties as LineProperties;
        const lineCopyProperties = lineCopy.toolProperties as LineProperties;
        lineCopyProperties.pointSize = lineProperties.pointSize;
        lineCopyProperties.withPoint = lineProperties.withPoint;
    }

    clone(): LineService {
        const lineClone: LineService = new LineService(this.drawingService);
        this.copyLine(lineClone);
        return lineClone;
    }
}
