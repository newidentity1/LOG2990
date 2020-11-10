import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool/tool';
import { TextProperties } from '@app/classes/tools-properties/text-properties';
import { MouseButton } from '@app/enums/mouse-button.enum';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class TextService extends Tool {
    currentText: string = '';

    constructor(drawingService: DrawingService) {
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
        this.mouseDown = event.button === MouseButton.Left;
        const previewContext = this.drawingService.previewCtx;
        this.drawingService.clearCanvas(previewContext);
        this.writeText(this.drawingService.baseCtx);
        this.mouseDownCoord = this.mouseDown ? this.getPositionFromMouse(event) : this.mouseDownCoord;
        this.currentText = this.mouseDown ? '' : this.currentText;
    }

    writeText(context: CanvasRenderingContext2D): void {
        context.fillText(this.currentText, this.mouseDownCoord.x, this.mouseDownCoord.y);
    }
}
