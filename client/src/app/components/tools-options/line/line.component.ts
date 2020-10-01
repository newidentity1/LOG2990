import { Component, OnInit } from '@angular/core';
import { MatRadioChange } from '@angular/material/radio';
import { MatSliderChange } from '@angular/material/slider';
import { BasicShapeProperties } from '@app/classes/tools-properties/basic-shape-properties';
import { LinePointType } from '@app/enums/linepoint-type.enum';
import { LineService } from '@app/services/tools/line/line.service';
@Component({
    selector: 'app-line-option',
    templateUrl: './line.component.html',
    styleUrls: ['../../sidebar/sidebar.component.scss'],
})
export class LineComponent implements OnInit {
    typesDrawing: typeof LinePointType = LinePointType;
    currentType: string = this.typesDrawing.sansPoint;
    currentThickness: number;
    pointSize: number;

    constructor(public lineService: LineService) {
        const lineProperties = lineService.toolProperties as BasicShapeProperties;
        this.currentThickness = lineProperties.thickness;
        this.lineService.setThickness(lineProperties.thickness);
    }

    onThicknessChange(event: MatSliderChange): void {
        this.lineService.setThickness(event.value);
    }

    onTypeDrawingChange(event: MatRadioChange): void {
        this.lineService.setTypeDrawing(event.value);
    }

    onSizeChange(event: MatSliderChange): void {
        this.lineService.setPointeSize(event.value);
    }
    ngOnInit(): void {
        // TODO
    }
}
