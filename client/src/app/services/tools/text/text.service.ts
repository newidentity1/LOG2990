import { Injectable } from '@angular/core';
import { Color } from '@app/classes/color/color';
import { Tool } from '@app/classes/tool/tool';
import { TextProperties } from '@app/classes/tools-properties/text-properties';
import { Vec2 } from '@app/classes/vec2';
import { DASHED_SEGMENTS } from '@app/constants/constants';
import { MouseButton } from '@app/enums/mouse-button.enum';
import { TextAlignment } from '@app/enums/text-alignment.enum';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ShortcutService } from '@app/services/shortcut/shortcut.service';
import { TextActionKeysService } from './text-action-keys/text-action-keys.service';

@Injectable({
    providedIn: 'root',
})
export class TextService extends Tool {
    private currentTexts: string[] = [''];
    private textConfirmed: boolean = false;
    private isInitialText: boolean = true;
    private currentStyle: string = '';
    private textAreaDimensions: Vec2 = { x: 0, y: 0 };
    private textAreaStartingPoint: Vec2 = { x: 0, y: 0 };
    private cursorIntervalRef: number;
    private cursorColumnIndex: number = 0;
    private cursorRowIndex: number = 0;

    constructor(drawingService: DrawingService, private shortcutService: ShortcutService, private textActionKeysService: TextActionKeysService) {
        super(drawingService);
        this.name = 'Text';
        this.tooltip = 'Texte(t)';
        this.iconName = 'title';
        this.toolProperties = new TextProperties();
        this.textActionKeysService.actionKeys.set('Escape', this.onEscape.bind(this));
    }

    onEscape(): [number, number, string[]] {
        this.mouseDown = false;
        this.shortcutService.disableShortcuts = false;
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        clearInterval(this.cursorIntervalRef);
        this.isInitialText = true;
        this.cursorColumnIndex = 0;
        this.cursorRowIndex = 0;
        this.currentTexts = [''];
        return [this.cursorColumnIndex, this.cursorRowIndex, this.currentTexts];
    }

    onKeyDown(event: KeyboardEvent): void {
        if (this.mouseDown) {
            const action = this.textActionKeysService.actionKeys.get(event.key);

            if (action !== undefined) {
                [this.cursorColumnIndex, this.cursorRowIndex, this.currentTexts] = action(
                    this.cursorColumnIndex,
                    this.cursorRowIndex,
                    this.currentTexts,
                );
                this.writeText(this.drawingService.previewCtx);
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

    writeText(context: CanvasRenderingContext2D, callCursor: boolean = true): void {
        if (!this.mouseDown) return;
        const properties = this.toolProperties as TextProperties;
        this.createStyle(properties);
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.writeTexts(context);

        if (context === this.drawingService.previewCtx) {
            if (callCursor) this.setCursor();
            this.drawTextArea();
        }
    }

    isTextInProgress(): boolean {
        return this.mouseDown && !this.textConfirmed && !this.isInitialText;
    }

    writeTexts(context: CanvasRenderingContext2D): void {
        for (let i = 0; i < this.currentTexts.length; ++i) {
            context.fillText(this.currentTexts[i], this.calculateXCoordText(), this.mouseDownCoord.y - this.textAreaDimensions.y * i);
        }
    }

    confirmText(): void {
        this.writeText(this.drawingService.baseCtx);
        clearInterval(this.cursorIntervalRef);
        this.executedCommand.emit(this.clone());
        this.textConfirmed = true;
        this.mouseDown = false;
        this.shortcutService.disableShortcuts = false;
        this.currentTexts = [''];
        this.cursorRowIndex = 0;
        this.cursorColumnIndex = 0;
    }

    drawTextArea(): void {
        const HEIGHT_FACTOR = 5;
        const SPACE = 10;
        const context = this.drawingService.previewCtx;
        const properties = this.toolProperties as TextProperties;

        const dimensions = this.calculateLongestWidth();
        this.textAreaDimensions = { x: dimensions + SPACE, y: -properties.size + 2 };
        this.textAreaStartingPoint = { x: this.mouseDownCoord.x - 2, y: this.mouseDownCoord.y + properties.size / HEIGHT_FACTOR };

        context.setLineDash([DASHED_SEGMENTS]);
        context.lineWidth = 1;
        context.strokeRect(
            this.textAreaStartingPoint.x - SPACE / 2,
            this.textAreaStartingPoint.y - this.textAreaDimensions.y * (this.currentTexts.length - 1) + SPACE / 2,
            this.textAreaDimensions.x + SPACE / 2,
            this.textAreaDimensions.y * this.currentTexts.length - SPACE,
        );
        context.setLineDash([]);
    }

    setCursor(): void {
        const BLINKING_CURSOR_SPEED = 500;
        if (this.cursorIntervalRef) clearInterval(this.cursorIntervalRef);

        this.cursorIntervalRef = window.setInterval(this.drawCursor.bind(this), BLINKING_CURSOR_SPEED);
    }

    drawCursor(): void {
        const HEIGHT_FACTOR = 5;
        const BLINKING_CURSOR_SPEED = 800;
        const context = this.drawingService.previewCtx;

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
            this.writeText(this.drawingService.previewCtx, false);
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

    private rewriteText(): void {
        if (this.isTextInProgress()) this.writeText(this.drawingService.previewCtx);
    }

    setFontText(value: string): void {
        const testProperties = this.toolProperties as TextProperties;
        if (testProperties.fonts.includes(value)) {
            testProperties.font = value;
        }
        this.rewriteText();
    }

    setTextAlignment(value: string): void {
        const testProperties = this.toolProperties as TextProperties;
        if (testProperties.textAlignments.includes(value)) {
            testProperties.textAlignment = value;
        }
        this.rewriteText();
    }

    setSizeText(value: number | null): void {
        const testProperties = this.toolProperties as TextProperties;
        value = value === null ? 1 : value;
        testProperties.size = value;
        this.drawingService.setThickness(value);
        this.rewriteText();
    }

    setBold(value: boolean): void {
        const testProperties = this.toolProperties as TextProperties;
        testProperties.isBold = value;
        this.rewriteText();
    }

    setItalic(value: boolean): void {
        const testProperties = this.toolProperties as TextProperties;
        testProperties.isItalic = value;
        this.rewriteText();
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

    setColors(primaryColor: Color, secondaryColor: Color): void {
        super.setColors(primaryColor, secondaryColor);
        this.rewriteText();
    }

    applyCurrentSettings(): void {
        super.applyCurrentSettings();
        const properties = this.toolProperties as TextProperties;
        this.setFontText(properties.font);
        this.setItalic(properties.isItalic);
        this.setBold(properties.isBold);
        this.setSizeText(properties.size);
        this.setTextAlignment(properties.textAlignment);
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
    }

    execute(): void {
        this.writeText(this.drawingService.baseCtx);
    }

    copyTool(tool: Tool): void {
        super.copyTool(tool);
        const cloneProperties = tool.toolProperties as TextProperties;
        const properties = this.toolProperties as TextProperties;
        cloneProperties.font = properties.font;
        cloneProperties.isBold = properties.isBold;
        cloneProperties.isItalic = properties.isItalic;
        cloneProperties.size = properties.size;
        cloneProperties.textAlignment = properties.textAlignment;
        const cloneTool = tool as TextService;
        cloneTool.currentTexts = this.currentTexts;
        cloneTool.textAreaDimensions = this.textAreaDimensions;
        cloneTool.textAreaStartingPoint = this.textAreaStartingPoint;
        cloneTool.mouseDown = this.mouseDown;
    }

    clone(): Tool {
        const textServiceClone = new TextService(this.drawingService, this.shortcutService, this.textActionKeysService);
        this.copyTool(textServiceClone);
        return textServiceClone;
    }
}
