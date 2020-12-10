import { Injectable } from '@angular/core';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class TextActionKeysService {
    actionKeys: Map<string, (cursorColumnIndex: number, cursorRowIndex: number, currentTexts: string[]) => [number, number, string[]]> = new Map<
        string,
        (cursorColumnIndex: number, cursorRowIndex: number, currentTexts: string[]) => [number, number, string[]]
    >();
    constructor(private drawingService: DrawingService) {
        this.actionKeys.set('Backspace', this.onBackspace.bind(this));
        this.actionKeys.set('Delete', this.onDelete.bind(this));
        this.actionKeys.set('ArrowLeft', this.onArrowLeft.bind(this));
        this.actionKeys.set('ArrowRight', this.onArrowRight.bind(this));
        this.actionKeys.set('ArrowUp', this.onArrowUp.bind(this));
        this.actionKeys.set('ArrowDown', this.onArrowDown.bind(this));
        this.actionKeys.set('Enter', this.onEnter.bind(this));
    }

    onBackspace(cursorColumnIndex: number, cursorRowIndex: number, currentTexts: string[]): [number, number, string[]] {
        if (cursorColumnIndex !== 0) {
            currentTexts[cursorRowIndex] =
                currentTexts[cursorRowIndex].substring(0, cursorColumnIndex - 1) + currentTexts[cursorRowIndex].substring(cursorColumnIndex);
            cursorColumnIndex -= 1;
        } else if (cursorRowIndex !== 0) {
            const textRightOfCursor = currentTexts[cursorRowIndex];
            currentTexts.splice(cursorRowIndex, 1);
            cursorRowIndex -= 1;
            cursorColumnIndex = currentTexts[cursorRowIndex].length;
            if (textRightOfCursor.length > 0) currentTexts[cursorRowIndex] += textRightOfCursor;
        }
        return [cursorColumnIndex, cursorRowIndex, currentTexts];
    }

    onDelete(cursorColumnIndex: number, cursorRowIndex: number, currentTexts: string[]): [number, number, string[]] {
        if (cursorColumnIndex !== currentTexts[cursorRowIndex].length) {
            currentTexts[cursorRowIndex] =
                currentTexts[cursorRowIndex].substring(0, cursorColumnIndex) + currentTexts[cursorRowIndex].substring(cursorColumnIndex + 1);
        } else if (cursorRowIndex !== currentTexts.length - 1) {
            const textFromNextLine = currentTexts[cursorRowIndex + 1];
            currentTexts.splice(cursorRowIndex + 1, 1);
            cursorColumnIndex = currentTexts[cursorRowIndex].length;
            if (textFromNextLine.length > 0) currentTexts[cursorRowIndex] += textFromNextLine;
        }
        return [cursorColumnIndex, cursorRowIndex, currentTexts];
    }

    onArrowLeft(cursorColumnIndex: number, cursorRowIndex: number, currentTexts: string[]): [number, number, string[]] {
        if (cursorColumnIndex === 0 && cursorRowIndex !== 0) {
            cursorRowIndex -= 1;
            cursorColumnIndex = currentTexts[cursorRowIndex].length;
        } else if (cursorColumnIndex !== 0) {
            cursorColumnIndex -= 1;
        }
        return [cursorColumnIndex, cursorRowIndex, currentTexts];
    }

    onArrowRight(cursorColumnIndex: number, cursorRowIndex: number, currentTexts: string[]): [number, number, string[]] {
        if (cursorColumnIndex === currentTexts[cursorRowIndex].length && cursorRowIndex !== currentTexts.length - 1) {
            cursorRowIndex += 1;
            cursorColumnIndex = 0;
        } else if (cursorColumnIndex !== currentTexts[cursorRowIndex].length) {
            cursorColumnIndex += 1;
        }
        return [cursorColumnIndex, cursorRowIndex, currentTexts];
    }

    onArrowUp(cursorColumnIndex: number, cursorRowIndex: number, currentTexts: string[]): [number, number, string[]] {
        if (cursorRowIndex !== 0) {
            cursorColumnIndex = this.calculateColumnIndex(true, cursorColumnIndex, cursorRowIndex, currentTexts);
            cursorRowIndex = cursorRowIndex - 1;
        }
        return [cursorColumnIndex, cursorRowIndex, currentTexts];
    }

    onArrowDown(cursorColumnIndex: number, cursorRowIndex: number, currentTexts: string[]): [number, number, string[]] {
        if (cursorRowIndex !== currentTexts.length - 1) {
            cursorColumnIndex = this.calculateColumnIndex(false, cursorColumnIndex, cursorRowIndex, currentTexts);
            cursorRowIndex = cursorRowIndex + 1;
        }
        return [cursorColumnIndex, cursorRowIndex, currentTexts];
    }

    calculateColumnIndex(isArrowUp: boolean, cursorColumnIndex: number, cursorRowIndex: number, currentTexts: string[]): number {
        const currentLineTextWidth = this.drawingService.previewCtx.measureText(currentTexts[cursorRowIndex].substring(0, cursorColumnIndex)).width;
        const textIndex = isArrowUp ? cursorRowIndex - 1 : cursorRowIndex + 1;

        for (let i = 0; i < currentTexts[textIndex].length; ++i) {
            const charactersTextWidth = this.drawingService.previewCtx.measureText(currentTexts[textIndex].substring(0, i)).width;

            if (charactersTextWidth > currentLineTextWidth) {
                const previousCharactersTextWidth = this.drawingService.previewCtx.measureText(currentTexts[textIndex].substring(0, i - 1)).width;
                return currentLineTextWidth - previousCharactersTextWidth > charactersTextWidth - currentLineTextWidth ? i : i - 1;
            }
        }
        return currentTexts[textIndex].length;
    }

    onEnter(cursorColumnIndex: number, cursorRowIndex: number, currentTexts: string[]): [number, number, string[]] {
        const textRightOfCursor = currentTexts[cursorRowIndex].substring(cursorColumnIndex);

        const isTextWithLineJump = textRightOfCursor.length !== 0;

        currentTexts[cursorRowIndex] = currentTexts[cursorRowIndex].substring(0, cursorColumnIndex);

        cursorRowIndex += 1;

        currentTexts.splice(cursorRowIndex, 0, isTextWithLineJump ? textRightOfCursor : '');

        cursorColumnIndex = 0;
        return [cursorColumnIndex, cursorRowIndex, currentTexts];
    }
}
