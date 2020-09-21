import { Component } from '@angular/core';
import { MatRadioChange } from '@angular/material/radio';
import { MatSliderChange } from '@angular/material/slider';
import { BasicShapeProperties } from '@app/classes/tools-properties/basic-shape-properties';
import { EllipseService } from '@app/services/tools/ellipse/ellipse.service';

@Component({
    selector: 'app-ellipse-options',
    templateUrl: './ellipse.component.html',
    styleUrls: ['./ellipse.component.scss'],
})
export class EllipseComponent {
    typesDrawing: string[] = ['Contour', 'Plein', 'Plein avec contour'];
    currentType: string = this.typesDrawing[0];
    currentThickness: number;

    constructor(public ellipseService: EllipseService) {
        const ellipseProperties = ellipseService.toolProperties as BasicShapeProperties;
        this.currentType = ellipseProperties.currentType;
        this.currentThickness = ellipseProperties.thickness;
        this.ellipseService.setThickness(ellipseProperties.thickness);
    }

    onThicknessChange(event: MatSliderChange): void {
        this.ellipseService.setThickness(event.value);
    }

    onTypeDrawingChange(event: MatRadioChange): void {
        this.ellipseService.setTypeDrawing(event.value);
    }
}
