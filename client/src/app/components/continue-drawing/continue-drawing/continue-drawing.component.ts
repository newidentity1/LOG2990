import { Component, Input } from '@angular/core';
import { AutomaticSavingService } from '@app/services/automatic-saving/automatic-saving.service';

@Component({
    selector: 'app-continue-drawing',
    templateUrl: './continue-drawing.component.html',
    styleUrls: ['./continue-drawing.component.scss'],
})
export class ContinueDrawingComponent {
    @Input() inMenu: boolean = false;
    constructor(private automaticSavingService: AutomaticSavingService) {}

    continueDrawing(): void {
        this.automaticSavingService.recover();
    }

    canContinueDrawing(): boolean {
        return this.automaticSavingService.savedDrawingExists();
    }
}
