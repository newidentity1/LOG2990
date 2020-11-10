import { Injectable } from '@angular/core';
import { EventManager } from '@angular/platform-browser';
import { TextService } from '@app/services/tools/text/text.service';

@Injectable({
    providedIn: 'root',
})
export class WritingTextService {
    // TODO voir avoir chargé
    // tslint:disable-next-line: ban-types
    globalListener: Function | undefined;

    constructor(private eventManager: EventManager) {}

    writingTextMode(textService: TextService): void {
        this.globalListener = this.eventManager.addGlobalEventListener('document', 'keydown', textService.onKeyDown.bind(textService));
    }

    removeWritingTextMode(): void {
        if (this.globalListener) this.globalListener();
    }
}
