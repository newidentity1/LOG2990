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
    private resizeImageCanvas: HTMLCanvasElement;
    private oppositeControlPointsWidth: Map<ControlPoint, ControlPoint> = new Map<ControlPoint, ControlPoint>();
    private oppositeControlPointsHeight: Map<ControlPoint, ControlPoint> = new Map<ControlPoint, ControlPoint>();
    isMirrorWidth: boolean = false;
    isMirrorHeight: boolean = false;
    scaledImage: ImageData;
    scaleX: number = 1;
    scaleY: number = 1;

    constructor(private resizeService: ResizeService, private drawingService: DrawingService, private rendererFactory: RendererFactory2) {
        this.renderer = this.rendererFactory.createRenderer(null, null);
        this.resizeImageCanvas = this.renderer.createElement('canvas');
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
            this.changeOppositeControlPoint(true);
        }

        this.drawingService.previewCtx.canvas.width = newWidth;
    }

    private onResizeHeight(event: MouseEvent): void {
        const isWidthOnlyControlPoint =
            this.resizeService.controlPoint === ControlPoint.CenterLeft || this.resizeService.controlPoint === ControlPoint.CenterRight;
        const isControlTopSide =
            this.resizeService.controlPoint === ControlPoint.TopLeft ||
            this.resizeService.controlPoint === ControlPoint.TopCenter ||
            this.resizeService.controlPoint === ControlPoint.TopRight;

        if (isWidthOnlyControlPoint) return;
        const heightDiff = event.clientY - this.drawingService.canvas.getBoundingClientRect().y - this.startingPoint.y;
        const oldHeight = this.drawingService.previewCtx.canvas.height;
        let newHeight = isControlTopSide ? oldHeight - heightDiff : heightDiff;
        if (newHeight <= 0) {
            newHeight = 1;
            this.changeOppositeControlPoint(false);
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

        this.scaleX = selectionWidth / selectionImage.width;
        this.scaleY = selectionHeight / selectionImage.height;
        this.scaleX = this.isMirrorWidth ? -this.scaleX : this.scaleX;
        this.scaleY = this.isMirrorHeight ? -this.scaleY : this.scaleY;

        return this.applyScaleToImage(selectionImage);
    }

    scaleImageKeepRatio(selectionImage: ImageData): ImageData {
        const selectionWidth = this.drawingService.previewCtx.canvas.width;
        const selectionHeight = this.drawingService.previewCtx.canvas.height;

        this.scaleX = selectionWidth / selectionImage.width;
        this.scaleY = selectionHeight / selectionImage.height;
        this.scaleX = this.isMirrorWidth ? -this.scaleX : this.scaleX;
        this.scaleY = this.isMirrorHeight ? -this.scaleY : this.scaleY;
        this.scaleX = Math.abs(this.scaleX) > Math.abs(this.scaleY) ? Math.sign(this.scaleX) * Math.abs(this.scaleY) : this.scaleX;
        this.scaleY = Math.abs(this.scaleY) > Math.abs(this.scaleX) ? Math.sign(this.scaleY) * Math.abs(this.scaleX) : this.scaleY;

        return this.applyScaleToImage(selectionImage);
    }

    applyScaleToImage(selectionImage: ImageData): ImageData {
        this.resizeImageCanvas.width = selectionImage.width;
        this.resizeImageCanvas.height = selectionImage.height;
        const context = this.resizeImageCanvas.getContext('2d') as CanvasRenderingContext2D;
        context.putImageData(selectionImage, 0, 0);
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.drawingService.previewCtx.scale(this.scaleX, this.scaleY);
        const posX = this.isMirrorWidth ? -selectionImage.width : 0;
        const posY = this.isMirrorHeight ? -selectionImage.height : 0;

        this.drawingService.previewCtx.drawImage(this.resizeImageCanvas, posX, posY);
        this.drawingService.previewCtx.setTransform(1, 0, 0, 1, 0, 0);

        this.scaledImage = this.drawingService.previewCtx.getImageData(
            0,
            0,
            this.drawingService.previewCtx.canvas.width,
            this.drawingService.previewCtx.canvas.height,
        );
        const selectionCanvasOffsetLeft = this.drawingService.previewCtx.canvas.offsetLeft;
        const selectionCanvasOffsetTop = this.drawingService.previewCtx.canvas.offsetTop;
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.drawingService.previewCtx.putImageData(
            this.scaledImage,
            0,
            0,
            selectionCanvasOffsetLeft >= 0 ? 0 : -selectionCanvasOffsetLeft,
            selectionCanvasOffsetTop >= 0 ? 0 : -selectionCanvasOffsetTop,
            this.drawingService.canvas.width - selectionCanvasOffsetLeft,
            this.drawingService.canvas.height - selectionCanvasOffsetTop,
        );

        return this.scaledImage;
    }

    private changeOppositeControlPoint(isWidth: boolean): void {
        if (this.resizeService.controlPoint === null) return;
        const oppositeControlPoint = isWidth
            ? this.oppositeControlPointsWidth.get(this.resizeService.controlPoint)
            : this.oppositeControlPointsHeight.get(this.resizeService.controlPoint);
        this.resizeService.controlPoint = oppositeControlPoint !== undefined ? oppositeControlPoint : this.resizeService.controlPoint;
    }

    isResizing(): boolean {
        return this.resizeService.isResizing;
    }
}
