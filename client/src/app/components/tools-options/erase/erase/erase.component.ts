import { Component } from '@angular/core';
import { MatSliderChange } from '@angular/material/slider';
import { EraseService } from '@app/services/tools/erase/erase.service';
@Component({
    selector: 'app-erase-option',
    templateUrl: './erase.component.html',
    styleUrls: ['./erase.component.scss'],
})
export class EraseComponent {
    currentThickness: number;
    constructor(private eraseService: EraseService) {
        this.currentThickness = this.eraseService.toolProperties.thickness;
    }
    onThicknessChange(event: MatSliderChange): void {
        if (event.value != null) {
            if (event.value >= 5) {
                this.eraseService.setThickness(event.value);
            } else {
                this.eraseService.setThickness(5);
            }
        }
    }
}
