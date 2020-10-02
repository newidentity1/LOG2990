import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool/tool';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class EyedropperService extends Tool {
    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.name = 'Eyedropper';
        this.tooltip = 'Pipette(I)';
        this.iconName = 'colorize';
    }

    resetContext(): void {
        // does nothing for now
    }
}
