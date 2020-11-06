import { Component } from '@angular/core';
import { MatSliderChange } from '@angular/material/slider';
import { EraseService } from '@app/services/tools/erase/erase.service';
@Component({
    selector: 'app-erase-option',
    templateUrl: './erase.component.html',
    styleUrls: ['../../sidebar/sidebar.component.scss'],
})
export class EraseComponent {
    currentThickness: number = 5;
    constructor(private eraseService: EraseService) {
        this.currentThickness = this.eraseService.toolProperties.thickness;
        this.eraseService.setThickness(this.eraseService.toolProperties.thickness);
    }

    onThicknessChange(event: MatSliderChange): void {
        this.eraseService.setThickness(event.value);
    }
}
