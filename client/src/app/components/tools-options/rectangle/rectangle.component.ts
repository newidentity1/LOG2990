import { Component, OnInit } from '@angular/core';
import { MatRadioChange } from '@angular/material/radio';
import { MatSliderChange } from '@angular/material/slider';
import { RectangleService } from '@app/services/tools/rectangle/rectangle.service';

@Component({
    selector: 'app-rectangle-options',
    templateUrl: './rectangle.component.html',
    styleUrls: ['./rectangle.component.scss'],
})
export class RectangleComponent implements OnInit {
    typesDrawing: string[] = ['Contour', 'Plein', 'Plein avec contour'];
    currentType: string = this.typesDrawing[0];

    constructor(public rectangleService: RectangleService) {
        // TODO à  implementer
    }

    ngOnInit(): void {
        // TODO à implementer
    }

    onThicknessChange(event: MatSliderChange): void {
        this.rectangleService.setThickness(event.value);
    }

    onTypeDrawingChange(event: MatRadioChange): void {
        this.rectangleService.setTypeDrawing(event.value);
    }
}
