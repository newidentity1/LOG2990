import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool/tool';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class PolygonService extends Tool {
    resetContext(): void {
        throw new Error('Method not implemented.');
    }
    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.name = 'polygon';
        this.tooltip = 'Polygone(3)';
        this.iconName = 'change_history';
    }
}
