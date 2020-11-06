import { Component } from '@angular/core';
import { MatSliderChange } from '@angular/material/slider';
import { BucketService } from '@app/services/tools/bucket/bucket.service';

@Component({
    selector: 'app-bucket-option',
    templateUrl: './bucket.component.html',
    styleUrls: ['../../sidebar/sidebar.component.scss'],
})
export class BucketComponent {
    tolerance: number = 1;
    constructor(public bucketService: BucketService) {}

    onToleranceChange(event: MatSliderChange): void {
        this.bucketService.setTolerance(event.value);
    }
}
