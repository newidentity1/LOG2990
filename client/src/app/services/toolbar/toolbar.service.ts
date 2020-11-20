import { Injectable } from '@angular/core';
import { Color } from '@app/classes/color/color';
import { Command } from '@app/classes/commands/command';
import { Tool } from '@app/classes/tool/tool';
import { KeyShortcut } from '@app/enums/key-shortcuts.enum';
import { SelectionType } from '@app/enums/selection-type.enum';
import { AutomaticSavingService } from '@app/services/automatic-saving/automatic-saving.service';
import { ColorPickerService } from '@app/services/color-picker/color-picker.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { BrushService } from '@app/services/tools/brush/brush.service';
import { BucketService } from '@app/services/tools/bucket/bucket.service';
import { EllipseService } from '@app/services/tools/ellipse/ellipse.service';
import { EraseService } from '@app/services/tools/erase/erase.service';
import { EyedropperService } from '@app/services/tools/eyedropper/eyedropper.service';
import { LineService } from '@app/services/tools/line/line.service';
import { PencilService } from '@app/services/tools/pencil/pencil-service';
import { PolygonService } from '@app/services/tools/polygon/polygon.service';
import { RectangleService } from '@app/services/tools/rectangle/rectangle.service';
import { SelectionService } from '@app/services/tools/selection/selection.service';
import { TextService } from '@app/services/tools/text/text.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { Subscription } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ToolbarService {
    private tools: Tool[] = [];
    toolsSubscription: Subscription[] = [];
    currentTool: Tool;
    primaryColor: Color;
    secondaryColor: Color;
    keyShortcuts: Map<string, Tool> = new Map();
    primaryColorSubscription: Subscription;
    secondaryColorSubscription: Subscription;
    mouseDown: boolean = false;

    constructor(
        protected pencilService: PencilService,
        protected brushService: BrushService,
        protected rectangleService: RectangleService,
        protected ellipseService: EllipseService,
        protected lineService: LineService,
        protected eraseService: EraseService,
        protected polygonService: PolygonService,
        protected eyedropperService: EyedropperService,
        protected selectionService: SelectionService,
        protected drawingService: DrawingService,
        protected colorPickerService: ColorPickerService,
        protected bucketService: BucketService,
        protected undoRedoService: UndoRedoService,
        protected automaticSavingService: AutomaticSavingService,
        protected textService: TextService,
    ) {
        this.tools = [
            pencilService,
            brushService,
            eraseService,
            polygonService,
            rectangleService,
            ellipseService,
            lineService,
            selectionService,
            eyedropperService,
            bucketService,
            textService,
        ];
        this.currentTool = this.tools[0];
        this.keyShortcuts
            .set(KeyShortcut.Pencil, pencilService)
            .set(KeyShortcut.Brush, brushService)
            .set(KeyShortcut.Rectangle, rectangleService)
            .set(KeyShortcut.Ellipse, ellipseService)
            .set(KeyShortcut.Line, lineService)
            .set(KeyShortcut.Eraser, eraseService)
            .set(KeyShortcut.Polygon, polygonService)
            .set(KeyShortcut.Eyedropper, eyedropperService)
            .set(KeyShortcut.RectangleSelect, selectionService)
            .set(KeyShortcut.EllipseSelect, selectionService)
            .set(KeyShortcut.Bucket, bucketService)
            .set(KeyShortcut.Text, textService);
    }

    unsubscribeListeners(): void {
        this.primaryColorSubscription.unsubscribe();

        this.secondaryColorSubscription.unsubscribe();

        this.toolsSubscription.forEach((toolSubscription: Subscription) => {
            toolSubscription.unsubscribe();
        });
    }

    initializeListeners(): void {
        this.primaryColorSubscription = this.colorPickerService.primaryColor.subscribe((color: Color) => {
            this.setColors(color, this.secondaryColor);
        });

        this.secondaryColorSubscription = this.colorPickerService.secondaryColor.subscribe((color: Color) => {
            this.setColors(this.primaryColor, color);
        });

        this.tools.forEach((tool: Tool) => {
            this.toolsSubscription.push(
                tool.executedCommand.subscribe((command: Command) => {
                    this.addCommand(command);
                }),
            );
        });
    }

    getTools(): Tool[] {
        return this.tools;
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

    changeTool(tool: Tool): void {
        if (tool !== this.currentTool) {
            this.resetSelection();
            this.currentTool = tool;
            this.applyCurrentTool();
        }
    }

    onKeyDown(event: KeyboardEvent): void {
        this.currentTool.onKeyDown(event);
    }

    onKeyUp(event: KeyboardEvent): void {
        this.currentTool.onKeyUp(event);
    }

    onMouseMove(event: MouseEvent): void {
        this.currentTool.onMouseMove(event);
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = true;
        this.currentTool.onMouseDown(event);
    }

    onMouseUp(event: MouseEvent): void {
        this.mouseDown = false;
        this.currentTool.onMouseUp(event);
    }

    addCommand(command: Command): void {
        this.automaticSavingService.save();
        this.undoRedoService.addCommand(command);
    }

    onMouseEnter(event: MouseEvent): void {
        this.eyedropperService.inCanvas = true;
        this.currentTool.onMouseEnter(event);
    }

    onMouseLeave(event: MouseEvent): void {
        this.eyedropperService.inCanvas = false;
        this.currentTool.onMouseLeave(event);
    }

    onDoubleClick(event: MouseEvent): void {
        this.mouseDown = false;
        this.currentTool.onDoubleClick(event);
    }

    onClick(event: MouseEvent): void {
        this.mouseDown = this.currentTool === this.lineService;
        this.currentTool.onClick(event);
    }

    undo(): void {
        this.undoRedoService.undo(this.isDrawing());

        if (!this.isDrawing())
            setTimeout(() => {
                this.applyCurrentTool();
            }, 1);
    }

    redo(): void {
        this.undoRedoService.redo(this.isDrawing());
        if (!this.isDrawing()) this.applyCurrentTool();
    }

    canUndo(): boolean {
        return this.undoRedoService.canUndo(this.isDrawing());
    }

    canRedo(): boolean {
        return this.undoRedoService.canRedo(this.isDrawing());
    }

    triggerSelectAll(): void {
        this.currentTool = this.selectionService;
        this.selectionService.selectAll();
    }

    triggerCopySelection(): void {
        this.selectionService.copySelection();
    }

    triggerCutSelection(): void {
        this.selectionService.cutSelection();
    }

    triggerPasteSelection(): void {
        this.currentTool = this.selectionService;
        this.selectionService.pasteSelection();
    }

    isDrawing(): boolean {
        return this.mouseDown || this.isAreaSelected();
    }

    isAreaSelected(): boolean {
        return this.selectionService.isAreaSelected;
    }

    resetSelection(): void {
        if (this.isAreaSelected()) {
            this.selectionService.drawSelection();
        }
    }

    changeSelectionTool(type: SelectionType): void {
        this.selectionService.setSelectionType(type);
    }

    private applyCurrentToolColor(): void {
        this.currentTool.setColors(this.primaryColor, this.secondaryColor);
    }
}
