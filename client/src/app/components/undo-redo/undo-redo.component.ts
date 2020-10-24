import { Component, OnInit } from '@angular/core';
import { ToolbarService } from '@app/services/toolbar/toolbar.service';

@Component({
    selector: 'app-undo-redo',
    templateUrl: './undo-redo.component.html',
    styleUrls: ['./undo-redo.component.scss'],
})
export class UndoRedoComponent implements OnInit {
    constructor(protected toolbarService: ToolbarService) {}

    ngOnInit(): void {}

    undo(): void {
        this.toolbarService.undo();
    }

    redo(): void {
        this.toolbarService.redo();
    }
}
