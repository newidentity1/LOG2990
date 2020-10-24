import { Injectable } from '@angular/core';
import { Color } from '@app/classes/color/color';
import { Tool } from '@app/classes/tool/tool';
import { KeyShortcut } from '@app/enums/key-shortcuts.enum';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { BrushService } from '@app/services/tools/brush/brush.service';
import { EllipseService } from '@app/services/tools/ellipse/ellipse.service';
import { EraseService } from '@app/services/tools/erase/erase.service';
import { LineService } from '@app/services/tools/line/line.service';
import { PencilService } from '@app/services/tools/pencil/pencil-service';
import { PolygonService } from '@app/services/tools/polygon/polygon.service';
import { RectangleService } from '@app/services/tools/rectangle/rectangle.service';

export enum toolsIndex {
    pencil,
    brush,
    rectangle,
    ellipse,
    lines,
    eraser,
}

@Injectable({
    providedIn: 'root',
})
export class ToolbarService {
    private tools: Tool[];
    private drawings: Tool[] = [];
    private undoIndex: number = -1;
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
        protected eraseService: EraseService,
        protected polygonService: PolygonService,
        protected drawingService: DrawingService,
    ) {
        this.tools = [pencilService, brushService, rectangleService, ellipseService, polygonService, lineService, eraseService];
        this.currentTool = this.tools[0];
        this.keyShortcuts
            .set(KeyShortcut.Pencil, pencilService)
            .set(KeyShortcut.Brush, brushService)
            .set(KeyShortcut.Rectangle, rectangleService)
            .set(KeyShortcut.Ellipse, ellipseService)
            .set(KeyShortcut.Line, lineService)
            .set(KeyShortcut.Eraser, eraseService)
            .set(KeyShortcut.Polygon, polygonService);
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

    applyCurrentTool(): void {
        this.currentTool.resetContext();
        this.applyCurrentToolColor();
    }

    onKeyDown(event: KeyboardEvent): void {
        this.currentTool.onKeyDown(event);
        const toolFound = this.getTool(event.key);
        const isNewTool = toolFound && toolFound !== this.currentTool;
        this.currentTool = toolFound ? toolFound : this.currentTool;
        if (isNewTool) {
            this.applyCurrentTool();
        }
    }

    onKeyPress(event: KeyboardEvent): void {
        this.currentTool.onKeyPress(event);
    }

    onKeyUp(event: KeyboardEvent): void {
        this.currentTool.onKeyUp(event);
    }

    onMouseMove(event: MouseEvent): void {
        this.currentTool.onMouseMove(event);
    }

    onMouseDown(event: MouseEvent): void {
        this.currentTool.onMouseDown(event);
    }

    onMouseUp(event: MouseEvent): void {
        let tool: Tool | undefined;
        tool = this.currentTool.onMouseUp(event);

        if (tool !== undefined) {
            this.drawings.push(tool);
            this.undoIndex++;
            console.log('saving shape ', this.undoIndex);
        } else console.log('undefined');
    }

    onMouseEnter(event: MouseEvent): void {
        this.currentTool.onMouseEnter(event);
    }

    onMouseLeave(event: MouseEvent): void {
        this.currentTool.onMouseLeave(event);
    }

    onDoubleClick(event: MouseEvent): void {
        this.currentTool.onDoubleClick(event);
    }

    onClick(event: MouseEvent): void {
        this.currentTool.onClick(event);
    }

    undo(): void {
        this.undoIndex--;
        console.log('undoing ', this.undoIndex);
        this.drawingService.clearCanvas(this.drawingService.baseCtx);
        if (this.undoIndex >= 0) {
            for (let i = 0; i <= this.undoIndex; i++) {
                this.drawings[i].draw(this.drawingService.baseCtx);
            }
        }
    }

    redo(): void {
        console.log('redo');
    }

    private applyCurrentToolColor(): void {
        this.currentTool.setColors(this.primaryColor, this.secondaryColor);
    }
}
