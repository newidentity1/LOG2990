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

    constructor(private selectionService: SelectionService) {}

    onTypeSelectionChange(type: SelectionType): void {
        this.selectionService.setSelectionType(type);
    }

    triggerSelectAll(): void {
        this.selectionService.selectAll();
    }

    triggerCopy(): void {
        this.selectionService.selectAll();
    }

    triggerCut(): void {
        this.selectionService.selectAll();
    }

    triggerPaste(): void {
        this.selectionService.selectAll();
    }

    triggerDelete(): void {
        this.selectionService.deleteSelection();
    }

    isAreaSelected(): boolean {
        return this.selectionService.isAreaSelected;
    }

    keepOriginalOrder(): number {
        return 0;
    }

    get currentType(): SelectionType {
        return this.selectionService.currentType;
    }
}
