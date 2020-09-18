import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-rectangle-options',
    templateUrl: './rectangle.component.html',
    styleUrls: ['./rectangle.component.scss'],
})
export class RectangleComponent implements OnInit {
    typesDrawing: string[] = ['Contour', 'Plein', 'Plein avec contour'];
    currentType: string = this.typesDrawing[0];

    constructor() {
        // TODO à  implementer
    }

    ngOnInit(): void {
        // TODO à implementer
    }
}
