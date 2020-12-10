import { Color } from '@app/classes/color/color';
import { Command } from '@app/classes/commands/command';
import { BasicToolProperties } from '@app/classes/tools-properties/basic-tool-properties';
import { Vec2 } from '@app/classes/vec2';
import { BLACK, DEFAULT_MITER_LIMIT, WHITE } from '@app/constants/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';

// tslint:disable:no-empty / reason : abstract class
export abstract class Tool extends Command {
    mouseDownCoord: Vec2 = { x: 0, y: 0 };
    pathData: Vec2[] = [];
    mouseDown: boolean = false;
    name: string = '';
    tooltip: string = '';
    iconName: string = '';
    toolProperties: BasicToolProperties;
    currentPrimaryColor: Color = new Color(BLACK);
    currentSecondaryColor: Color = new Color(WHITE);

    constructor(protected drawingService: DrawingService) {
        super();
    }

    setTypeDrawing(value: string): void {}

    onMouseScroll(event: WheelEvent): void {}

    onMouseDown(event: MouseEvent): void {}

    onMouseUp(event: MouseEvent): void {}

    onMouseMove(event: MouseEvent): void {}

    onMouseEnter(event: MouseEvent): void {}

    onMouseLeave(event: MouseEvent): void {}

    onKeyDown(event: KeyboardEvent): void {}

    onKeyUp(event: KeyboardEvent): void {}

    onDoubleClick(event: MouseEvent): void {}

    onClick(event: MouseEvent): void {}

    onContextMenu(event: MouseEvent): void {}

    draw(ctx: CanvasRenderingContext2D): void {}

    copyTool(tool: Tool): void {
        tool.mouseDownCoord = this.mouseDownCoord;
        tool.toolProperties.thickness = this.toolProperties.thickness;
        tool.currentPrimaryColor = this.currentPrimaryColor;
        tool.currentSecondaryColor = this.currentSecondaryColor;
        tool.pathData = this.pathData;
    }

    getPositionFromMouse(event: MouseEvent): Vec2 {
        return { x: event.offsetX, y: event.offsetY };
    }

    setThickness(value: number | null): void {
        value = value === null ? 1 : value;
        this.toolProperties.thickness = value;
        this.drawingService.setThickness(value);
    }

    setColors(primaryColor: Color, secondaryColor: Color): void {
        this.drawingService.previewCtx.canvas.style.cursor = '';
        this.currentPrimaryColor = primaryColor;
        this.currentSecondaryColor = secondaryColor;
        this.drawingService.setColor(primaryColor.toStringRGBA());
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
