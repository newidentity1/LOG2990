// Ceci est justifié vu qu'on a des fonctions qui seront gérés par les classes enfant
// tslint:disable:no-empty
export abstract class Command {
    abstract redo(): void;
    applyCurrentSettings(): void {}
}
