import { Component, OnInit } from '@angular/core';
import { MatSliderChange } from '@angular/material/slider';
import { GridService } from '@app/services/tools/grid/grid.service';

@Component({
    selector: 'app-grid-option',
    templateUrl: './grid.component.html',
    styleUrls: ['../../sidebar/sidebar.component.scss'],
})
export class GridComponent implements OnInit {
    opacity: number = 255;
    constructor(public gridService: GridService) {}

    ngOnInit(): void {
        //
    }

    showGrid(): void {
        this.gridService.draw();
    }

    onChangeGridSize(event: MatSliderChange): void {
        this.gridService.setGridSize(event.value);
        event.value = this.gridService.getGridSize();
    }

    onChangeGridOpacity(event: MatSliderChange): void {
        this.gridService.setCanvasOpacity(event.value);
    }
}
