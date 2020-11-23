import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool/tool';
import { StampProperties } from '@app/classes/tools-properties/stamp-properties';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class StampService extends Tool {
    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.name = 'Stamp';
        this.tooltip = 'Étampe(d)';
        this.iconName = 'insert_emoticon';
        this.toolProperties = new StampProperties();
    }
}
