import { Vec2 } from '@app/classes/vec2';
import { DEFAULT_HEIGHT, DEFAULT_WIDTH } from '@app/constants/constants';
import { Command } from './command';

export class ResizeCommand extends Command {
    newWidth: number;
    newHeight: number;
    canvasSize: Vec2 = { x: DEFAULT_WIDTH, y: DEFAULT_HEIGHT };

    constructor() {
        super();
    }

    resize(newWidth: number, newHeight: number): void {
        this.newWidth = newWidth;
        this.newHeight = newHeight;
        this.execute();
        this.executedCommand.emit(this.clone());
    }

    execute(): void {
        this.canvasSize.x = this.newWidth;
        this.canvasSize.y = this.newHeight;
    }

    copy(resizeCommand: ResizeCommand): void {
        resizeCommand.newWidth = this.newWidth;
        resizeCommand.newHeight = this.newHeight;
        resizeCommand.canvasSize = this.canvasSize;
    }

    clone(): ResizeCommand {
        const resizeCommandClone = new ResizeCommand();
        this.copy(resizeCommandClone);
        return resizeCommandClone;
    }
}
