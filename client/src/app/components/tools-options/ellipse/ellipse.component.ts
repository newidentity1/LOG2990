import { Component, OnInit } from '@angular/core';
import { MatRadioChange } from '@angular/material/radio';
import { MatSliderChange } from '@angular/material/slider';
import { EllipseService } from '@app/services/tools/ellipse/ellipse.service';

@Component({
    selector: 'app-ellipse-options',
    templateUrl: './ellipse.component.html',
    styleUrls: ['./ellipse.component.scss'],
})
export class EllipseComponent implements OnInit {
    typesDrawing: string[] = ['Contour', 'Plein', 'Plein avec contour'];
    currentType: string = this.typesDrawing[0];

    constructor(public ellipseservice: EllipseService) {
        // TODO à  implementer
    }

    ngOnInit(): void {
        // TODO à implementer
    }

    onThicknessChange(event: MatSliderChange): void {
        this.ellipseservice.setThickness(event.value);
    }

    onTypeDrawingChange(event: MatRadioChange): void {
        this.ellipseservice.setTypeDrawing(event.value);
    }
}
