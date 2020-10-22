import { Injectable } from '@angular/core';
import { SelectionArrowIndex } from '@app/classes/selection-arrow-index.enum';
import { ShapeTool } from '@app/classes/tool/shape-tool';
import { BasicShapeProperties } from '@app/classes/tools-properties/basic-shape-properties';
import { Vec2 } from '@app/classes/vec2';
import * as CONSTANTS from '@app/constants/constants';
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
    private pressedKeys: number[];
    private canMoveSelection: boolean;
    private canMoveSelectionContiniously: boolean;

    protected imgData: ImageData;

    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.name = 'Selection';
        this.tooltip = 'Selection (r)';
        this.iconName = 'highlight_alt';
        this.toolProperties = new BasicShapeProperties();
        this.currentType = SelectionType.RectangleSelection;
        this.moveSelectionPos = { x: 0, y: 0 };
        this.pressedKeys = [0, 0, 0, 0];
        this.canMoveSelection = false;
        this.canMoveSelectionContiniously = false;
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
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                if (
                    (this.currentMousePosition.x !== this.mouseDownCoord.x || this.currentMousePosition.y !== this.mouseDownCoord.y) &&
                    this.width &&
                    this.height
                ) {
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
        } else if (this.isAreaSelected) {
            if (!this.canMoveSelection) return;

            this.canMoveSelection = false;
            this.pressedKeys[SelectionArrowIndex.Left] =
                event.key === 'ArrowLeft' ? CONSTANTS.SELECTION_MOVE_STEP : this.pressedKeys[SelectionArrowIndex.Left];
            this.pressedKeys[SelectionArrowIndex.Up] =
                event.key === 'ArrowUp' ? CONSTANTS.SELECTION_MOVE_STEP : this.pressedKeys[SelectionArrowIndex.Up];
            this.pressedKeys[SelectionArrowIndex.Right] =
                event.key === 'ArrowRight' ? -CONSTANTS.SELECTION_MOVE_STEP : this.pressedKeys[SelectionArrowIndex.Right];
            this.pressedKeys[SelectionArrowIndex.Down] =
                event.key === 'ArrowDown' ? -CONSTANTS.SELECTION_MOVE_STEP : this.pressedKeys[SelectionArrowIndex.Down];

            const moveX = this.pressedKeys[SelectionArrowIndex.Left] + this.pressedKeys[SelectionArrowIndex.Right];
            const moveY = this.pressedKeys[SelectionArrowIndex.Up] + this.pressedKeys[SelectionArrowIndex.Down];
            this.moveSelection(moveX, moveY);

            if (!this.canMoveSelectionContiniously) {
                this.canMoveSelectionContiniously = true;
                setTimeout(() => {
                    this.canMoveSelection = true;
                }, CONSTANTS.SELECTION_MOVE_START_DELAY);
            } else {
                setTimeout(() => {
                    this.canMoveSelection = true;
                }, CONSTANTS.SELECTION_MOVE_DELAY);
            }
        }
    }

    onKeyUp(event: KeyboardEvent): void {
        if (this.mouseDown) {
            super.onKeyUp(event);
        } else if (this.isAreaSelected) {
            this.pressedKeys[SelectionArrowIndex.Left] = event.key === 'ArrowLeft' ? 0 : this.pressedKeys[SelectionArrowIndex.Left];
            this.pressedKeys[SelectionArrowIndex.Up] = event.key === 'ArrowUp' ? 0 : this.pressedKeys[SelectionArrowIndex.Up];
            this.pressedKeys[SelectionArrowIndex.Right] = event.key === 'ArrowRight' ? 0 : this.pressedKeys[SelectionArrowIndex.Right];
            this.pressedKeys[SelectionArrowIndex.Down] = event.key === 'ArrowDown' ? 0 : this.pressedKeys[SelectionArrowIndex.Down];

            this.canMoveSelectionContiniously = this.pressedKeys.some((key) => {
                return key !== 0;
            });
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
            this.canMoveSelection = false;
            const selectionCtx = this.drawingService.previewCtx;

            const canvasTopOffset = +selectionCtx.canvas.offsetTop;
            const canvasLeftOffset = +selectionCtx.canvas.offsetLeft;

            // const radius: Vec2 = { x: this.positiveWidth / 2, y: this.positiveHeight / 2 };

            // this.drawingService.baseCtx.beginPath();
            // this.drawingService.baseCtx.ellipse(canvasLeftOffset + radius.x, canvasTopOffset + radius.y, radius.x, radius.y, 0, 0, 2 * Math.PI);
            // this.drawingService.baseCtx.clip();

            this.drawingService.clearCanvas(selectionCtx);
            selectionCtx.putImageData(this.imgData, 0, 0);
            this.drawingService.baseCtx.drawImage(selectionCtx.canvas, canvasLeftOffset, canvasTopOffset);

            selectionCtx.canvas.width = this.drawingService.canvas.width;
            selectionCtx.canvas.height = this.drawingService.canvas.height;
            selectionCtx.canvas.style.left = '0px';
            selectionCtx.canvas.style.top = '0px';

            selectionCtx.canvas.style.cursor = '';
        }
    }

    drawShape(): void {
        this.computePositiveRectangleValues();

        const ctx = this.drawingService.previewCtx;
        ctx.save();

        this.setThickness(CONSTANTS.SELECTION_BOX_THICKNESS);

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
        ctx.setLineDash([CONSTANTS.DASHED_SEGMENTS]);
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
            ctx.setLineDash([CONSTANTS.DASHED_SEGMENTS]);
            ctx.strokeStyle = 'black';
            ctx.stroke();
        }
    }

    private drawSelectedArea(): void {
        this.isAreaSelected = true;
        this.canMoveSelection = true;
        const selectionCtx = this.drawingService.previewCtx;
        selectionCtx.canvas.style.left = this.positiveStartingPos.x + 'px';
        selectionCtx.canvas.style.top = this.positiveStartingPos.y + 'px';
        selectionCtx.canvas.width = this.positiveWidth;
        selectionCtx.canvas.height = this.positiveHeight;

        if (this.currentType === SelectionType.EllipseSelection) {
            const radius: Vec2 = { x: this.positiveWidth / 2, y: this.positiveHeight / 2 };
            this.drawingService.previewCtx.beginPath();
            this.drawingService.previewCtx.ellipse(radius.x, radius.y, radius.x, radius.y, 0, 0, 2 * Math.PI);
            this.drawingService.previewCtx.clip();
        }

        this.drawingService.previewCtx.drawImage(
            this.drawingService.canvas,
            this.positiveStartingPos.x,
            this.positiveStartingPos.y,
            this.positiveWidth,
            this.positiveHeight,
            0,
            0,
            this.positiveWidth,
            this.positiveHeight,
        );

        this.drawingService.baseCtx.save();
        this.drawingService.baseCtx.fillStyle = 'white';
        this.drawingService.baseCtx.beginPath();
        if (this.currentType === SelectionType.RectangleSelection) {
            console.log('rect');
            this.drawingService.baseCtx.rect(this.positiveStartingPos.x, this.positiveStartingPos.y, this.positiveWidth, this.positiveHeight);
        } else if (this.currentType === SelectionType.EllipseSelection) {
            const radius: Vec2 = { x: this.positiveWidth / 2, y: this.positiveHeight / 2 };

            this.drawingService.baseCtx.ellipse(
                this.positiveStartingPos.x + radius.x,
                this.positiveStartingPos.y + radius.y,
                radius.x,
                radius.y,
                0,
                0,
                2 * Math.PI,
            );
        }
        this.drawingService.baseCtx.fill();
        this.drawingService.baseCtx.restore();

        this.imgData = this.drawingService.previewCtx.getImageData(0, 0, this.positiveWidth, this.positiveHeight);

        let rows = 0;
        for (let i = 0; i < this.imgData.data.length; i += CONSTANTS.IMAGE_DATA_OPACITY_INDEX + 1) {
            const x = (i / 4) % this.imgData.width;
            if (x === 0) rows++;
            const isPointInEllipse =
                Math.pow(x - this.positiveWidth / 2, 2) / Math.pow(this.positiveWidth / 2, 2) +
                    Math.pow(rows - this.positiveHeight / 2, 2) / Math.pow(this.positiveHeight / 2, 2) <=
                1;

            if (this.imgData.data[i + CONSTANTS.IMAGE_DATA_OPACITY_INDEX] === 0) {
                if (!isPointInEllipse && this.currentType === SelectionType.EllipseSelection) continue;
                this.imgData.data[i] = CONSTANTS.MAX_COLOR_VALUE;
                this.imgData.data[i + 1] = CONSTANTS.MAX_COLOR_VALUE;
                this.imgData.data[i + 2] = CONSTANTS.MAX_COLOR_VALUE;
                this.imgData.data[i + CONSTANTS.IMAGE_DATA_OPACITY_INDEX] = CONSTANTS.MAX_COLOR_VALUE;
            }
        }

        this.drawingService.previewCtx.putImageData(this.imgData, 0, 0, 0, 0, this.positiveWidth, this.positiveHeight);

        this.drawEllipseSelection({ x: 0, y: 0 }, this.positiveWidth, this.positiveHeight);
        selectionCtx.canvas.style.cursor = 'move';
    }

    private computePositiveRectangleValues(): void {
        this.positiveStartingPos.x = this.width >= 0 ? this.mouseDownCoord.x : this.mouseDownCoord.x + this.width;
        this.positiveWidth = Math.abs(this.width);
        this.positiveStartingPos.y = this.height >= 0 ? this.mouseDownCoord.y : this.mouseDownCoord.y + this.height;
        this.positiveHeight = Math.abs(this.height);
    }

    private moveSelection(moveX: number, moveY: number): void {
        const elementOffsetLeft = this.drawingService.previewCtx.canvas.offsetLeft;
        const elementOffsetTop = this.drawingService.previewCtx.canvas.offsetTop;

        const newOffsetLeft = elementOffsetLeft - moveX;

        const newOffsetTop = elementOffsetTop - moveY;

        this.drawingService.previewCtx.canvas.style.left = newOffsetLeft + 'px';
        this.drawingService.previewCtx.canvas.style.top = newOffsetTop + 'px';

        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        console.log(newOffsetLeft);
        this.drawingService.previewCtx.putImageData(
            this.imgData,
            newOffsetLeft >= 0 ? 0 : -newOffsetLeft,
            newOffsetTop >= 0 ? 0 : -newOffsetTop,
            0,
            0,
            this.drawingService.canvas.width - newOffsetLeft,
            this.drawingService.canvas.height - newOffsetTop,
        );
        this.drawEllipseSelection({ x: 0, y: 0 }, this.positiveWidth, this.positiveHeight);
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
