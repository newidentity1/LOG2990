import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool/tool';
import { TextProperties } from '@app/classes/tools-properties/text-properties';
import { Vec2 } from '@app/classes/vec2';
import { DASHED_SEGMENTS } from '@app/constants/constants';
import { MouseButton } from '@app/enums/mouse-button.enum';
import { TextAlignment } from '@app/enums/text-alignment.enum';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ShortcutService } from '@app/services/shortcut/shortcut.service';

@Injectable({
    providedIn: 'root',
})
export class TextService extends Tool {
    currentTexts: string[] = [''];
    textConfirmed: boolean = false;
    isInitialText: boolean = true;
    currentStyle: string = '';
    actionKeys: Map<string, () => void> = new Map<string, () => void>();
    textAreaDimensions: Vec2 = { x: 0, y: 0 };
    textAreaStartingPoint: Vec2 = { x: 0, y: 0 };
    cursorPosition: Vec2 = { x: 0, y: 0 };
    cursorIntervalRef: number;
    cursorColumnIndex: number = 0;
    cursorRowIndex: number = 0;

    constructor(drawingService: DrawingService, private shortcutService: ShortcutService) {
        super(drawingService);
        this.name = 'Text';
        this.tooltip = 'Texte(t)';
        this.iconName = 'title';
        this.toolProperties = new TextProperties();
        this.actionKeys.set('Backspace', this.onBackspace.bind(this));
        this.actionKeys.set('Delete', this.onDelete.bind(this));
        this.actionKeys.set('Escape', this.onEscape.bind(this));
        this.actionKeys.set('ArrowLeft', this.onArrowLeft.bind(this));
        this.actionKeys.set('ArrowRight', this.onArrowRight.bind(this));
        this.actionKeys.set('ArrowUp', this.onArrowUp.bind(this));
        this.actionKeys.set('ArrowDown', this.onArrowDown.bind(this));
        this.actionKeys.set('Enter', this.onEnter.bind(this));
    }

    onBackspace(): void {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        if (this.cursorColumnIndex !== 0) {
            this.currentTexts[this.cursorRowIndex] =
                this.currentTexts[this.cursorRowIndex].substring(0, this.cursorColumnIndex - 1) +
                this.currentTexts[this.cursorRowIndex].substring(this.cursorColumnIndex);
            this.cursorColumnIndex -= 1;
        }
        this.writeText(this.drawingService.previewCtx);
    }

    onDelete(): void {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        if (this.cursorColumnIndex !== this.currentTexts[this.cursorRowIndex].length) {
            this.currentTexts[this.cursorRowIndex] =
                this.currentTexts[this.cursorRowIndex].substring(0, this.cursorColumnIndex) +
                this.currentTexts[this.cursorRowIndex].substring(this.cursorColumnIndex + 1);
        }
        this.writeText(this.drawingService.previewCtx);
    }

    onEscape(): void {
        this.mouseDown = false;
        this.shortcutService.disableShortcuts = false;
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        clearInterval(this.cursorIntervalRef);
        this.isInitialText = true;
        this.currentTexts = [''];
        this.cursorRowIndex = 0;
        this.cursorColumnIndex = 0;
    }

    onArrowLeft(): void {
        this.cursorColumnIndex = this.cursorColumnIndex === 0 ? this.cursorColumnIndex : this.cursorColumnIndex - 1;
        this.setCursor();
    }

    onArrowRight(): void {
        this.cursorColumnIndex =
            this.cursorColumnIndex === this.currentTexts[this.cursorRowIndex].length ? this.cursorColumnIndex : this.cursorColumnIndex + 1;
        this.setCursor();
    }

    onArrowUp(): void {
        this.cursorRowIndex = this.cursorRowIndex === 0 ? this.cursorRowIndex : this.cursorRowIndex - 1;
        this.setCursor();
    }

    onArrowDown(): void {
        this.cursorRowIndex = this.cursorRowIndex === this.currentTexts.length ? this.cursorRowIndex : this.cursorRowIndex + 1;
        this.setCursor();
    }

    onEnter(): void {
        const textRightOfCursor = this.currentTexts[this.cursorRowIndex].substring(this.cursorColumnIndex);

        const isTextWithLineJump = textRightOfCursor.length !== 0;

        this.currentTexts[this.cursorRowIndex] = this.currentTexts[this.cursorRowIndex].substring(0, this.cursorColumnIndex);

        this.cursorRowIndex += 1;

        this.currentTexts.splice(this.cursorRowIndex, 0, isTextWithLineJump ? textRightOfCursor : '');

        this.cursorColumnIndex = 0;

        this.writeText(this.drawingService.previewCtx);
    }

    onKeyDown(event: KeyboardEvent): void {
        if (this.mouseDown) {
            const action = this.actionKeys.get(event.key);

            if (action !== undefined) {
                action();
            } else if (event.key.length === 1) {
                this.currentTexts[this.cursorRowIndex] =
                    this.currentTexts[this.cursorRowIndex].substring(0, this.cursorColumnIndex) +
                    event.key +
                    this.currentTexts[this.cursorRowIndex].substring(this.cursorColumnIndex);
                this.cursorColumnIndex += 1;
                this.writeText(this.drawingService.previewCtx);
            }
        }
    }

    onClick(event: MouseEvent): void {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.mouseDown = event.button === MouseButton.Left;
        const isInsideTextArea = this.isClickInsideTextArea(event);

        if (this.isTextInProgress() && !isInsideTextArea) {
            this.confirmText();
        } else if (this.mouseDown) {
            this.shortcutService.disableShortcuts = true;
            if (!isInsideTextArea) {
                for (let i = 0; i < this.currentTexts.length; ++i) {
                    this.currentTexts[i] = '';
                }
                this.mouseDownCoord = this.getPositionFromMouse(event);
            }
            this.textConfirmed = false;
            this.writeText(this.drawingService.previewCtx);
        }

        if (this.isInitialText) this.isInitialText = false;
    }

    writeText(context: CanvasRenderingContext2D): void {
        const properties = this.toolProperties as TextProperties;
        this.createStyle(properties);
        if (context === this.drawingService.previewCtx) {
            this.drawTextArea();
            this.setCursor();
        }

        for (let i = 0; i < this.currentTexts.length; ++i) {
            context.fillText(this.currentTexts[i], this.calculateXCoordText(), this.mouseDownCoord.y - this.textAreaDimensions.y * i);
        }
    }

    isTextInProgress(): boolean {
        return this.mouseDown && !this.textConfirmed && !this.isInitialText;
    }

    confirmText(): void {
        this.writeText(this.drawingService.baseCtx);
        this.textConfirmed = true;
        this.mouseDown = false;
        this.shortcutService.disableShortcuts = false;
        clearInterval(this.cursorIntervalRef);
        this.currentTexts = [''];
        this.cursorRowIndex = 0;
        this.cursorColumnIndex = 0;
    }

    drawTextArea(): void {
        const HEIGHT_FACTOR = 5;
        const CURSOR_WIDTH = 5;
        const context = this.drawingService.previewCtx;
        const properties = this.toolProperties as TextProperties;

        const dimensions = this.calculateLongestWidth();
        this.textAreaDimensions = { x: dimensions + CURSOR_WIDTH, y: -properties.size + 2 };
        this.textAreaStartingPoint = { x: this.mouseDownCoord.x - 2, y: this.mouseDownCoord.y + properties.size / HEIGHT_FACTOR };

        this.drawingService.clearCanvas(context);

        context.setLineDash([DASHED_SEGMENTS]);
        context.lineWidth = 1;
        context.strokeRect(
            this.textAreaStartingPoint.x,
            this.textAreaStartingPoint.y - this.textAreaDimensions.y * (this.currentTexts.length - 1),
            this.textAreaDimensions.x,
            this.textAreaDimensions.y * this.currentTexts.length,
        );
        context.setLineDash([]);
    }

    setCursor(): void {
        const BLINKING_CURSOR_SPEED = 1200;
        if (this.cursorIntervalRef) clearInterval(this.cursorIntervalRef);

        this.cursorIntervalRef = window.setInterval(this.drawCursor.bind(this), BLINKING_CURSOR_SPEED);
    }

    drawCursor(): void {
        const HEIGHT_FACTOR = 5;
        const BLINKING_CURSOR_SPEED = 800;
        const context = this.drawingService.previewCtx;

        context.fillStyle = '#000000';
        context.lineWidth = 1;

        const cursorX = Math.round(this.calculateXCoordCursor());
        const cursorY = Math.round(
            this.mouseDownCoord.y - this.textAreaDimensions.y / HEIGHT_FACTOR - this.textAreaDimensions.y * this.cursorRowIndex,
        );
        const cursorWidth = 2;
        const cursorHeight = Math.round(this.textAreaDimensions.y);

        context.fillRect(cursorX, cursorY, cursorWidth, cursorHeight);

        setTimeout(() => {
            context.clearRect(cursorX, cursorY, cursorWidth, cursorHeight);
        }, BLINKING_CURSOR_SPEED);
    }

    calculateXCoordText(): number {
        const properties = this.toolProperties as TextProperties;
        let x = 0;
        switch (properties.textAlignment) {
            case TextAlignment.Left:
                x = this.mouseDownCoord.x;
                break;
            case TextAlignment.Middle:
                x = this.mouseDownCoord.x + this.calculateLongestWidth() / 2;
                break;
            case TextAlignment.Right:
                x = this.mouseDownCoord.x + this.calculateLongestWidth();
                break;
        }
        return x;
    }

    calculateXCoordCursor(): number {
        const properties = this.toolProperties as TextProperties;
        const context = this.drawingService.previewCtx;
        let cursorTextWidth = 0;
        let x = 0;
        switch (properties.textAlignment) {
            case TextAlignment.Left:
                cursorTextWidth = context.measureText(this.currentTexts[this.cursorRowIndex].substring(0, this.cursorColumnIndex)).width;
                x = this.mouseDownCoord.x + cursorTextWidth;
                break;
            case TextAlignment.Middle:
                const textWidth = context.measureText(this.currentTexts[this.cursorRowIndex]).width;
                cursorTextWidth = context.measureText(this.currentTexts[this.cursorRowIndex].substring(0, this.cursorColumnIndex)).width;
                x = this.calculateXCoordText() - textWidth / 2 + cursorTextWidth;
                break;
            case TextAlignment.Right:
                const endPosition = this.currentTexts[this.cursorRowIndex].length;
                const positionFromEnd = endPosition - this.cursorColumnIndex;

                cursorTextWidth = context.measureText(this.currentTexts[this.cursorRowIndex].substring(endPosition - positionFromEnd, endPosition))
                    .width;
                x = this.mouseDownCoord.x + this.calculateLongestWidth() - cursorTextWidth;
                break;
        }
        return x;
    }

    calculateLongestWidth(): number {
        const context = this.drawingService.previewCtx;
        let longestWidth = context.measureText(this.currentTexts[0]).width;
        let textWidth = 0;
        for (const text of this.currentTexts) {
            textWidth = context.measureText(text).width;
            longestWidth = longestWidth < textWidth ? textWidth : longestWidth;
        }
        return longestWidth;
    }

    isClickInsideTextArea(event: MouseEvent): boolean {
        const isXInsideTextArea =
            event.offsetX >= this.textAreaStartingPoint.x && event.offsetX <= this.textAreaStartingPoint.x + this.textAreaDimensions.x;

        const isYInsideTextArea =
            event.offsetY >= this.textAreaStartingPoint.y + this.textAreaDimensions.y &&
            event.offsetY <= this.textAreaStartingPoint.y - this.textAreaDimensions.y * this.currentTexts.length;

        return isXInsideTextArea && isYInsideTextArea;
    }

    setFontText(value: string): void {
        const testProperties = this.toolProperties as TextProperties;
        if (testProperties.fonts.includes(value)) {
            testProperties.font = value;
        }
        this.writeText(this.drawingService.previewCtx);
    }

    setTextAlignment(value: string): void {
        const testProperties = this.toolProperties as TextProperties;
        if (testProperties.textAlignments.includes(value)) {
            testProperties.textAlignment = value;
        }
        this.writeText(this.drawingService.previewCtx);
    }

    setSizeText(value: number | null): void {
        const testProperties = this.toolProperties as TextProperties;
        value = value === null ? 1 : value;
        testProperties.size = value;
        this.drawingService.setThickness(value);
        this.writeText(this.drawingService.previewCtx);
    }

    setBold(value: boolean): void {
        const testProperties = this.toolProperties as TextProperties;
        testProperties.isBold = value;
        this.writeText(this.drawingService.previewCtx);
    }

    setItalic(value: boolean): void {
        const testProperties = this.toolProperties as TextProperties;
        testProperties.isItalic = value;
        this.writeText(this.drawingService.previewCtx);
    }

    createStyle(textProperties: TextProperties): void {
        this.currentStyle = '';
        this.currentStyle += textProperties.isItalic ? 'italic ' : ' ';
        this.currentStyle += textProperties.isBold ? 'bold ' : ' ';
        this.currentStyle += textProperties.size + 'px ';
        this.currentStyle += textProperties.font;
        this.drawingService.setTextStyle(this.currentStyle);
        this.drawingService.setTextAlignment(textProperties.textAlignment);
    }
}
