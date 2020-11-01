import { EventEmitter } from '@angular/core';

// Ceci est justifié vu qu'on a des fonctions qui seront gérés par les classes enfant
// tslint:disable:no-empty
export abstract class Command {
    executedCommand: EventEmitter<Command>;
    constructor() {
        this.executedCommand = new EventEmitter<Command>();
    }
    abstract execute(): void;
    applyCurrentSettings(): void {}
}
