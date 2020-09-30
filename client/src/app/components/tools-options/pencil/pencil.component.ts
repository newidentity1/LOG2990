import { Component } from '@angular/core';
import { MatSliderChange } from '@angular/material/slider';
import { MAXIMUM_THICKNESS, MINIMUM_THICKNESS } from '@app/constants/constants';
import { PencilService } from '@app/services/tools/pencil/pencil-service';

@Component({
    selector: 'app-pencil-options',
    templateUrl: './pencil.component.html',
    styleUrls: ['./pencil.component.scss'],
})
export class PencilComponent {
    currentThickness: number;

    constructor(private pencilService: PencilService) {
        this.currentThickness = this.pencilService.toolProperties.thickness;
    }

    onThicknessChange(event: MatSliderChange): void {
        if (event.value !== null && event.value >= MINIMUM_THICKNESS && event.value <= MAXIMUM_THICKNESS)
            this.pencilService.setThickness(event.value);
    }
}
