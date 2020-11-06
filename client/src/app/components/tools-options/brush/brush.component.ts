import { Component } from '@angular/core';
import { MatRadioChange } from '@angular/material/radio';
import { MatSliderChange } from '@angular/material/slider';
import { BrushProperties } from '@app/classes/tools-properties/brush-properties';
import { MAXIMUM_THICKNESS, MINIMUM_THICKNESS } from '@app/constants/constants';
import { BrushType } from '@app/enums/brush-filters.enum';
import { BrushService } from '@app/services/tools/brush/brush.service';

@Component({
    selector: 'app-brush-options',
    templateUrl: './brush.component.html',
    styleUrls: ['../../sidebar/sidebar.component.scss'],
})
export class BrushComponent {
    filterType: typeof BrushType = BrushType;
    currentFilter: string = BrushType.Blurred;
    currentThickness: number = 1;

    constructor(public brushService: BrushService) {
        const brushProperties = brushService.toolProperties as BrushProperties;
        this.currentFilter = brushProperties.currentFilter;
        this.currentThickness = brushProperties.thickness;
        this.brushService.setThickness(brushProperties.thickness);
    }

    onThicknessChange(event: MatSliderChange): void {
        if (event.value !== null && event.value >= MINIMUM_THICKNESS && event.value <= MAXIMUM_THICKNESS) this.brushService.setThickness(event.value);
    }

    onFilterChange(event: MatRadioChange): void {
        for (const value in BrushType) {
            if (BrushType[value as keyof typeof BrushType] === event.value) {
                this.brushService.setFilter(event.value);
                break;
            }
        }
    }
}
