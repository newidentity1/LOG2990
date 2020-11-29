import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import { ControlPoint } from '@app/enums/control-point.enum';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ResizeService } from '@app/services/resize/resize.service';

@Injectable({
    providedIn: 'root',
})
export class ResizeSelectionService {
    private startingPoint: Vec2;
    private renderer: Renderer2;
    private selectionImageCanvas: HTMLCanvasElement;
    private oppositeControlPointsWidth: Map<ControlPoint, ControlPoint> = new Map<ControlPoint, ControlPoint>();
    private oppositeControlPointsHeight: Map<ControlPoint, ControlPoint> = new Map<ControlPoint, ControlPoint>();
    isMirrorWidth: boolean = false;
    isMirrorHeight: boolean = false;

    constructor(private resizeService: ResizeService, private drawingService: DrawingService, private rendererFactory: RendererFactory2) {
        this.renderer = this.rendererFactory.createRenderer(null, null);
        this.selectionImageCanvas = this.renderer.createElement('canvas');
        this.oppositeControlPointsWidth
            .set(ControlPoint.CenterLeft, ControlPoint.CenterRight)
            .set(ControlPoint.CenterRight, ControlPoint.CenterLeft)
            .set(ControlPoint.BottomLeft, ControlPoint.BottomRight)
            .set(ControlPoint.BottomRight, ControlPoint.BottomLeft)
            .set(ControlPoint.TopLeft, ControlPoint.TopRight)
            .set(ControlPoint.TopRight, ControlPoint.TopLeft);

        this.oppositeControlPointsHeight
            .set(ControlPoint.BottomCenter, ControlPoint.TopCenter)
            .set(ControlPoint.TopCenter, ControlPoint.BottomCenter)
            .set(ControlPoint.BottomLeft, ControlPoint.TopLeft)
            .set(ControlPoint.BottomRight, ControlPoint.TopRight)
            .set(ControlPoint.TopLeft, ControlPoint.BottomLeft)
            .set(ControlPoint.TopRight, ControlPoint.BottomRight);
    }

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
        let newWidth = isControlLeftSide ? oldWidth - widthDiff : widthDiff;
        if (newWidth <= 0) {
            newWidth = 1;
            this.isMirrorWidth = !this.isMirrorWidth;
            this.changeOppositeControlPointWidth();
        }

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
        let newHeight = isControlTopSide ? oldHeight - heightDiff : heightDiff;
        if (newHeight <= 0) {
            newHeight = 1;
            this.changeOppositeControlPointHeight();
            this.isMirrorHeight = !this.isMirrorHeight;
        }

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

    scaleImage(selectionImage: ImageData): ImageData {
        const selectionWidth = this.drawingService.previewCtx.canvas.width;
        const selectionHeight = this.drawingService.previewCtx.canvas.height;

        let scaleX = selectionWidth / selectionImage.width;
        let scaleY = selectionHeight / selectionImage.height;
        scaleX = this.isMirrorWidth ? -scaleX : scaleX;
        scaleY = this.isMirrorHeight ? -scaleY : scaleY;

        this.selectionImageCanvas.width = selectionImage.width;
        this.selectionImageCanvas.height = selectionImage.height;
        const context = this.selectionImageCanvas.getContext('2d') as CanvasRenderingContext2D;
        context.putImageData(selectionImage, 0, 0);

        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.drawingService.previewCtx.scale(scaleX, scaleY);
        const posX = this.isMirrorWidth ? -selectionImage.width : 0;
        const posY = this.isMirrorHeight ? -selectionImage.height : 0;
        this.drawingService.previewCtx.drawImage(this.selectionImageCanvas, posX, posY);
        this.drawingService.previewCtx.setTransform(1, 0, 0, 1, 0, 0);

        return this.drawingService.previewCtx.getImageData(0, 0, selectionWidth, selectionHeight);
    }

    scaleImageKeepRatio(selectionImage: ImageData): ImageData {
        const selectionWidth = this.drawingService.previewCtx.canvas.width;
        const selectionHeight = this.drawingService.previewCtx.canvas.height;

        let scaleX = selectionWidth / selectionImage.width;
        let scaleY = selectionHeight / selectionImage.height;
        scaleX = this.isMirrorWidth ? -scaleX : scaleX;
        scaleY = this.isMirrorHeight ? -scaleY : scaleY;
        scaleX = scaleX > scaleY ? Math.sign(scaleX) * Math.abs(scaleY) : scaleX;
        scaleY = scaleY > scaleX ? Math.sign(scaleY) * Math.abs(scaleX) : scaleY;

        this.selectionImageCanvas.width = selectionImage.width;
        this.selectionImageCanvas.height = selectionImage.height;
        const context = this.selectionImageCanvas.getContext('2d') as CanvasRenderingContext2D;
        context.putImageData(selectionImage, 0, 0);

        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.drawingService.previewCtx.scale(scaleX, scaleY);
        const posX = this.isMirrorWidth ? -selectionImage.width : 0;
        const posY = this.isMirrorHeight ? -selectionImage.height : 0;
        this.drawingService.previewCtx.drawImage(this.selectionImageCanvas, posX, posY);
        this.drawingService.previewCtx.setTransform(1, 0, 0, 1, 0, 0);

        return this.drawingService.previewCtx.getImageData(0, 0, selectionWidth, selectionHeight);
    }

    changeOppositeControlPointWidth(): void {
        if (this.resizeService.controlPoint === null) return;
        const oppositeControlPoint = this.oppositeControlPointsWidth.get(this.resizeService.controlPoint);
        this.resizeService.controlPoint = oppositeControlPoint !== undefined ? oppositeControlPoint : this.resizeService.controlPoint;
    }

    changeOppositeControlPointHeight(): void {
        if (this.resizeService.controlPoint === null) return;
        const oppositeControlPoint = this.oppositeControlPointsHeight.get(this.resizeService.controlPoint);
        this.resizeService.controlPoint = oppositeControlPoint !== undefined ? oppositeControlPoint : this.resizeService.controlPoint;
    }

    get isResizing(): boolean {
        return this.resizeService.isResizing;
    }
}
