import { Component } from '@angular/core';
import { SprayProperties } from '@app/classes/tools-properties/spray-properties';
import { SprayService } from '@app/services/tools/spray/spray.service';

@Component({
    selector: 'app-spray-options',
    templateUrl: './spray.component.html',
    styleUrls: ['../../sidebar/sidebar.component.scss'],
})
export class SprayComponent {
    diameterSpray: number = 100;
    diameterDrops: number = 10;
    dropsPerSecond: number = 500;
    constructor(protected sprayService: SprayService) {
        const properties = sprayService.toolProperties as SprayProperties;
        this.diameterSpray = properties.diameterSpray;
        this.diameterDrops = properties.diameterDrops;
        this.dropsPerSecond = properties.dropsPerSecond;
    }
}
