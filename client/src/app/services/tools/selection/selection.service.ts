import { Injectable } from '@angular/core';
import { ShapeTool } from '@app/classes/tool/shape-tool';
import { BasicShapeProperties } from '@app/classes/tools-properties/basic-shape-properties';
import { Vec2 } from '@app/classes/vec2';
import { DASHED_SEGMENTS, SELECTION_BOX_THICKNESS } from '@app/constants/constants';
import { MouseButton } from '@app/enums/mouse-button.enum';
import { SelectionType } from '@app/enums/selection-type.enum';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class SelectionService extends ShapeTool {
    currentType: SelectionType;
    isAreaSelected: boolean;
    protected positiveStartingPos: Vec2;
    protected positiveWidth: number;
    protected positiveHeight: number;
    private moveSelectionPos: Vec2;

    // protected imgData: ImageData;

    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.name = 'Selection';
        this.tooltip = 'Selection (r)';
        this.iconName = 'highlight_alt';
        this.toolProperties = new BasicShapeProperties();
        this.currentType = SelectionType.RectangleSelection;
        this.moveSelectionPos = { x: 0, y: 0 };
    }

    setSelectionType(type: SelectionType): void {
        switch (type) {
            case SelectionType.RectangleSelection:
                this.currentType = SelectionType.RectangleSelection;
                break;
            case SelectionType.EllipseSelection:
                this.currentType = SelectionType.EllipseSelection;
                break;
        }
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        this.mouseDownCoord = this.getPositionFromMouse(event);
        if (this.mouseDown) {
            if (this.isAreaSelected) {
                this.moveSelectionPos = { x: event.clientX, y: event.clientY };
            }
        }
    }

    onMouseMove(event: MouseEvent): void {
        this.currentMousePosition = this.getPositionFromMouse(event);
        if (this.mouseDown) {
            if (this.isAreaSelected) {
                const moveX = this.moveSelectionPos.x - event.clientX;
                const moveY = this.moveSelectionPos.y - event.clientY;
                this.moveSelectionPos.x = event.clientX;
                this.moveSelectionPos.y = event.clientY;
                this.moveSelection(moveX, moveY);
            } else {
                this.drawPreview();
            }
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            if (!this.isAreaSelected) {
                this.currentMousePosition = this.getPositionFromMouse(event);
                if (this.currentMousePosition.x !== this.mouseDownCoord.x || this.currentMousePosition.y !== this.mouseDownCoord.y) {
                    this.drawSelectedArea();
                }
            }
            this.mouseDown = false;
        }
    }

    onKeyDown(event: KeyboardEvent): void {
        if (event.key === 'Escape' && (this.mouseDown || this.isAreaSelected)) {
            this.resetSelection();
        }
        if (this.mouseDown) {
            super.onKeyDown(event);
        }
    }

    onKeyUp(event: KeyboardEvent): void {
        if (this.mouseDown) {
            super.onKeyUp(event);
        }
    }

    selectAll(): void {
        this.setSelectionType(SelectionType.RectangleSelection);
        this.positiveStartingPos.x = 0;
        this.positiveStartingPos.y = 0;
        this.positiveWidth = this.drawingService.canvas.width;
        this.positiveHeight = this.drawingService.canvas.height;
        this.drawSelectedArea();
    }

    resetSelection(): void {
        if (this.isAreaSelected) {
            this.isAreaSelected = false;
            const selectionCtx = this.drawingService.previewCtx;
            // TODO : Handle move

            // this.imgData = selectionCtx.getImageData(0, 0, this.positiveWidth, this.positiveHeight);
            // const canvasTopOffset = +selectionCtx.canvas.style.top.substring(0, selectionCtx.canvas.style.top.length - 2);
            // const canvasLeftOffset = +selectionCtx.canvas.style.left.substring(0, selectionCtx.canvas.style.left.length - 2);
            // this.drawingService.baseCtx.putImageData(
            // this.imgData,
            // canvasLeftOffset,
            // canvasTopOffset,
            // 0,
            // 0,
            // this.positiveWidth,
            // this.positiveWidth
            // );
            selectionCtx.canvas.width = this.drawingService.canvas.width;
            selectionCtx.canvas.height = this.drawingService.canvas.height;
            selectionCtx.canvas.style.left = '0px';
            selectionCtx.canvas.style.top = '0px';

            selectionCtx.canvas.style.cursor = '';
            selectionCtx.setLineDash([]);
        }
    }

    drawShape(): void {
        this.computePositiveRectangleValues();

        const ctx = this.drawingService.previewCtx;
        ctx.save();

        this.setThickness(SELECTION_BOX_THICKNESS);

        this.drawRectangleSelection(this.positiveStartingPos, this.positiveWidth, this.positiveHeight);
        this.drawEllipseSelection(this.positiveStartingPos, this.positiveWidth, this.positiveHeight);

        ctx.restore();
    }

    private drawRectangleSelection(position: Vec2, width: number, height: number): void {
        const ctx = this.drawingService.previewCtx;
        ctx.beginPath();
        ctx.rect(position.x, position.y, width, height);
        ctx.setLineDash([]);
        ctx.strokeStyle = 'white';
        ctx.stroke();
        ctx.setLineDash([DASHED_SEGMENTS]);
        ctx.strokeStyle = 'black';
        ctx.stroke();
    }

    private drawEllipseSelection(position: Vec2, width: number, height: number): void {
        if (this.currentType === SelectionType.EllipseSelection) {
            const ctx = this.drawingService.previewCtx;
            const radius: Vec2 = { x: width / 2, y: height / 2 };
            ctx.beginPath();
            ctx.ellipse(position.x + radius.x, position.y + radius.y, radius.x, radius.y, 0, 0, 2 * Math.PI);
            ctx.setLineDash([]);
            ctx.strokeStyle = 'white';
            ctx.stroke();
            ctx.setLineDash([DASHED_SEGMENTS]);
            ctx.strokeStyle = 'black';
            ctx.stroke();
        }
    }

    private drawSelectedArea(): void {
        this.isAreaSelected = true;
        const selectionCtx = this.drawingService.previewCtx;
        selectionCtx.canvas.style.left = this.positiveStartingPos.x + 'px';
        selectionCtx.canvas.style.top = this.positiveStartingPos.y + 'px';
        selectionCtx.canvas.width = this.positiveWidth;
        selectionCtx.canvas.height = this.positiveHeight;
        // this.imgData = this.drawingService.baseCtx.getImageData(
        //     this.positiveStartingPos.x,
        //     this.positiveStartingPos.y,
        //     this.positiveWidth,
        //     this.positiveHeight,
        // );

        setTimeout(() => {
            // TODO : Handle move
            this.drawEllipseSelection({ x: 0, y: 0 }, this.positiveWidth, this.positiveHeight);
            selectionCtx.canvas.style.cursor = 'move';
        }, 0);
    }

    private computePositiveRectangleValues(): void {
        this.positiveStartingPos.x = this.width >= 0 ? this.mouseDownCoord.x : this.mouseDownCoord.x + this.width;
        this.positiveWidth = Math.abs(this.width);
        this.positiveStartingPos.y = this.height >= 0 ? this.mouseDownCoord.y : this.mouseDownCoord.y + this.height;
        this.positiveHeight = Math.abs(this.height);
    }

    private moveSelection(moveX: number, moveY: number): void {
        const elementOffsetTop = this.drawingService.previewCtx.canvas.offsetTop;
        const elementOffsetLeft = this.drawingService.previewCtx.canvas.offsetLeft;
        this.drawingService.previewCtx.canvas.style.left =
            elementOffsetLeft + this.positiveWidth - moveX >= 0 && elementOffsetLeft - moveX <= this.drawingService.canvas.width
                ? elementOffsetLeft - moveX + 'px'
                : elementOffsetLeft + 'px';
        this.drawingService.previewCtx.canvas.style.top =
            elementOffsetTop + this.positiveHeight - moveY >= 0 && elementOffsetTop - moveY <= this.drawingService.canvas.height
                ? elementOffsetTop - moveY + 'px'
                : elementOffsetTop + 'px';
    }

    setColors(): void {
        this.drawingService.setStrokeColor('black');
    }

    resetContext(): void {
        this.mouseDown = false;
        this.isAreaSelected = false;
        this.positiveStartingPos = { x: 0, y: 0 };
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
    }
}
