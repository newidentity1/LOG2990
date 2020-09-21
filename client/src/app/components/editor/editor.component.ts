import { Component, HostListener } from '@angular/core';
import { ToolbarService } from '@app/services/toolbar/toolbar.service';

@Component({
    selector: 'app-editor',
    templateUrl: './editor.component.html',
    styleUrls: ['./editor.component.scss'],
})
export class EditorComponent {
    constructor(private toolbarService: ToolbarService) {}

    @HostListener('keydown', ['$event'])
    onKeyDown(event: KeyboardEvent): void {
        // Send the event to toolbar
        this.toolbarService.onKeyDown(event);
    }

    @HostListener('keypress', ['$event'])
    onKeyPress(event: KeyboardEvent): void {
        this.toolbarService.currentTool.onKeyPress(event);
    }

    @HostListener('keyup', ['$event'])
    onKeyUp(event: KeyboardEvent): void {
        this.toolbarService.currentTool.onKeyUp(event);
    }
}
