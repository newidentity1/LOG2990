import { Injectable } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import * as CONSTANTS from '@app/constants/constants';
import { SelectionArrowIndex } from '@app/enums/selection-arrow-index.enum';
import { SelectionType } from '@app/enums/selection-type.enum';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class MoveSelectionService {
    imgData: ImageData;
    canMoveSelection: boolean = false;
    startingPosition: Vec2 = { x: 0, y: 0 };
    finalPosition: Vec2 = { x: 0, y: 0 };
    private canMoveSelectionContiniously: boolean = false;
    private pressedKeys: number[] = [0, 0, 0, 0];

    constructor(private drawingService: DrawingService) {}

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

        this.finalPosition.x = elementOffsetLeft - moveX;
        this.finalPosition.y = elementOffsetTop - moveY;

        this.drawingService.previewCtx.canvas.style.left = this.finalPosition.x + 'px';
        this.drawingService.previewCtx.canvas.style.top = this.finalPosition.y + 'px';

        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.drawingService.previewCtx.putImageData(
            this.imgData,
            0,
            0,
            this.finalPosition.x >= 0 ? 0 : -this.finalPosition.x,
            this.finalPosition.y >= 0 ? 0 : -this.finalPosition.y,
            this.drawingService.canvas.width - this.finalPosition.x,
            this.drawingService.canvas.height - this.finalPosition.y,
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
        this.canMoveSelection = true;
    }

    copyMagicSelection(selectionPixelPosition: Vec2): void {
        const pixelColor = this.drawingService.baseCtx.getImageData(selectionPixelPosition.x, selectionPixelPosition.y, 1, 1).data;
        const selectionCtx = this.drawingService.previewCtx;
        this.startingPosition = { x: this.drawingService.canvas.width, y: this.drawingService.canvas.height } as Vec2;
        const selectionSize = { x: 0, y: 0 } as Vec2;

        this.imgData = this.drawingService.baseCtx.getImageData(0, 0, this.drawingService.canvas.width, this.drawingService.canvas.height);
        const areaToClear = this.drawingService.baseCtx.getImageData(0, 0, this.drawingService.canvas.width, this.drawingService.canvas.height);

        let y = 0;
        for (let i = 0; i < this.imgData.data.length; i += CONSTANTS.IMAGE_DATA_OPACITY_INDEX + 1) {
            const x = (i / (CONSTANTS.IMAGE_DATA_OPACITY_INDEX + 1)) % this.imgData.width;
            if (x === 0) y++;
            const pixelToCheckData = [
                this.imgData.data[i],
                this.imgData.data[i + 1],
                this.imgData.data[i + 2],
                this.imgData.data[i + CONSTANTS.IMAGE_DATA_OPACITY_INDEX],
            ];
            const pixelToCheck = new Uint8ClampedArray(pixelToCheckData);
            if (this.isColorMatchingStartingColor(pixelToCheck, pixelColor)) {
                this.startingPosition.x = Math.min(this.startingPosition.x, x);
                this.startingPosition.y = Math.min(this.startingPosition.y, y);
                selectionSize.x = Math.max(selectionSize.x, x - this.startingPosition.x);
                selectionSize.y = Math.max(selectionSize.y, y - this.startingPosition.y);
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
            } else {
                this.imgData.data[i] = 0;
                this.imgData.data[i + 1] = 0;
                this.imgData.data[i + 2] = 0;
                this.imgData.data[i + CONSTANTS.IMAGE_DATA_OPACITY_INDEX] = 0;
                continue;
            }
        }
        selectionCtx.putImageData(this.imgData, 0, 0, 0, 0, this.imgData.width, this.imgData.height);
        this.imgData = selectionCtx.getImageData(this.startingPosition.x, this.startingPosition.y, selectionSize.x, selectionSize.y);
        selectionCtx.canvas.width = selectionSize.x;
        selectionCtx.canvas.height = selectionSize.y;
        selectionCtx.canvas.style.left = this.startingPosition.x + 'px';
        selectionCtx.canvas.style.top = this.startingPosition.y + 'px';
        selectionCtx.putImageData(this.imgData, 0, 0, 0, 0, this.imgData.width, this.imgData.height);
        this.drawingService.baseCtx.putImageData(areaToClear, 0, 0);
        selectionCtx.canvas.style.cursor = 'move';
        this.canMoveSelection = true;
        this.finalPosition = { x: this.startingPosition.x, y: this.startingPosition.y };
    }

    private isPositionInEllipse(position: Vec2, width: number, height: number): boolean {
        return Math.pow(position.x - width / 2, 2) / Math.pow(width / 2, 2) + Math.pow(position.y - height / 2, 2) / Math.pow(height / 2, 2) <= 1;
    }

    private isColorMatchingStartingColor(pixelToCheck: Uint8ClampedArray, startingColor: Uint8ClampedArray): boolean {
        // checking white and transparent color
        if (
            (pixelToCheck[0] === CONSTANTS.MAX_COLOR_VALUE &&
                pixelToCheck[1] === CONSTANTS.MAX_COLOR_VALUE &&
                pixelToCheck[2] === CONSTANTS.MAX_COLOR_VALUE &&
                pixelToCheck[CONSTANTS.IMAGE_DATA_OPACITY_INDEX] === CONSTANTS.MAX_COLOR_VALUE &&
                startingColor[CONSTANTS.IMAGE_DATA_OPACITY_INDEX] === 0) ||
            (startingColor[0] === CONSTANTS.MAX_COLOR_VALUE &&
                startingColor[1] === CONSTANTS.MAX_COLOR_VALUE &&
                startingColor[2] === CONSTANTS.MAX_COLOR_VALUE &&
                startingColor[CONSTANTS.IMAGE_DATA_OPACITY_INDEX] === CONSTANTS.MAX_COLOR_VALUE &&
                pixelToCheck[CONSTANTS.IMAGE_DATA_OPACITY_INDEX] === 0)
        ) {
            return true;
        }
        return (
            pixelToCheck[0] === startingColor[0] &&
            pixelToCheck[1] === startingColor[1] &&
            pixelToCheck[2] === startingColor[2] &&
            pixelToCheck[CONSTANTS.IMAGE_DATA_OPACITY_INDEX] === startingColor[CONSTANTS.IMAGE_DATA_OPACITY_INDEX]
        );
    }
}
