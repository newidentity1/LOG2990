import { Component } from '@angular/core';
import { SelectionType } from '@app/enums/selection-type.enum';
import { SelectionService } from '@app/services/tools/selection/selection.service';

@Component({
    selector: 'app-selection-option',
    templateUrl: './selection.component.html',
    styleUrls: ['../../sidebar/sidebar.component.scss'],
})
export class SelectionComponent {
    typesSelection: typeof SelectionType = SelectionType;

    constructor(private selectionService: SelectionService) {}

    onTypeSelectionChange(type: SelectionType): void {
        this.selectionService.setSelectionType(type);
    }

    triggerSelectAll(): void {
        this.selectionService.selectAll();
    }

    keepOriginalOrder(): number {
        return 0;
    }

    get currentType(): SelectionType {
        return this.selectionService.currentType;
    }
}
