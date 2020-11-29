import { Injectable } from '@angular/core';
import { BrushProperties } from '@app/classes/tools-properties/brush-properties';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { PencilService } from '@app/services/tools/pencil/pencil-service';

@Injectable({
    providedIn: 'root',
})
export class CalligraphyService extends PencilService {
    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.name = 'Calligraphy';
        this.tooltip = 'Plume(p)';
        this.iconName = 'history_edu';
        this.toolProperties = new BrushProperties();
        this.clearPath();
    }
}
