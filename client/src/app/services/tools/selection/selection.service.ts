import { Injectable } from '@angular/core';
import { ShapeTool } from '@app/classes/tool/shape-tool';
import { BasicShapeProperties } from '@app/classes/tools-properties/basic-shape-properties';
import { Vec2 } from '@app/classes/vec2';
import * as CONSTANTS from '@app/constants/constants';
import { MouseButton } from '@app/enums/mouse-button.enum';
import { SelectionType } from '@app/enums/selection-type.enum';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { MoveSelectionService } from './move-selection/move-selection.service';

@Injectable({
    providedIn: 'root',
})
export class SelectionService extends ShapeTool {
    currentType: SelectionType;
    isAreaSelected: boolean;
    positiveStartingPos: Vec2;
    positiveWidth: number;
    positiveHeight: number;
    private moveSelectionPos: Vec2;

    constructor(drawingService: DrawingService, private moveSelectionService: MoveSelectionService) {
        super(drawingService);
        this.name = 'Selection';
        this.tooltip = 'Selection (r)';
        this.iconName = 'highlight_alt';
        this.toolProperties = new BasicShapeProperties();
        this.currentType = SelectionType.RectangleSelection;
        this.positiveStartingPos = { x: 0, y: 0 };
        this.moveSelectionPos = { x: 0, y: 0 };
    }

    setSelectionType(type: SelectionType): void {
        switch (type) {
            case SelectionType.RectangleSelection:
                this.currentType = SelectionType.RectangleSelection;
                break;
            case SelectionType.EllipseSelection:
                this.currentType = SelectionType.EllipseSelection;
                break;
        }
        this.drawSelection();
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        this.mouseDownCoord = this.getPositionFromMouse(event);
        if (this.mouseDown) {
            if (this.isAreaSelected) {
                this.moveSelectionPos = { x: event.clientX, y: event.clientY };
            }
        }
    }

    onMouseMove(event: MouseEvent): void {
        this.currentMousePosition = this.getPositionFromMouse(event);
        if (this.mouseDown) {
            if (this.isAreaSelected) {
                const moveX = this.moveSelectionPos.x - event.clientX;
                const moveY = this.moveSelectionPos.y - event.clientY;
                this.moveSelectionPos.x = event.clientX;
                this.moveSelectionPos.y = event.clientY;
                this.moveSelectionService.moveSelection(moveX, moveY);
                this.drawSelectionBox({ x: 0, y: 0 }, this.positiveWidth, this.positiveHeight);
            } else {
                this.drawPreview();
            }
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            if (!this.isAreaSelected) {
                this.currentMousePosition = this.getPositionFromMouse(event);
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                if (
                    (this.currentMousePosition.x !== this.mouseDownCoord.x || this.currentMousePosition.y !== this.mouseDownCoord.y) &&
                    this.width &&
                    this.height
                ) {
                    this.isAreaSelected = true;
                    this.moveSelectionService.copySelection(this.positiveStartingPos, this.positiveWidth, this.positiveHeight, this.currentType);
                    this.drawSelectionBox({ x: 0, y: 0 }, this.positiveWidth, this.positiveHeight);
                }
            }
            this.mouseDown = false;
        }
    }

    onKeyDown(event: KeyboardEvent): void {
        if (event.key === 'Escape' && (this.mouseDown || this.isAreaSelected)) {
            this.drawSelection();
        }

        if (this.isAreaSelected) {
            if (this.moveSelectionService.checkArrowKeysPressed(event))
                this.drawSelectionBox({ x: 0, y: 0 }, this.positiveWidth, this.positiveHeight);
        } else {
            super.onKeyDown(event);
        }
    }

    onKeyUp(event: KeyboardEvent): void {
        if (this.isAreaSelected) {
            this.moveSelectionService.checkArrowKeysReleased(event);
        } else {
            super.onKeyUp(event);
        }
    }

    selectAll(): void {
        this.setSelectionType(SelectionType.RectangleSelection);
        this.positiveStartingPos.x = 0;
        this.positiveStartingPos.y = 0;
        this.positiveWidth = this.drawingService.canvas.width;
        this.positiveHeight = this.drawingService.canvas.height;
        this.isAreaSelected = true;
        this.moveSelectionService.copySelection(this.positiveStartingPos, this.positiveWidth, this.positiveHeight, this.currentType);
        this.drawSelectionBox({ x: 0, y: 0 }, this.positiveWidth, this.positiveHeight);
    }

    drawSelection(): void {
        if (this.isAreaSelected) {
            this.executedCommand.emit(this.clone());
            this.resetSelection();
        }
    }

    resetSelection(): void {
        this.isAreaSelected = false;
        this.moveSelectionService.canMoveSelection = false;
        const selectionCtx = this.drawingService.previewCtx;

        this.drawingService.clearCanvas(selectionCtx);
        this.drawingService.baseCtx.putImageData(
            this.moveSelectionService.imgData,
            this.moveSelectionService.finalPosition.x,
            this.moveSelectionService.finalPosition.y,
        );

        selectionCtx.canvas.width = this.drawingService.canvas.width;
        selectionCtx.canvas.height = this.drawingService.canvas.height;
        selectionCtx.canvas.style.left = '0px';
        selectionCtx.canvas.style.top = '0px';
        selectionCtx.canvas.style.cursor = '';
    }

    draw(): void {
        this.computePositiveRectangleValues();
        this.drawSelectionBox(this.positiveStartingPos, this.positiveWidth, this.positiveHeight);
    }

    private drawSelectionBox(position: Vec2, width: number, height: number): void {
        this.setThickness(CONSTANTS.SELECTION_BOX_THICKNESS);
        const ctx = this.drawingService.previewCtx;
        ctx.beginPath();
        if (this.currentType === SelectionType.EllipseSelection) {
            const radius: Vec2 = { x: width / 2, y: height / 2 };
            ctx.ellipse(position.x + radius.x, position.y + radius.y, radius.x, radius.y, 0, 0, 2 * Math.PI);
        }
        ctx.rect(position.x, position.y, width, height);
        ctx.setLineDash([]);
        ctx.strokeStyle = 'white';
        ctx.stroke();
        ctx.setLineDash([CONSTANTS.DASHED_SEGMENTS]);
        ctx.strokeStyle = 'black';
        ctx.stroke();
    }

    private computePositiveRectangleValues(): void {
        this.positiveStartingPos.x = this.width >= 0 ? this.mouseDownCoord.x : this.mouseDownCoord.x + this.width;
        this.positiveWidth = Math.abs(this.width);
        this.positiveStartingPos.y = this.height >= 0 ? this.mouseDownCoord.y : this.mouseDownCoord.y + this.height;
        this.positiveHeight = Math.abs(this.height);
    }

    setColors(): void {
        this.drawingService.setStrokeColor('black');
    }

    resetContext(): void {
        this.mouseDown = false;
        this.isAreaSelected = false;
        this.positiveStartingPos = { x: 0, y: 0 };
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
    }

    copySelectionService(selectionService: SelectionService): void {
        selectionService.positiveStartingPos = { x: this.positiveStartingPos.x, y: this.positiveStartingPos.y };
        selectionService.positiveWidth = this.positiveWidth;
        selectionService.positiveHeight = this.positiveHeight;
        selectionService.currentType = this.currentType;
        selectionService.moveSelectionService.finalPosition = {
            x: this.moveSelectionService.finalPosition.x,
            y: this.moveSelectionService.finalPosition.y,
        };
    }

    clone(): SelectionService {
        const selectionClone: SelectionService = new SelectionService(this.drawingService, new MoveSelectionService(this.drawingService));
        this.copySelectionService(selectionClone);
        return selectionClone;
    }

    redo(): void {
        this.moveSelectionService.copySelection(this.positiveStartingPos, this.positiveWidth, this.positiveHeight, this.currentType);
        this.resetSelection();
    }
}
