import { Component, OnInit } from '@angular/core';
import { MatRadioChange } from '@angular/material/radio';
import { MatSliderChange } from '@angular/material/slider';
import { MAXIMUM_THICKNESS, MINIMUM_THICKNESS } from '@app/constants/constants';
import { DrawingType } from '@app/enums/drawing-type.enum';
import { RectangleService } from '@app/services/tools/rectangle/rectangle.service';

@Component({
    selector: 'app-rectangle-options',
    templateUrl: './rectangle.component.html',
    styleUrls: ['./rectangle.component.scss'],
})
export class RectangleComponent implements OnInit {
    typesDrawing: typeof DrawingType = DrawingType;
    currentType: string = DrawingType.Contour;

    constructor(public rectangleService: RectangleService) {
        // TODO à  implementer
    }

    ngOnInit(): void {
        // TODO à implementer
    }

    onThicknessChange(event: MatSliderChange): void {
        if (event.value !== null && event.value >= MINIMUM_THICKNESS && event.value <= MAXIMUM_THICKNESS)
            this.rectangleService.setThickness(event.value);
        // TODO voir comment deal avec le cas ou une entree est invalide
    }

    onTypeDrawingChange(event: MatRadioChange): void {
        if (Object.values(DrawingType).includes(event.value)) this.rectangleService.setTypeDrawing(event.value);
        // TODO voir comment deal avec le cas ou une entree est invalide
    }
}
