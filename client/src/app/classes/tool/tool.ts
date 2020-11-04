import { Color } from '@app/classes/color/color';
import { Command } from '@app/classes/commands/command';
import { BasicToolProperties } from '@app/classes/tools-properties/basic-tool-properties';
import { Vec2 } from '@app/classes/vec2';
import { BLACK, DEFAULT_MITER_LIMIT, WHITE } from '@app/constants/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';

// Ceci est justifié vu qu'on a des fonctions qui seront gérés par les classes enfant
// tslint:disable:no-empty
export abstract class Tool extends Command {
    mouseDownCoord: Vec2;
    pathData: Vec2[];
    mouseDown: boolean = false;
    name: string;
    tooltip: string;
    iconName: string;
    toolProperties: BasicToolProperties;
    currentPrimaryColor: Color;
    currentSecondaryColor: Color;

    constructor(protected drawingService: DrawingService) {
        super();
        this.currentPrimaryColor = new Color(BLACK);
        this.currentSecondaryColor = new Color(WHITE);
    }

    setTypeDrawing(value: string): void {}

    onMouseDown(event: MouseEvent): void {}

    onMouseUp(event: MouseEvent): void {}

    onMouseMove(event: MouseEvent): void {}

    onMouseEnter(event: MouseEvent): void {}

    onMouseLeave(event: MouseEvent): void {}

    onKeyDown(event: KeyboardEvent): void {}

    onKeyPress(event: KeyboardEvent): void {}

    onKeyUp(event: KeyboardEvent): void {}

    onDoubleClick(event: MouseEvent): void {}

    onClick(event: MouseEvent): void {}

    draw(ctx: CanvasRenderingContext2D): void {}

    copyTool(tool: Tool): void {
        tool.mouseDownCoord = this.mouseDownCoord;
        tool.toolProperties.thickness = this.toolProperties.thickness;
        tool.currentPrimaryColor = this.currentPrimaryColor;
        tool.currentSecondaryColor = this.currentSecondaryColor;
        tool.pathData = this.pathData;
    }

    getPositionFromMouse(event: MouseEvent): Vec2 {
        const canvasBoundingRect = this.drawingService.canvas.getBoundingClientRect();
        return { x: event.clientX - canvasBoundingRect.x, y: event.clientY - canvasBoundingRect.y };
    }

    setThickness(value: number | null): void {
        value = value === null ? 1 : value;
        this.toolProperties.thickness = value;
        this.drawingService.setThickness(value);
    }

    setColors(primaryColor: Color, secondaryColor: Color): void {
        this.currentPrimaryColor = primaryColor;
        this.currentSecondaryColor = secondaryColor;
        this.drawingService.setColor(primaryColor.toStringRGBA());
    }

    signOf(num: number): number {
        return num ? Math.abs(num) / num : 0;
    }

    applyCurrentSettings(): void {
        const previewCtx = this.drawingService.previewCtx;
        const baseCtx = this.drawingService.baseCtx;

        previewCtx.lineCap = baseCtx.lineCap = 'butt';
        previewCtx.lineJoin = baseCtx.lineJoin = 'miter';
        previewCtx.miterLimit = baseCtx.miterLimit = DEFAULT_MITER_LIMIT;

        this.drawingService.clearCanvas(previewCtx);
        this.setThickness(this.toolProperties.thickness);
        this.setColors(this.currentPrimaryColor, this.currentSecondaryColor);
    }

    resetContext(): void {
        this.mouseDown = false;
        this.applyCurrentSettings();
    }

    clone(): Tool {
        return this;
    }

    execute(): void {
        this.draw(this.drawingService.baseCtx);
    }
}
