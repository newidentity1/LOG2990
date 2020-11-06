import { Component } from '@angular/core';
import { MatRadioChange } from '@angular/material/radio';
import { MatSliderChange } from '@angular/material/slider';
import { LineProperties } from '@app/classes/tools-properties/line-properties';
import { LinePointType } from '@app/enums/line-point-type.enum';
import { LineService } from '@app/services/tools/line/line.service';
@Component({
    selector: 'app-line-option',
    templateUrl: './line.component.html',
    styleUrls: ['../../sidebar/sidebar.component.scss'],
})
export class LineComponent {
    typesDrawing: typeof LinePointType = LinePointType;
    currentType: string = this.typesDrawing.SansPoint;
    currentThickness: number = 1;
    pointSize: number = 1;

    constructor(public lineService: LineService) {
        const lineProperties = lineService.toolProperties as LineProperties;
        this.currentThickness = lineProperties.thickness;
        this.pointSize = lineProperties.pointSize;
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
}
