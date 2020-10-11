import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EventManager } from '@angular/platform-browser';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ShortcutService {
    constructor(private eventManager: EventManager, private dialog: MatDialog) {}

    addShortcut(keys: string): Observable<KeyboardEvent> {
        return new Observable((observer) => {
            const handler = (event: KeyboardEvent) => {
                event.preventDefault();
                // disable shortcuts if a modal is open
                if (this.dialog.openDialogs.length === 0) {
                    observer.next(event);
                }
            };

            this.eventManager.addGlobalEventListener('document', `keydown.${keys}`, handler);
        });
    }
}
