import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { GridService } from '@app/services/tools/grid/grid.service';

@Component({
    selector: 'app-grid-option',
    templateUrl: './grid.component.html',
    styleUrls: ['../../sidebar/sidebar.component.scss'],
})
export class GridComponent implements OnInit {
    titleForm: FormControl;
    opacity: number = 255;
    constructor(public gridService: GridService) {}

    ngOnInit(): void {
        this.titleForm = new FormControl('', [Validators.pattern('^[a-zA-ZÀ-ÿ](\\d|[a-zA-ZÀ-ÿ ]){0,20}$'), Validators.required]);
    }

    showGrid(): void {
        this.gridService.draw();
    }

    onChangeInput(event: any): void {
        this.gridService.setDeltaX(event.target.value);
        event.target.value = this.gridService.getDeltaX();
    }

    onChangeSlider(event: any): void {
        this.gridService.setCanvasOpacity(event.value);
    }
}
