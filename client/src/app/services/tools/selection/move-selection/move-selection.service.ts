import { Injectable } from '@angular/core';
import { SelectionArrowIndex } from '@app/classes/selection-arrow-index.enum';
import { Vec2 } from '@app/classes/vec2';
import * as CONSTANTS from '@app/constants/constants';
import { SelectionType } from '@app/enums/selection-type.enum';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class MoveSelectionService {
    imgData: ImageData;
    canMoveSelection: boolean;
    private canMoveSelectionContiniously: boolean;
    private pressedKeys: number[];

    constructor(private drawingService: DrawingService) {
        this.pressedKeys = [0, 0, 0, 0];
        this.canMoveSelection = false;
        this.canMoveSelectionContiniously = false;
    }

    checkArrowKeysPressed(event: KeyboardEvent): boolean {
        let arrowKeyPressed = false;
        if (this.canMoveSelection) {
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
            if (moveX !== 0 || moveY !== 0) {
                arrowKeyPressed = true;
                this.moveSelection(moveX, moveY);
            }

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
        return arrowKeyPressed;
    }

    checkArrowKeysReleased(event: KeyboardEvent): void {
        this.pressedKeys[SelectionArrowIndex.Left] = event.key === 'ArrowLeft' ? 0 : this.pressedKeys[SelectionArrowIndex.Left];
        this.pressedKeys[SelectionArrowIndex.Up] = event.key === 'ArrowUp' ? 0 : this.pressedKeys[SelectionArrowIndex.Up];
        this.pressedKeys[SelectionArrowIndex.Right] = event.key === 'ArrowRight' ? 0 : this.pressedKeys[SelectionArrowIndex.Right];
        this.pressedKeys[SelectionArrowIndex.Down] = event.key === 'ArrowDown' ? 0 : this.pressedKeys[SelectionArrowIndex.Down];

        this.canMoveSelectionContiniously = this.pressedKeys.some((key) => {
            return key !== 0;
        });

        this.canMoveSelection = this.canMoveSelectionContiniously ? this.canMoveSelection : true;
    }

    moveSelection(moveX: number, moveY: number): void {
        const elementOffsetLeft = this.drawingService.previewCtx.canvas.offsetLeft;
        const elementOffsetTop = this.drawingService.previewCtx.canvas.offsetTop;

        const newOffsetLeft = elementOffsetLeft - moveX;
        const newOffsetTop = elementOffsetTop - moveY;

        this.drawingService.previewCtx.canvas.style.left = newOffsetLeft + 'px';
        this.drawingService.previewCtx.canvas.style.top = newOffsetTop + 'px';

        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.drawingService.previewCtx.putImageData(
            this.imgData,
            0,
            0,
            newOffsetLeft >= 0 ? 0 : -newOffsetLeft,
            newOffsetTop >= 0 ? 0 : -newOffsetTop,
            this.drawingService.canvas.width - newOffsetLeft,
            this.drawingService.canvas.height - newOffsetTop,
        );
    }

    copySelection(startingPos: Vec2, width: number, height: number, currentType: SelectionType): void {
        const selectionCtx = this.drawingService.previewCtx;
        selectionCtx.canvas.style.left = startingPos.x + 'px';
        selectionCtx.canvas.style.top = startingPos.y + 'px';
        selectionCtx.canvas.width = width;
        selectionCtx.canvas.height = height;

        this.imgData = this.drawingService.baseCtx.getImageData(startingPos.x, startingPos.y, width, height);
        const areaToClear = this.drawingService.baseCtx.getImageData(startingPos.x, startingPos.y, width, height);

        let y = 0;
        for (let i = 0; i < this.imgData.data.length; i += CONSTANTS.IMAGE_DATA_OPACITY_INDEX + 1) {
            if (currentType === SelectionType.EllipseSelection) {
                const x = (i / (CONSTANTS.IMAGE_DATA_OPACITY_INDEX + 1)) % this.imgData.width;
                if (x === 0) y++;

                if (!this.isPositionInEllipse({ x, y }, width, height)) {
                    this.imgData.data[i] = 0;
                    this.imgData.data[i + 1] = 0;
                    this.imgData.data[i + 2] = 0;
                    this.imgData.data[i + CONSTANTS.IMAGE_DATA_OPACITY_INDEX] = 0;
                    continue;
                }
            }
            areaToClear.data[i] = 0;
            areaToClear.data[i + 1] = 0;
            areaToClear.data[i + 2] = 0;
            areaToClear.data[i + CONSTANTS.IMAGE_DATA_OPACITY_INDEX] = 0;

            if (this.imgData.data[i + CONSTANTS.IMAGE_DATA_OPACITY_INDEX] === 0) {
                this.imgData.data[i] = CONSTANTS.MAX_COLOR_VALUE;
                this.imgData.data[i + 1] = CONSTANTS.MAX_COLOR_VALUE;
                this.imgData.data[i + 2] = CONSTANTS.MAX_COLOR_VALUE;
                this.imgData.data[i + CONSTANTS.IMAGE_DATA_OPACITY_INDEX] = CONSTANTS.MAX_COLOR_VALUE;
            }
        }

        selectionCtx.putImageData(this.imgData, 0, 0, 0, 0, width, height);
        this.drawingService.baseCtx.putImageData(areaToClear, startingPos.x, startingPos.y, 0, 0, width, height);
        selectionCtx.canvas.style.cursor = 'move';
    }

    private isPositionInEllipse(position: Vec2, width: number, height: number): boolean {
        return Math.pow(position.x - width / 2, 2) / Math.pow(width / 2, 2) + Math.pow(position.y - height / 2, 2) / Math.pow(height / 2, 2) <= 1;
    }
}
