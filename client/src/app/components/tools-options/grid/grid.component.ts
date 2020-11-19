import { Component } from '@angular/core';
import { GridService } from '@app/services/tools/grid/grid.service';

@Component({
    selector: 'app-grid-option',
    templateUrl: './grid.component.html',
    styleUrls: ['./grid.component.scss'],
})
export class GridComponent {
    constructor(private gridService: GridService) {}

    showGrid(): void {
        this.gridService.draw();
    }
}
