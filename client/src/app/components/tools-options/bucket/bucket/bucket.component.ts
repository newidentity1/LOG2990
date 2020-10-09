import { Component, OnInit } from '@angular/core';
import { BucketService } from '@app/services/tools/bucket/bucket.service';

@Component({
    selector: 'app-bucket-option',
    templateUrl: './bucket.component.html',
    styleUrls: ['./bucket.component.scss'],
})
export class BucketComponent implements OnInit {
    constructor(public bucketService: BucketService) {
        // const rectangleProperties = bucketService.toolProperties as BasicShapeProperties;
    }

    ngOnInit(): void {}
}
