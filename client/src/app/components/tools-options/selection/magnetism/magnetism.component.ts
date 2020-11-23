import { Component, OnInit } from '@angular/core';
import { SelectionService } from '@app/services/tools/selection/selection.service';

@Component({
    selector: 'app-magnetism-option',
    templateUrl: './magnetism.component.html',
    styleUrls: ['./magnetism.component.scss'],
})
export class MagnetismComponent implements OnInit {
    constructor(private selectionService: SelectionService) {
        //
    }

    ngOnInit(): void {
        //
    }

    activeMagnetism(): void {
        this.selectionService.activeMagnet = !this.selectionService.activeMagnet;
        console.log(this.selectionService.activeMagnet);
    }
}
