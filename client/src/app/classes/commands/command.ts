import { EventEmitter } from '@angular/core';

// tslint:disable:no-empty / reason: abstract class
export abstract class Command {
    executedCommand: EventEmitter<Command>;
    constructor() {
        this.executedCommand = new EventEmitter<Command>();
    }
    abstract execute(): void;
    applyCurrentSettings(): void {}
    drawImage(): void {}
}
