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

    constructor(drawingService: DrawingService, private writingTextService: WritingTextService) {
        super(drawingService);
        this.name = 'Text';
        this.tooltip = 'Texte(t)';
        this.iconName = 'title';
        this.toolProperties = new TextProperties();
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
}
