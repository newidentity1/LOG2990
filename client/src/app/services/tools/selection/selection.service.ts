import { Injectable } from '@angular/core';
import { ShapeTool } from '@app/classes/tool/shape-tool';
import { BasicShapeProperties } from '@app/classes/tools-properties/basic-shape-properties';
import { Vec2 } from '@app/classes/vec2';
import * as CONSTANTS from '@app/constants/constants';
import { MouseButton } from '@app/enums/mouse-button.enum';
import { SelectionType } from '@app/enums/selection-type.enum';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { GridService } from '@app/services/tools/grid/grid.service';
import { MagnetismService } from '@app/services/tools/selection/magnetism/magnetism.service';
import { MagicWandService } from './magic-wand/magic-wand.service';
import { MoveSelectionService } from './move-selection/move-selection.service';
import { ResizeSelectionService } from './resize-selection/resize-selection.service';
import { RotateSelectionService } from './rotate-selection/rotate-selection.service';

interface ClipboardImage {
    image: ImageData;
    selectionType: SelectionType;
}

@Injectable({
    providedIn: 'root',
})
export class SelectionService extends ShapeTool {
    activeMagnet: boolean = false;
    currentType: SelectionType = SelectionType.RectangleSelection;
    isAreaSelected: boolean = false;
    private deletePressed: boolean = false;
    private positiveStartingPos: Vec2 = { x: 0, y: 0 };
    private positiveWidth: number;
    private positiveHeight: number;
    private selectionImageData: ImageData;
    private clipboardImage: ClipboardImage;
    private moveSelectionPos: Vec2 = { x: 0, y: 0 };
    private atlDown: boolean = false;

    constructor(
        drawingService: DrawingService,
        private moveSelectionService: MoveSelectionService,
        private resizeSelectionService: ResizeSelectionService,
        private rotateSelectionService: RotateSelectionService,
        private magicWandService: MagicWandService,
        private gridService: GridService,
        public magnetismService: MagnetismService,
    ) {
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
            case SelectionType.MagicWandSelection:
                this.currentType = SelectionType.MagicWandSelection;
                break;
        }
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        this.mouseDownCoord = this.getPositionFromMouse(event);
        if (this.mouseDown) {
            if (this.isAreaSelected && !this.resizeSelectionService.isResizing) {
                this.moveSelectionPos = { x: event.clientX, y: event.clientY };
                this.moveSelectionService.imgData = this.shiftDown
                    ? this.resizeSelectionService.scaleImageKeepRatio(this.moveSelectionService.imgData)
                    : this.resizeSelectionService.scaleImage(this.moveSelectionService.imgData);
                if (this.rotateSelectionService.angle !== 0) this.moveSelectionService.imgData = this.rotateSelectionService.rotatedImage.image;
            }
        }
    }

    onMouseMove(event: MouseEvent): void {
        this.currentMousePosition = this.getPositionFromMouse(event);
        if (!this.mouseDown) return;
        if (this.isAreaSelected && !this.resizeSelectionService.isResizing) {
            if (this.activeMagnet) {
                const position: Vec2 = this.magnetismService.magneticOption(
                    {
                        x: event.clientX - this.drawingService.baseCtx.canvas.getBoundingClientRect().x,
                        y: event.clientY - this.drawingService.baseCtx.canvas.getBoundingClientRect().y,
                    },
                    this.positiveWidth,
                    this.positiveHeight,
                );
                const moveX = position.x;
                const moveY = position.y;
                this.moveSelectionPos.x = moveX;
                this.moveSelectionPos.y = moveY;
                this.moveSelectionService.moveSelectionMagnetic(moveX, moveY);
            } else {
                const moveX = this.moveSelectionPos.x - event.clientX;
                const moveY = this.moveSelectionPos.y - event.clientY;
                this.moveSelectionPos.x = event.clientX;
                this.moveSelectionPos.y = event.clientY;
                this.positiveStartingPos.x -= moveX;
                this.positiveStartingPos.y -= moveY;
                this.moveSelectionService.moveSelection(moveX, moveY);
            }
            this.rotateSelectionService.originalOffsetLeft = this.moveSelectionService.finalPosition.x + this.rotateSelectionService.leftOffset;
            this.rotateSelectionService.originalOffsetTop = this.moveSelectionService.finalPosition.y + this.rotateSelectionService.topOffset;
            this.drawSelectionBox({ x: 0, y: 0 }, this.positiveWidth, this.positiveHeight);
        } else {
            if (this.currentType !== SelectionType.MagicWandSelection) this.drawPreview();
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (!this.mouseDown) return;
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
                this.rotateSelectionService.originalWidth = this.positiveWidth;
                this.rotateSelectionService.originalHeight = this.positiveHeight;
                this.rotateSelectionService.originalOffsetLeft = this.drawingService.previewCtx.canvas.offsetLeft;
                this.rotateSelectionService.originalOffsetTop = this.drawingService.previewCtx.canvas.offsetTop;
                this.rotateSelectionService.angle = 0;
            }
        }
        this.mouseDown = false;
    }

    onClick(event: MouseEvent): void {
        if (this.currentType !== SelectionType.MagicWandSelection || this.isAreaSelected) return;
        this.currentMousePosition = this.getPositionFromMouse(event);
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.isAreaSelected = true;
        this.magicWandService.copyMagicSelection(this.currentMousePosition, true);
        this.moveSelectionService.finalPosition = {
            x: this.magicWandService.startingPosition.x,
            y: this.magicWandService.startingPosition.y,
        };
        this.moveSelectionService.imgData = this.magicWandService.imgData;
        this.selectionImageData = this.moveSelectionService.imgData;
        this.rotateSelectionService.originalWidth = this.magicWandService.selectionSize.x;
        this.rotateSelectionService.originalHeight = this.magicWandService.selectionSize.y;
        this.rotateSelectionService.originalOffsetLeft = this.drawingService.previewCtx.canvas.offsetLeft;
        this.rotateSelectionService.originalOffsetTop = this.drawingService.previewCtx.canvas.offsetTop;
        this.rotateSelectionService.angle = 0;
    }

    onContextMenu(event: MouseEvent): void {
        if (this.currentType !== SelectionType.MagicWandSelection || this.isAreaSelected) return;

        this.currentMousePosition = this.getPositionFromMouse(event);
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.isAreaSelected = true;
        this.magicWandService.copyMagicSelection(this.currentMousePosition, false);
        this.moveSelectionService.finalPosition = {
            x: this.magicWandService.startingPosition.x,
            y: this.magicWandService.startingPosition.y,
        };
        this.moveSelectionService.imgData = this.magicWandService.imgData;
        this.selectionImageData = this.moveSelectionService.imgData;
        this.drawSelectionBox({ x: 0, y: 0 }, this.drawingService.previewCtx.canvas.width, this.drawingService.previewCtx.canvas.height);
        this.rotateSelectionService.originalWidth = this.magicWandService.selectionSize.x;
        this.rotateSelectionService.originalHeight = this.magicWandService.selectionSize.y;
        this.rotateSelectionService.originalOffsetLeft = this.drawingService.previewCtx.canvas.offsetLeft;
        this.rotateSelectionService.originalOffsetTop = this.drawingService.previewCtx.canvas.offsetTop;
        this.rotateSelectionService.angle = 0;
    }

    onMouseScroll(event: WheelEvent): void {
        if (!this.isAreaSelected) return;
        const image = this.shiftDown
            ? this.resizeSelectionService.scaleImageKeepRatio(this.selectionImageData)
            : this.resizeSelectionService.scaleImage(this.selectionImageData);
        this.rotateSelectionService.scroll(event, image, this.atlDown);
        this.moveSelectionService.finalPosition.x = this.drawingService.previewCtx.canvas.offsetLeft;
        this.moveSelectionService.finalPosition.y = this.drawingService.previewCtx.canvas.offsetTop;
        this.positiveWidth = this.drawingService.previewCtx.canvas.width;
        this.positiveHeight = this.drawingService.previewCtx.canvas.height;
        this.drawSelectionBox({ x: 0, y: 0 }, this.positiveWidth, this.positiveHeight);
    }

    onKeyDown(event: KeyboardEvent): void {
        if (event.key === 'Escape' && (this.mouseDown || this.isAreaSelected)) {
            this.drawSelection();
        }

        if (this.isAreaSelected) {
            if (this.moveSelectionService.checkArrowKeysPressed(event)) {
                this.drawSelectionBox({ x: 0, y: 0 }, this.positiveWidth, this.positiveHeight);
            } else {
                switch (event.key) {
                    case 'Delete':
                        this.deleteSelection();
                        break;
                    case 'Shift':
                        if (!this.shiftDown && this.resizeSelectionService.isResizing) {
                            const image = this.resizeSelectionService.scaleImageKeepRatio(this.selectionImageData);
                            this.rotateSelectionService.rotateImage(image);
                            this.shiftDown = true;
                        }
                        break;
                    case 'Alt':
                        this.atlDown = true;
                        break;
                }
            }
        } else {
            super.onKeyDown(event);
        }
    }

    onKeyUp(event: KeyboardEvent): void {
        if (this.isAreaSelected) {
            this.moveSelectionService.checkArrowKeysReleased(event);
            if (event.key === 'Shift') {
                if (this.resizeSelectionService.isResizing) {
                    this.shiftDown = false;
                    const image = this.resizeSelectionService.scaleImage(this.selectionImageData);
                    this.rotateSelectionService.rotateImage(image);
                }
            } else if (event.key === 'Alt') {
                this.atlDown = false;
            }
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
        if (!this.isAreaSelected) return;
        this.resetSelection();
        if (
            this.positiveStartingPos.x !== this.moveSelectionService.finalPosition.x ||
            this.positiveStartingPos.y !== this.moveSelectionService.finalPosition.y
        )
            this.executedCommand.emit(this.clone());
    }

    resetSelection(): void {
        this.isAreaSelected = false;
        this.moveSelectionService.canMoveSelection = false;
        const selectionCtx = this.drawingService.previewCtx;

        // if (this.currentType === SelectionType.MagicWandSelection) this.selectionImageData = this.magicWandService.imgData;
        this.selectionImageData = this.shiftDown
            ? this.resizeSelectionService.scaleImageKeepRatio(this.selectionImageData)
            : this.resizeSelectionService.scaleImage(this.selectionImageData);
        if (this.rotateSelectionService.angle !== 0 && !this.deletePressed) {
            // this.rotateSelectionService.rotateImage(this.selectionImageData);
            this.selectionImageData = this.rotateSelectionService.rotatedImage.image;
        }

        this.deletePressed = false;
        // selectionCtx.putImageData(this.selectionImageData, 0, 0);
        // this.drawingService.baseCtx.drawImage(selectionCtx.canvas, this.positiveStartingPos.x, this.positiveStartingPos.y);

        this.drawingService.clearCanvas(selectionCtx);
        selectionCtx.putImageData(this.selectionImageData, 0, 0);
        this.drawingService.baseCtx.drawImage(selectionCtx.canvas, selectionCtx.canvas.offsetLeft, selectionCtx.canvas.offsetTop);

        this.resizeSelectionService.isMirrorWidth = false;
        this.resizeSelectionService.isMirrorHeight = false;
        this.rotateSelectionService.angle = 0;

        this.drawingService.clearCanvas(selectionCtx);
        selectionCtx.canvas.width = this.drawingService.canvas.width;
        selectionCtx.canvas.height = this.drawingService.canvas.height;
        selectionCtx.canvas.style.left = '0px';
        selectionCtx.canvas.style.top = '0px';
        selectionCtx.canvas.style.cursor = '';
        this.shiftDown = false;
    }

    draw(): void {
        this.computePositiveRectangleValues();
        this.drawSelectionBox(this.positiveStartingPos, this.positiveWidth, this.positiveHeight);
    }

    drawSelectionBox(position: Vec2, width: number, height: number): void {
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
        if (this.resizeSelectionService.isResizing) return;
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
        if (!this.isAreaSelected) return;
        this.clipboardImage = {
            image: new ImageData(this.selectionImageData.width, this.selectionImageData.height),
            selectionType: this.currentType,
        };
        const dataCopy = new Uint8ClampedArray(this.selectionImageData.data);
        this.clipboardImage.image.data.set(dataCopy);
    }

    pasteSelection(): void {
        // TODO make this better
        if (!this.clipboardImage) return;

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

    cutSelection(): void {
        this.copySelection();
        this.deleteSelection();
    }

    deleteSelection(): void {
        this.deletePressed = true;
        for (let i = 0; i < this.selectionImageData.data.length; i++) {
            this.selectionImageData.data[i] = 0;
        }
        this.executedCommand.emit(this.clone());
        this.resetSelection();
    }

    resize(event: MouseEvent): void {
        if (!this.resizeSelectionService.isResizing) return;
        let image = this.selectionImageData;
        if (this.rotateSelectionService.angle !== 0) {
            // this.rotateSelectionService.rotateImage(this.selectionImageData);
            image = this.rotateSelectionService.rotatedImage.image;
        }
        this.positiveStartingPos = this.resizeSelectionService.onResize(event, this.positiveStartingPos);
        this.positiveWidth = this.drawingService.previewCtx.canvas.width;
        this.positiveHeight = this.drawingService.previewCtx.canvas.height;
        if (this.shiftDown) this.resizeSelectionService.scaleImageKeepRatio(image);
        else this.resizeSelectionService.scaleImage(image);
        this.moveSelectionService.finalPosition = this.positiveStartingPos;
        this.rotateSelectionService.originalWidth = this.drawingService.previewCtx.canvas.width;
        this.rotateSelectionService.originalHeight = this.drawingService.previewCtx.canvas.height;
        this.rotateSelectionService.originalOffsetLeft = this.positiveStartingPos.x;
        this.rotateSelectionService.originalOffsetTop = this.positiveStartingPos.y;
    }

    isClipboardEmpty(): boolean {
        return this.clipboardImage === undefined;
    }

    clone(): SelectionService {
        const selectionClone: SelectionService = new SelectionService(
            this.drawingService,
            new MoveSelectionService(this.drawingService, this.gridService),
            this.resizeSelectionService,
            this.rotateSelectionService,
            new MagicWandService(this.drawingService),
            this.gridService,
            this.magnetismService,
        );
        this.copySelectionService(selectionClone);
        return selectionClone;
    }

    execute(): void {
        this.moveSelectionService.copySelection(this.positiveStartingPos, this.positiveWidth, this.positiveHeight, this.currentType);
        this.resetSelection();
    }
}
