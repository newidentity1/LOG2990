import { Component } from '@angular/core';
import { MatRadioChange } from '@angular/material/radio';
import { MatSliderChange } from '@angular/material/slider';
import { PolygonProperties } from '@app/classes/tools-properties/polygon-properties';
import { MAXIMUM_SIDES, MAXIMUM_THICKNESS, MINIMUM_SIDES, MINIMUM_THICKNESS } from '@app/constants/constants';
import { DrawingType } from '@app/enums/drawing-type.enum';
import { PolygonService } from '@app/services/tools/polygon/polygon.service';

@Component({
    selector: 'app-polygon-option',
    templateUrl: './polygon.component.html',
    styleUrls: ['../../sidebar/sidebar.component.scss'],
})
export class PolygonComponent {
    typesDrawing: typeof DrawingType = DrawingType;
    currentType: string = DrawingType.Fill;
    currentThickness: number = 1;
    currentNumberOfSides: number = 3;

    constructor(public polygonService: PolygonService) {
        const polygoneProperties = polygonService.toolProperties as PolygonProperties;
        this.currentType = polygoneProperties.currentType;
        this.currentThickness = polygoneProperties.thickness;
        this.polygonService.setThickness(polygoneProperties.thickness);
        this.currentNumberOfSides = polygoneProperties.numberOfSides;
    }

    onThicknessChange(event: MatSliderChange): void {
        if (event.value !== null && event.value >= MINIMUM_THICKNESS && event.value <= MAXIMUM_THICKNESS)
            this.polygonService.setThickness(event.value);
    }

    onNumberOfSidesChange(event: MatSliderChange): void {
        if (event.value !== null && event.value >= MINIMUM_SIDES && event.value <= MAXIMUM_SIDES) this.polygonService.setNumberOfSides(event.value);
    }

    onTypeDrawingChange(event: MatRadioChange): void {
        for (const value in DrawingType) {
            if (DrawingType[value as keyof typeof DrawingType] === event.value) {
                this.polygonService.setTypeDrawing(event.value);
                break;
            }
        }
    }
}
