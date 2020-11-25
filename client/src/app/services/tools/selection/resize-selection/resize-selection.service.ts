import { Injectable } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import { ControlPoint } from '@app/enums/control-point.enum';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ResizeService } from '@app/services/resize/resize.service';

@Injectable({
    providedIn: 'root',
})
export class ResizeSelectionService {
    startingPoint: Vec2;

    constructor(private resizeService: ResizeService, private drawingService: DrawingService) {}

    onResize(event: MouseEvent, startingPoint: Vec2): Vec2 {
        this.startingPoint = startingPoint;
        this.onResizeWidth(event);
        this.onResizeHeight(event);
        this.onChangeStartingPoint(event);
        return this.startingPoint;
    }

    private onResizeWidth(event: MouseEvent): void {
        const isHeightOnlyControlPoint =
            this.resizeService.controlPoint === ControlPoint.BottomCenter || this.resizeService.controlPoint === ControlPoint.TopCenter;
        const isControlLeftSide =
            this.resizeService.controlPoint === ControlPoint.TopLeft ||
            this.resizeService.controlPoint === ControlPoint.CenterLeft ||
            this.resizeService.controlPoint === ControlPoint.BottomLeft;
        if (isHeightOnlyControlPoint) return;
        const widthDiff = event.clientX - this.drawingService.canvas.getBoundingClientRect().x - this.startingPoint.x;
        const oldWidth = this.drawingService.previewCtx.canvas.width;
        const newWidth = isControlLeftSide ? oldWidth - widthDiff : widthDiff;
        this.drawingService.previewCtx.canvas.width = newWidth;
    }

    private onResizeHeight(event: MouseEvent): void {
        const isHeightOnlyControlPoint =
            this.resizeService.controlPoint === ControlPoint.CenterLeft || this.resizeService.controlPoint === ControlPoint.CenterRight;
        const isControlTopSide =
            this.resizeService.controlPoint === ControlPoint.TopLeft ||
            this.resizeService.controlPoint === ControlPoint.TopCenter ||
            this.resizeService.controlPoint === ControlPoint.TopRight;

        if (isHeightOnlyControlPoint) return;
        const heightDiff = event.clientY - this.drawingService.canvas.getBoundingClientRect().y - this.startingPoint.y;
        const oldHeight = this.drawingService.previewCtx.canvas.height;
        const newHeight = isControlTopSide ? oldHeight - heightDiff : heightDiff;
        this.drawingService.previewCtx.canvas.height = newHeight;
    }

    private onChangeStartingPoint(event: MouseEvent): void {
        this.onChangeStartingX(event);
        this.onChangeStartingY(event);
    }

    private onChangeStartingX(event: MouseEvent): void {
        const isControlLeftSide =
            this.resizeService.controlPoint === ControlPoint.TopLeft ||
            this.resizeService.controlPoint === ControlPoint.CenterLeft ||
            this.resizeService.controlPoint === ControlPoint.BottomLeft;
        if (!isControlLeftSide) return;
        this.startingPoint.x = event.clientX - this.drawingService.canvas.getBoundingClientRect().x;
        this.drawingService.previewCtx.canvas.style.left = this.startingPoint.x + 'px';
    }

    private onChangeStartingY(event: MouseEvent): void {
        const isControlTopSide =
            this.resizeService.controlPoint === ControlPoint.TopLeft ||
            this.resizeService.controlPoint === ControlPoint.TopCenter ||
            this.resizeService.controlPoint === ControlPoint.TopRight;
        if (!isControlTopSide) return;
        this.startingPoint.y = event.clientY - this.drawingService.canvas.getBoundingClientRect().y;
        this.drawingService.previewCtx.canvas.style.top = this.startingPoint.y + 'px';
    }

    get isResizing(): boolean {
        return this.resizeService.isResizing;
    }
}
