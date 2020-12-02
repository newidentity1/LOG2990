import { Injectable } from '@angular/core';
import { ShapeTool } from '@app/classes/tool/shape-tool';
import { BasicShapeProperties } from '@app/classes/tools-properties/basic-shape-properties';
import { Vec2 } from '@app/classes/vec2';
import * as CONSTANTS from '@app/constants/constants';
import { MagnetismOption } from '@app/enums/magnetism-option.enum';
import { MouseButton } from '@app/enums/mouse-button.enum';
import { SelectionType } from '@app/enums/selection-type.enum';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { GridService } from '@app/services/tools/grid/grid.service';
import { MoveSelectionService } from './move-selection/move-selection.service';

interface ClipboardImage {
    image: ImageData;
    selectionType: SelectionType;
}

@Injectable({
    providedIn: 'root',
})
export class SelectionService extends ShapeTool {
    activeMagnet: boolean = false;
    magnetismOption: MagnetismOption = MagnetismOption.TopLeft;
    currentType: SelectionType = SelectionType.RectangleSelection;
    isAreaSelected: boolean;
    positiveStartingPos: Vec2 = { x: 0, y: 0 };
    positiveWidth: number;
    positiveHeight: number;
    private selectionImageData: ImageData;
    private clipboardImage: ClipboardImage;
    private moveSelectionPos: Vec2 = { x: 0, y: 0 };

    constructor(drawingService: DrawingService, private moveSelectionService: MoveSelectionService, private gridService: GridService) {
        super(drawingService);
        this.name = 'Selection';
        this.tooltip = 'Selection (r)';
        this.iconName = 'highlight_alt';
        this.toolProperties = new BasicShapeProperties();
    }

    setMoveSelectionMagnet(state: boolean): void {
        this.moveSelectionService.isMagnet = state;
    }

    setSelectionType(type: SelectionType): void {
        this.drawSelection();
        switch (type) {
            case SelectionType.RectangleSelection:
                this.currentType = SelectionType.RectangleSelection;
                break;
            case SelectionType.EllipseSelection:
                this.currentType = SelectionType.EllipseSelection;
                break;
        }
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
                if (this.activeMagnet) {
                    const position: Vec2 = this.magneticOption({
                        x: event.clientX - this.drawingService.baseCtx.canvas.getBoundingClientRect().x,
                        y: event.clientY - this.drawingService.baseCtx.canvas.getBoundingClientRect().y,
                    });
                    const moveX = position.x;
                    const moveY = position.y;
                    this.moveSelectionPos.x = moveX;
                    this.moveSelectionPos.y = moveY;
                    console.log(this.moveSelectionPos.x, this.moveSelectionPos.y);
                    this.moveSelectionService.moveSelectionMagnetic(moveX, moveY);
                } else {
                    const moveX = this.moveSelectionPos.x - event.clientX;
                    const moveY = this.moveSelectionPos.y - event.clientY;
                    this.moveSelectionPos.x = event.clientX;
                    this.moveSelectionPos.y = event.clientY;
                    this.moveSelectionService.moveSelection(moveX, moveY);
                }
                this.drawSelectionBox({ x: 0, y: 0 }, this.positiveWidth, this.positiveHeight);
            } else {
                this.drawPreview();
            }
        }
    }

    magneticOption(position: Vec2): Vec2 {
        let x = 0;
        let y = 0;
        switch (this.magnetismOption) {
            case MagnetismOption.TopLeft:
                position.x = this.moveSelectionService.calculPosition(position.x);
                position.y = this.moveSelectionService.calculPosition(position.y);
                break;

            case MagnetismOption.TopCenter:
                x = this.moveSelectionService.calculPosition(position.x) + this.gridService.getGridSize() - this.positiveWidth / 2;
                y = this.moveSelectionService.calculPosition(position.y);
                position.x = x;
                position.y = y;
                break;

            case MagnetismOption.TopRight:
                x = this.moveSelectionService.calculPosition(position.x) + this.gridService.getGridSize() - this.positiveWidth;
                y = this.moveSelectionService.calculPosition(position.y);
                position.x = x;
                position.y = y;
                break;

            case MagnetismOption.MidleLeft:
                x = this.moveSelectionService.calculPosition(position.x);
                y = this.moveSelectionService.calculPosition(position.y) + this.gridService.getGridSize() - this.positiveHeight / 2;
                position.x = x;
                position.y = y;
                break;

            case MagnetismOption.MidleCenter:
                x = this.moveSelectionService.calculPosition(position.x) - this.positiveWidth / 2;
                y = this.moveSelectionService.calculPosition(position.y) - this.positiveHeight / 2;
                position.x = x;
                position.y = y;
                break;

            case MagnetismOption.MidleRight:
                x = this.moveSelectionService.calculPosition(position.x) + this.gridService.getGridSize() - this.positiveWidth;
                y = this.moveSelectionService.calculPosition(position.y) + this.gridService.getGridSize() - this.positiveHeight / 2;
                position.x = x;
                position.y = y;
                break;

            case MagnetismOption.BottomLeft:
                x = this.moveSelectionService.calculPosition(position.x);
                y = this.moveSelectionService.calculPosition(position.y) + this.gridService.getGridSize() - this.positiveHeight;
                position.x = x;
                position.y = y;
                break;

            case MagnetismOption.BottomCenter:
                x = this.moveSelectionService.calculPosition(position.x) + this.gridService.getGridSize() - this.positiveWidth / 2;
                y = this.moveSelectionService.calculPosition(position.y) + this.gridService.getGridSize() - this.positiveHeight / 2;
                position.x = x;
                position.y = y;
                break;

            case MagnetismOption.BottomRight:
                x = this.moveSelectionService.calculPosition(position.x + this.positiveWidth);
                y = this.moveSelectionService.calculPosition(position.y + this.positiveHeight);
                position.x = x - this.positiveWidth;
                position.y = y - this.positiveHeight;
                break;
        }
        return position;
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
                    this.moveSelectionService.finalPosition = { x: this.positiveStartingPos.x, y: this.positiveStartingPos.y };
                    this.moveSelectionService.copySelection(this.positiveStartingPos, this.positiveWidth, this.positiveHeight, this.currentType);
                    this.selectionImageData = this.moveSelectionService.imgData;
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
            if (this.moveSelectionService.checkArrowKeysPressed(event)) {
                this.drawSelectionBox({ x: 0, y: 0 }, this.positiveWidth, this.positiveHeight);
            } else if (event.key === 'Delete') {
                this.deleteSelection();
            }
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
        this.moveSelectionService.finalPosition.x = 0;
        this.moveSelectionService.finalPosition.y = 0;
        this.positiveWidth = this.drawingService.canvas.width;
        this.positiveHeight = this.drawingService.canvas.height;
        this.isAreaSelected = true;
        this.moveSelectionService.copySelection(this.positiveStartingPos, this.positiveWidth, this.positiveHeight, this.currentType);
        this.selectionImageData = this.moveSelectionService.imgData;
        this.drawSelectionBox({ x: 0, y: 0 }, this.positiveWidth, this.positiveHeight);
    }

    drawSelection(): void {
        if (this.isAreaSelected) {
            this.resetSelection();
            if (
                this.positiveStartingPos.x !== this.moveSelectionService.finalPosition.x ||
                this.positiveStartingPos.y !== this.moveSelectionService.finalPosition.y
            )
                this.executedCommand.emit(this.clone());
        }
    }

    resetSelection(): void {
        this.isAreaSelected = false;
        this.moveSelectionService.canMoveSelection = false;
        const selectionCtx = this.drawingService.previewCtx;

        this.drawingService.clearCanvas(selectionCtx);
        selectionCtx.putImageData(this.selectionImageData, 0, 0);
        this.drawingService.baseCtx.drawImage(
            selectionCtx.canvas,
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
        this.shiftDown = false;
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
        selectionService.selectionImageData = this.selectionImageData;
    }

    copySelection(): void {
        if (this.isAreaSelected) {
            this.clipboardImage = {
                image: new ImageData(this.selectionImageData.width, this.selectionImageData.height),
                selectionType: this.currentType,
            };
            const dataCopy = new Uint8ClampedArray(this.selectionImageData.data);
            this.clipboardImage.image.data.set(dataCopy);
        }
    }

    pasteSelection(): void {
        // TODO make this better
        if (this.clipboardImage) {
            this.setSelectionType(this.clipboardImage.selectionType);
            this.isAreaSelected = true;
            this.moveSelectionService.imgData = this.clipboardImage.image;
            this.selectionImageData = this.clipboardImage.image;
            this.drawingService.previewCtx.canvas.width = this.clipboardImage.image.width;
            this.drawingService.previewCtx.canvas.height = this.clipboardImage.image.height;
            this.positiveWidth = this.clipboardImage.image.width;
            this.positiveHeight = this.clipboardImage.image.height;
            this.drawingService.previewCtx.putImageData(this.clipboardImage.image, 0, 0);
            this.moveSelectionService.finalPosition.x = 0;
            this.moveSelectionService.finalPosition.y = 0;
            this.drawingService.previewCtx.canvas.style.cursor = 'move';
            this.drawSelectionBox({ x: 0, y: 0 }, this.clipboardImage.image.width, this.clipboardImage.image.height);
        }
    }

    cutSelection(): void {
        this.copySelection();
        this.deleteSelection();
    }

    deleteSelection(): void {
        for (let i = 0; i < this.selectionImageData.data.length; i++) {
            this.selectionImageData.data[i] = 0;
        }
        this.executedCommand.emit(this.clone());
        this.resetSelection();
    }

    isClipboardEmpty(): boolean {
        return this.clipboardImage === undefined;
    }

    clone(): SelectionService {
        const selectionClone: SelectionService = new SelectionService(
            this.drawingService,
            new MoveSelectionService(this.drawingService, this.gridService),
            this.gridService,
        );
        this.copySelectionService(selectionClone);
        return selectionClone;
    }

    execute(): void {
        this.moveSelectionService.copySelection(this.positiveStartingPos, this.positiveWidth, this.positiveHeight, this.currentType);
        this.resetSelection();
    }
}
