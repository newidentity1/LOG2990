import { Component } from '@angular/core';
import { MatSliderChange } from '@angular/material/slider';
import { BucketService } from '@app/services/tools/bucket/bucket.service';

@Component({
    selector: 'app-bucket-option',
    templateUrl: './bucket.component.html',
    styleUrls: ['./bucket.component.scss'],
})
export class BucketComponent {
    tolerance: number = 1;
    constructor(public bucketService: BucketService) {
        // const rectangleProperties = bucketService.toolProperties as BasicShapeProperties;
    }

    onToleranceChange(event: MatSliderChange): void {
        this.bucketService.setTolerance(event.value);
    }
}
