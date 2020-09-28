import { Component } from '@angular/core';
import { MatRadioChange } from '@angular/material/radio';
import { MatSliderChange } from '@angular/material/slider';
import { BrushProperties } from '@app/classes/tools-properties/brush-properties';
import { MAXIMUM_BRUSH_THICKNESS, MINIMUM_BRUSH_THICKNESS } from '@app/constants/constants';
import { BrushService } from '@app/services/tools/brush/brush.service';

@Component({
    selector: 'app-brush-options',
    templateUrl: './brush.component.html',
    styleUrls: ['./brush.component.scss'],
})
export class BrushComponent {
    filterType: string[];
    currentFilter: string;
    currentThickness: number;

    constructor(public brushService: BrushService) {
        const brushProperties = brushService.toolProperties as BrushProperties;
        this.currentFilter = brushProperties.currentFilter;
        this.filterType = brushProperties.filterType;
        this.brushService.setThickness(brushProperties.thickness);
    }

    // TODO: duplicate code from rectangle, clean
    onThicknessChange(event: MatSliderChange): void {
        if (event.value !== null && event.value >= MINIMUM_BRUSH_THICKNESS && event.value <= MAXIMUM_BRUSH_THICKNESS)
            this.brushService.setThickness(event.value);
        // TODO voir comment deal avec le cas ou une entree est invalide
    }

    onFilterChange(event: MatRadioChange): void {
        if (Object.values(this.filterType).includes(event.value)) this.brushService.setFilter(event.value);
    }
}
