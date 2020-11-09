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

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        this.mouseDownCoord = this.mouseDown ? this.getPositionFromMouse(event) : this.mouseDownCoord;
    }

    onKeyUp(event: KeyboardEvent): void {
        if (this.mouseDown) {
            this.currentText += event.key;
            const context = this.drawingService.previewCtx;
            context.fillText(this.currentText, this.mouseDownCoord.x, this.mouseDownCoord.y);
        }
    }
}
