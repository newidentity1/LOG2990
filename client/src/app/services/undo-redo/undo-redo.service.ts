import { Injectable } from '@angular/core';
import { Command } from '@app/classes/commands/command';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class UndoRedoService {
    undoIndex: number = -1;
    commands: Command[] = [];

    constructor(private drawingService: DrawingService) {}

    undo(isDrawing: boolean): void {
        if (!this.canUndo(isDrawing)) return;
        this.undoIndex--;
        this.drawingService.clearCanvas(this.drawingService.baseCtx);
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        for (let i = 0; i <= this.undoIndex; i++) {
            setTimeout(() => {
                this.commands[i].applyCurrentSettings();
                this.commands[i].execute();
            }, 0);
            setTimeout(() => {
                this.commands[i].drawImage();
            }, 1);
        }
    }

    redo(isDrawing: boolean): void {
        if (!this.canRedo(isDrawing)) return;
        this.undoIndex++;
        this.commands[this.undoIndex].applyCurrentSettings();
        this.commands[this.undoIndex].execute();
        setTimeout(() => {
            this.commands[this.undoIndex].drawImage();
        }, 0);
    }

    canUndo(isDrawing: boolean): boolean {
        const undoIndexCheck = this.undoIndex > 0;
        return undoIndexCheck && !isDrawing;
    }

    canRedo(isDrawing: boolean): boolean {
        const undoIndexCheck = this.undoIndex < this.commands.length - 1;
        return undoIndexCheck && !isDrawing;
    }

    addCommand(command: Command): void {
        this.undoIndex++;
        this.commands.length = this.undoIndex;
        this.commands.push(command);
    }

    resetUndoRedo(): void {
        this.commands = [];
        const defaultIndex = -1;
        this.undoIndex = defaultIndex;
    }
}
