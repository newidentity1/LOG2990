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
    isMagnet: boolean = false;
    imgData: ImageData;
    canMoveSelection: boolean = false;
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
        this.redraw();
    }

    moveSelectionMagnetic(moveX: number, moveY: number): void {
        this.finalPosition.x = moveX;
        this.finalPosition.y = moveY;

        this.drawingService.previewCtx.canvas.style.left = this.finalPosition.x + 'px';
        this.drawingService.previewCtx.canvas.style.top = this.finalPosition.y + 'px';
        this.redraw();
    }

    private redraw(): void {
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

        for (let i = 0; i < this.imgData.data.length; i += CONSTANTS.IMAGE_DATA_OPACITY_INDEX + 1) {
            if (currentType === SelectionType.EllipseSelection) {
                const x = (i / (CONSTANTS.IMAGE_DATA_OPACITY_INDEX + 1)) % this.imgData.width;
                const y = Math.floor(i / (CONSTANTS.IMAGE_DATA_OPACITY_INDEX + 1) / this.imgData.width);

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

    setFinalPosition(position: Vec2): void {
        this.finalPosition = {
            x: position.x,
            y: position.y,
        };
    }

    private isPositionInEllipse(position: Vec2, width: number, height: number): boolean {
        return Math.pow(position.x - width / 2, 2) / Math.pow(width / 2, 2) + Math.pow(position.y - height / 2, 2) / Math.pow(height / 2, 2) <= 1;
    }
}
