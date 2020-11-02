import { Component } from '@angular/core';
import { ToolbarService } from '@app/services/toolbar/toolbar.service';

@Component({
    selector: 'app-undo-redo',
    templateUrl: './undo-redo.component.html',
    styleUrls: ['./undo-redo.component.scss'],
})
export class UndoRedoComponent {
    constructor(protected toolbarService: ToolbarService) {}

    undo(): void {
        this.toolbarService.undo();
    }

    redo(): void {
        this.toolbarService.redo();
    }

    canUndo(): boolean {
        return this.toolbarService.canUndo();
    }

    canRedo(): boolean {
        return this.toolbarService.canRedo();
    }
}
