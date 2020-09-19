import { Component, EventEmitter, Output } from '@angular/core';
import { MatSliderChange } from '@angular/material/slider';
import { MAXIMUM_THICKNESS, MINIMUM_THICKNESS } from '@app/constants/constants';

@Component({
    selector: 'app-thickness-slider',
    templateUrl: './thickness-slider.component.html',
    styleUrls: ['./thickness-slider.component.scss'],
})
export class ThicknessSliderComponent {
    @Output() thicknessChange: EventEmitter<MatSliderChange> = new EventEmitter();

    onThicknessChange(event: MatSliderChange): void {
        if (event.value !== null && event.value >= MINIMUM_THICKNESS && event.value <= MAXIMUM_THICKNESS) {
            this.thicknessChange.emit(event);
        }
    }

    get minimumThickness(): number {
        return MINIMUM_THICKNESS;
    }

    get maximumThickness(): number {
        return MAXIMUM_THICKNESS;
    }
}
