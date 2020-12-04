import { Component } from '@angular/core';
import { MatSliderChange } from '@angular/material/slider';
import { SprayProperties } from '@app/classes/tools-properties/spray-properties';
import {
    MAXIMUM_DIAMETER_DROPS,
    MAXIMUM_DIAMETER_SPRAY,
    MAXIMUM_DROPS_PER_SECOND,
    MINIMUM_DIAMETER_DROPS,
    MINIMUM_DIAMETER_SPRAY,
    MINIMUM_DROPS_PER_SECOND,
} from '@app/constants/constants';
import { SprayService } from '@app/services/tools/spray/spray.service';

@Component({
    selector: 'app-spray-options',
    templateUrl: './spray.component.html',
    styleUrls: ['../../sidebar/sidebar.component.scss'],
})
export class SprayComponent {
    diameterSpray: number = MINIMUM_DIAMETER_SPRAY;
    diameterDrops: number = MINIMUM_DIAMETER_DROPS;
    dropsPerSecond: number = MINIMUM_DROPS_PER_SECOND;

    constructor(protected sprayService: SprayService) {
        const properties = sprayService.toolProperties as SprayProperties;
        this.diameterSpray = properties.diameterSpray;
        this.diameterDrops = properties.diameterDrops;
        this.dropsPerSecond = properties.dropsPerSecond;
    }

    onDiameterSprayChange(event: MatSliderChange): void {
        if (event.value !== null && event.value >= MINIMUM_DIAMETER_SPRAY && event.value <= MAXIMUM_DIAMETER_SPRAY) {
            const properties = this.sprayService.toolProperties as SprayProperties;
            properties.diameterSpray = event.value;
        }
    }

    onDiameterDropsChange(event: MatSliderChange): void {
        if (event.value !== null && event.value >= MINIMUM_DIAMETER_DROPS && event.value <= MAXIMUM_DIAMETER_DROPS) {
            const properties = this.sprayService.toolProperties as SprayProperties;
            properties.diameterDrops = event.value;
        }
    }

    onDropsPerSecondeChange(event: MatSliderChange): void {
        if (event.value !== null && event.value >= MINIMUM_DROPS_PER_SECOND && event.value <= MAXIMUM_DROPS_PER_SECOND) {
            const properties = this.sprayService.toolProperties as SprayProperties;
            properties.dropsPerSecond = event.value;
        }
    }
}
