import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool/tool';
import { TextProperties } from '@app/classes/tools-properties/text-properties';
import { MouseButton } from '@app/enums/mouse-button.enum';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { WritingTextService } from '@app/services/tools/text/writing-text/writing-text.service';

@Injectable({
    providedIn: 'root',
})
export class TextService extends Tool {
    currentText: string = '';
    confirmText: boolean = false;
    initialText: boolean = true;
    currentStyle: string = '';

    constructor(drawingService: DrawingService, private writingTextService: WritingTextService) {
        super(drawingService);
        this.name = 'Text';
        this.tooltip = 'Texte(t)';
        this.iconName = 'title';
        this.toolProperties = new TextProperties();
        this.createStyle(this.toolProperties as TextProperties);
    }

    onKeyDown(event: KeyboardEvent): void {
        if (this.mouseDown) {
            if (event.key.length > 1 && event.key !== 'Backspace') return;
            const context = this.drawingService.previewCtx;
            if (event.key === 'Backspace') {
                this.drawingService.clearCanvas(context);
                this.currentText = this.currentText.substring(0, this.currentText.length - 1);
            } else {
                this.currentText += event.key;
            }
            this.writeText(context);
        }
    }

    onClick(event: MouseEvent): void {
        const previewContext = this.drawingService.previewCtx;
        this.drawingService.clearCanvas(previewContext);
        if (this.currentText.length > 0) this.writeText(this.drawingService.baseCtx);
        this.mouseDown = event.button === MouseButton.Left;
        if (this.mouseDown && !this.confirmText && !this.initialText) {
            this.confirmText = true;
            this.mouseDown = false;
            this.writingTextService.removeWritingTextMode();
        } else if (this.mouseDown) {
            this.writingTextService.writingTextMode(this);
            this.confirmText = false;
            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.currentText = '';
        }
        if (this.initialText) this.initialText = false;
    }

    writeText(context: CanvasRenderingContext2D): void {
        context.fillText(this.currentText, this.mouseDownCoord.x, this.mouseDownCoord.y);
    }

    setFontText(value: string): void {
        const testProperties = this.toolProperties as TextProperties;
        if (testProperties.fonts.includes(value)) {
            testProperties.font = value;
        }
    }

    setTextAlignment(value: string): void {
        const testProperties = this.toolProperties as TextProperties;
        if (testProperties.textAlignments.includes(value)) {
            testProperties.textAlignment = value;
        }
    }

    setSizeText(value: number | null): void {
        const testProperties = this.toolProperties as TextProperties;
        value = value === null ? 1 : value;
        testProperties.size = value;
        this.drawingService.setThickness(value);
    }

    setBold(value: boolean): void {
        const testProperties = this.toolProperties as TextProperties;
        testProperties.isBold = value;
    }

    setItalic(value: boolean): void {
        const testProperties = this.toolProperties as TextProperties;
        testProperties.isItalic = value;
    }

    createStyle(textProperties: TextProperties) {
        this.currentStyle += textProperties.isItalic ? 'italic' : '';
        this.currentStyle += textProperties.isBold ? 'bold' : '';
        this.currentStyle += textProperties.size + 'px';
        this.currentStyle += textProperties.font;
        this.drawingService.setTextStyle(this.currentStyle);
    }
}
