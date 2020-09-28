import { Injectable } from '@angular/core';
import { Color } from '@app/classes/color/color';
import { Tool } from '@app/classes/tool';
import { KeyShortcut } from '@app/enums/key-shortcuts.enum';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { BrushService } from '@app/services/tools/brush/brush.service';
import { EllipseService } from '@app/services/tools/ellipse/ellipse.service';
import { LineService } from '@app/services/tools/Line/line.service';
import { PencilService } from '@app/services/tools/pencil/pencil-service';
import { RectangleService } from '@app/services/tools/rectangle/rectangle.service';

export enum toolsIndex {
    pencil,
    brush,
    rectangle,
    ellipse,
    lines,
}

@Injectable({
    providedIn: 'root',
})
export class ToolbarService {
    private tools: Tool[];
    currentTool: Tool;
    primaryColor: Color;
    secondaryColor: Color;
    keyShortcuts: Map<string, Tool> = new Map();

    constructor(
        protected pencilService: PencilService,
        protected brushService: BrushService,
        protected rectangleService: RectangleService,
        protected ellipseService: EllipseService,
        protected lineService: LineService,
        protected drawingService: DrawingService,
    ) {
        this.tools = [pencilService, brushService, rectangleService, ellipseService, lineService];
        this.currentTool = this.tools[0];
        this.keyShortcuts
            .set(KeyShortcut.Pencil, pencilService)
            .set(KeyShortcut.Brush, brushService)
            .set(KeyShortcut.Rectangle, rectangleService)
            .set(KeyShortcut.Ellipse, ellipseService)
            .set(KeyShortcut.Line, lineService);
    }

    getTools(): Tool[] {
        return this.tools;
    }

    getTool(keyShortcut: string): Tool | undefined {
        let tool: Tool | undefined;
        if (this.keyShortcuts.has(keyShortcut)) {
            tool = this.keyShortcuts.get(keyShortcut);
        }
        return tool;
    }

    setColors(primaryColor: Color, secondaryColor: Color): void {
        this.primaryColor = primaryColor;
        this.secondaryColor = secondaryColor;
        this.applyCurrentToolColor();
    }

    applyCurrentToolColor(): void {
        this.currentTool.setColors(this.primaryColor, this.secondaryColor);
    }

    // TODO: refactor
    onKeyDown(event: KeyboardEvent): void {
        const toolFound = this.getTool(event.key);
        this.currentTool = toolFound ? toolFound : this.currentTool;
        this.currentTool.onKeyDown(event);
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
    }

    onKeyPress(event: KeyboardEvent): void {
        this.currentTool.onKeyPress(event);
    }

    onKeyUp(event: KeyboardEvent): void {
        this.currentTool.onKeyUp(event);
    }
}
