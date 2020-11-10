import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EventManager } from '@angular/platform-browser';
import { ToolbarService } from '@app/services/toolbar/toolbar.service';
import { TextService } from '@app/services/tools/text/text.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ShortcutService {
    constructor(private eventManager: EventManager, private dialog: MatDialog, private toolbarService: ToolbarService) {}

    addShortcut(keys: string): Observable<KeyboardEvent> {
        return new Observable((observer) => {
            const handler = (event: KeyboardEvent) => {
                const isWritingTextMode = this.toolbarService.currentTool instanceof TextService && this.toolbarService.currentTool.mouseDown;
                // disable shortcuts if a modal is open
                if (this.dialog.openDialogs.length === 0 && !isWritingTextMode) {
                    event.preventDefault();
                    observer.next(event);
                }
            };

            this.eventManager.addGlobalEventListener('document', `keydown.${keys}`, handler);
        });
    }
}
