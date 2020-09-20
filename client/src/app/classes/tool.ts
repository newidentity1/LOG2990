import { DrawingService } from '@app/services/drawing/drawing.service';
import { Color } from './color/color';
import { BasicToolProperties } from './tools-properties/basic-tool-properties';
import { Vec2 } from './vec2';

// Ceci est justifié vu qu'on a des fonctions qui seront gérés par les classes enfant
// tslint:disable:no-empty
export abstract class Tool {
    mouseDownCoord: Vec2;
    mouseDown: boolean = false;
    name: string;
    tooltip: string;
    iconName: string;
    toolProperties: BasicToolProperties;

    constructor(protected drawingService: DrawingService) {}

    onMouseDown(event: MouseEvent): void {}

    onMouseUp(event: MouseEvent): void {}

    onMouseMove(event: MouseEvent): void {}

    onMouseEnter(event: MouseEvent): void {}

    onMouseLeave(event: MouseEvent): void {}

    onKeyDown(event: KeyboardEvent): void {}

    onKeyPress(event: KeyboardEvent): void {}

    onKeyUp(event: KeyboardEvent): void {}

    getPositionFromMouse(event: MouseEvent): Vec2 {
        return { x: event.offsetX, y: event.offsetY };
    }

    setThickness(value: number | null): void {
        // TODO possiblement ajouter de la validation ici aussi
        value = value === null ? 1 : value;
        this.toolProperties.thickness = value;
        this.drawingService.setThickness(value);
    }

    setColors(primaryColor: Color, secondaryColor: Color): void {}
}
