import { Component } from '@angular/core';
import { MatSliderChange } from '@angular/material/slider';
import { MAXIMUM_ROTATION_ANGLE, MAXIMUM_THICKNESS, MINIMUM_ROTATION_ANGLE, MINIMUM_THICKNESS } from '@app/constants/constants';
import { CalligraphyService } from '@app/services/tools/calligraphy/calligraphy.service';

@Component({
    selector: 'app-calligraphy-options',
    templateUrl: './calligraphy.component.html',
    styleUrls: ['../../sidebar/sidebar.component.scss'],
})
export class CalligraphyComponent {
    constructor(private calligraphyService: CalligraphyService) {}

    onLineLengthChange(event: MatSliderChange): void {
        if (event.value !== null && event.value >= MINIMUM_THICKNESS && event.value <= MAXIMUM_THICKNESS) {
            this.calligraphyService.lineLength = event.value;
        }
    }

    onLineAngleChange(event: MatSliderChange): void {
        if (event.value !== null && event.value >= MINIMUM_ROTATION_ANGLE && event.value <= MAXIMUM_ROTATION_ANGLE) {
            this.calligraphyService.lineAngle = event.value;
        }
    }

    get lineLength(): number {
        return this.calligraphyService.lineLength;
    }

    get lineAngle(): number {
        return this.calligraphyService.lineAngle;
    }
}
