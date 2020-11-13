import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool/tool';
import { TextProperties } from '@app/classes/tools-properties/text-properties';
import { Vec2 } from '@app/classes/vec2';
import { DASHED_SEGMENTS } from '@app/constants/constants';
import { MouseButton } from '@app/enums/mouse-button.enum';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ShortcutService } from '@app/services/shortcut/shortcut.service';

@Injectable({
    providedIn: 'root',
})
export class TextService extends Tool {
    currentText: string = '';
    confirmText: boolean = false;
    initialText: boolean = true;
    currentStyle: string = '';
    cursorPosition: Vec2 = { x: 0, y: 0 };
    cursorIntervalRef: number;
    actionKeys: Map<string, () => void> = new Map<string, () => void>();

    constructor(drawingService: DrawingService, private shortcutService: ShortcutService) {
        super(drawingService);
        this.name = 'Text';
        this.tooltip = 'Texte(t)';
        this.iconName = 'title';
        this.toolProperties = new TextProperties();
        this.actionKeys.set('Backspace', this.onBackspace.bind(this));
    }

    onBackspace(): void {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.currentText = this.currentText.substring(0, this.currentText.length - 1);
    }

    onKeyDown(event: KeyboardEvent): void {
        if (this.mouseDown) {
            const isAction = this.actionKeys.get(event.key) !== undefined;

            if (event.key.length > 1 && !isAction) return;

            if (isAction) {
                const actionFunction = this.actionKeys.get(event.key);
                if (actionFunction) actionFunction();
            } else {
                this.currentText += event.key;
            }

            this.writeText(this.drawingService.previewCtx);
        }
    }

    onClick(event: MouseEvent): void {
        const previewContext = this.drawingService.previewCtx;
        this.drawingService.clearCanvas(previewContext);
        this.mouseDown = event.button === MouseButton.Left;

        if (this.mouseDown && !this.confirmText && !this.initialText) {
            this.writeText(this.drawingService.baseCtx);
            this.confirmText = true;
            this.mouseDown = false;
            this.shortcutService.disableShortcuts = false;
            clearInterval(this.cursorIntervalRef);
        } else if (this.mouseDown) {
            this.shortcutService.disableShortcuts = true;
            this.writeText(this.drawingService.previewCtx);
            this.confirmText = false;
            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.currentText = '';
        }

        if (this.initialText) this.initialText = false;
    }

    writeText(context: CanvasRenderingContext2D): void {
        const properties = this.toolProperties as TextProperties;
        this.createStyle(properties);
        if (context === this.drawingService.previewCtx) {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);

            const dimensions = context.measureText(this.currentText);
            context.setLineDash([DASHED_SEGMENTS]);
            context.lineWidth = 1;
            context.strokeRect(this.mouseDownCoord.x, this.mouseDownCoord.y + properties.size / 5, dimensions.width + 2, -properties.size);
            if (this.cursorIntervalRef) {
                clearInterval(this.cursorIntervalRef);
            }
            this.cursorIntervalRef = setInterval(this.drawCursor.bind(this), 1200, dimensions.width, -properties.size);

            context.setLineDash([]);
        }
        context.fillText(this.currentText, this.mouseDownCoord.x, this.mouseDownCoord.y);
    }

    drawCursor(width: number, height: number): void {
        const context = this.drawingService.previewCtx;
        context.strokeStyle = '#000000';
        context.strokeRect(this.mouseDownCoord.x + width, this.mouseDownCoord.y - height / 5, 1, height);
        setTimeout(() => {
            context.clearRect(this.mouseDownCoord.x + width, this.mouseDownCoord.y - height / 5, 2, height + 1);
        }, 1000);
    }

    setFontText(value: string): void {
        console.log(value);
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
