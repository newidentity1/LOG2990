import { Component } from '@angular/core';
import { MatRadioChange } from '@angular/material/radio';
import { MatSliderChange } from '@angular/material/slider';
import { BasicShapeProperties } from '@app/classes/tools-properties/basic-shape-properties';
import { MAXIMUM_THICKNESS, MINIMUM_THICKNESS } from '@app/constants/constants';
import { DrawingType } from '@app/enums/drawing-type.enum';
import { EllipseService } from '@app/services/tools/ellipse/ellipse.service';

@Component({
    selector: 'app-ellipse-options',
    templateUrl: './ellipse.component.html',
    styleUrls: ['../../sidebar/sidebar.component.scss'],
})
export class EllipseComponent {
    typesDrawing: typeof DrawingType = DrawingType;
    currentType: string = DrawingType.Fill;
    currentThickness: number = 1;

    constructor(public ellipseService: EllipseService) {
        const ellipseProperties = ellipseService.toolProperties as BasicShapeProperties;
        this.currentType = ellipseProperties.currentType;
        this.currentThickness = ellipseProperties.thickness;
        this.ellipseService.setThickness(ellipseProperties.thickness);
    }

    onThicknessChange(event: MatSliderChange): void {
        if (event.value !== null && event.value >= MINIMUM_THICKNESS && event.value <= MAXIMUM_THICKNESS)
            this.ellipseService.setThickness(event.value);
    }

    onTypeDrawingChange(event: MatRadioChange): void {
        for (const value in DrawingType) {
            if (DrawingType[value as keyof typeof DrawingType] === event.value) {
                this.ellipseService.setTypeDrawing(event.value);
                break;
            }
        }
    }
}
