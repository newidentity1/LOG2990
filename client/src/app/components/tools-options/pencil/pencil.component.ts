import { Component } from '@angular/core';
import { MatSliderChange } from '@angular/material/slider';
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
        this.pencilService.setThickness(event.value);
    }
}
