import { Component } from '@angular/core';
import { SelectionType } from '@app/enums/selection-type.enum';
import { SelectionService } from '@app/services/tools/selection/selection.service';

@Component({
    selector: 'app-selection-option',
    templateUrl: './selection.component.html',
    styleUrls: ['./selection.component.scss'],
})
export class SelectionComponent {
    typesSelection: typeof SelectionType = SelectionType;
    currentType: string;

    constructor(private selectionService: SelectionService) {
        this.currentType = this.selectionService.currentType;
    }

    onTypeSelectionChange(type: SelectionType): void {
        this.selectionService.setSelectionType(type);
    }

    keepOriginalOrder(): number {
        return 0;
    }
}
