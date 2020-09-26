import { Component, OnInit } from '@angular/core';
import { MatRadioChange } from '@angular/material/radio';
import { MatSliderChange } from '@angular/material/slider';
import { BasicShapeProperties } from '@app/classes/tools-properties/basic-shape-properties';
import { LineService } from '@app/services/tools/Line/line.service';
@Component({
    selector: 'app-line-option',
    templateUrl: './line.component.html',
    styleUrls: ['./line.component.scss'],
})
export class LineComponent implements OnInit {
    typesDrawing: string[] = ['Sans point', 'Avec Point'];
    currentType: string = this.typesDrawing[0];
    currentThickness: number;
    pointSize : number;

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
