import { Injectable } from '@angular/core';
import { ClipboardImage } from '@app/classes/clipboard-image';
import { ShapeTool } from '@app/classes/tool/shape-tool';
import { BasicShapeProperties } from '@app/classes/tools-properties/basic-shape-properties';
import { Vec2 } from '@app/classes/vec2';
import * as CONSTANTS from '@app/constants/constants';
import { MouseButton } from '@app/enums/mouse-button.enum';
import { SelectionAction } from '@app/enums/selection-action.enum';
import { SelectionType } from '@app/enums/selection-type.enum';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { GridService } from '@app/services/tools/grid/grid.service';
import { MagnetismService } from '@app/services/tools/selection/magnetism/magnetism.service';
import { MagicWandService } from './magic-wand/magic-wand.service';
import { MoveSelectionService } from './move-selection/move-selection.service';
import { ResizeSelectionService } from './resize-selection/resize-selection.service';
import { RotateSelectionService } from './rotate-selection/rotate-selection.service';
// tslint:disable:max-file-line-count
@Injectable({
    providedIn: 'root',
})
export class SelectionService extends ShapeTool {
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
    activeMagnet: boolean = false;
    currentType: SelectionType = SelectionType.RectangleSelection;
    isAreaSelected: boolean = false;
    private positiveStartingPos: Vec2 = { x: 0, y: 0 };
    private positiveWidth: number;
    private positiveHeight: number;
    private selectionImageData: ImageData;
    private clipboardImage: ClipboardImage;
    private moveSelectionPos: Vec2 = { x: 0, y: 0 };
    private atlDown: boolean = false;
    private lastAction: SelectionAction = SelectionAction.None;
    private deletePressed: boolean = false;

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
        if (!this.mouseDown || !this.isAreaSelected || this.resizeSelectionService.isResizing()) return;
        this.moveSelectionPos = { x: event.clientX, y: event.clientY };
        if (this.lastAction === SelectionAction.Resize) this.moveSelectionService.imgData = this.resizeSelectionService.scaledImage;
        else if (this.lastAction === SelectionAction.Rotate) this.moveSelectionService.imgData = this.rotateSelectionService.rotatedImage.image;
    }

    magneticMove(x: number, y: number): void {
        const position: Vec2 = this.magnetismService.magneticOption(
            {
                x: x - this.drawingService.baseCtx.canvas.getBoundingClientRect().x,
                y: y - this.drawingService.baseCtx.canvas.getBoundingClientRect().y,
            },
            this.positiveWidth,
            this.positiveHeight,
        );
        const moveX = position.x;
        const moveY = position.y;
        this.moveSelectionPos.x = moveX;
        this.moveSelectionPos.y = moveY;
        this.moveSelectionService.moveSelectionMagnetic(moveX, moveY);
    }

    onMouseMove(event: MouseEvent): void {
        this.currentMousePosition = this.getPositionFromMouse(event);
        if (!this.mouseDown) return;
        if (!this.isAreaSelected || this.resizeSelectionService.isResizing()) {
            if (this.currentType !== SelectionType.MagicWandSelection) this.drawPreview();
            return;
        }
        if (this.activeMagnet) {
            this.magneticMove(event.clientX, event.clientY);
        } else {
            const moveX = this.moveSelectionPos.x - event.clientX;
            const moveY = this.moveSelectionPos.y - event.clientY;
            this.moveSelectionPos.x = event.clientX;
            this.moveSelectionPos.y = event.clientY;
            this.moveSelectionService.moveSelection(moveX, moveY);
        }
        this.rotateSelectionService.originalOffsetLeft = this.moveSelectionService.finalPosition.x + this.rotateSelectionService.leftOffset;
        this.rotateSelectionService.originalOffsetTop = this.moveSelectionService.finalPosition.y + this.rotateSelectionService.topOffset;
        this.drawSelectionBox({ x: 0, y: 0 }, this.drawingService.previewCtx.canvas.width, this.drawingService.previewCtx.canvas.height);
    }

    onMouseUp(event: MouseEvent): void {
        if (!this.mouseDown || this.isAreaSelected) {
            this.mouseDown = false;
            return;
        }
        this.currentMousePosition = this.getPositionFromMouse(event);
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        const didMove = this.currentMousePosition.x !== this.mouseDownCoord.x || this.currentMousePosition.y !== this.mouseDownCoord.y;
        if (didMove && this.width && this.height) {
            this.isAreaSelected = true;
            this.moveSelectionService.setFinalPosition(this.positiveStartingPos);
            this.moveSelectionService.copySelection(this.positiveStartingPos, this.positiveWidth, this.positiveHeight, this.currentType);
            this.selectionImageData = this.moveSelectionService.imgData;
            this.drawSelectionBox({ x: 0, y: 0 }, this.positiveWidth, this.positiveHeight);
            this.rotateSelectionService.initializeRotation();
        }
        this.mouseDown = false;
    }

    onClick(event: MouseEvent): void {
        if (this.currentType !== SelectionType.MagicWandSelection || this.isAreaSelected) return;
        this.currentMousePosition = this.getPositionFromMouse(event);
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.magicWandService.copyMagicSelection(this.currentMousePosition, true);
        this.initializeMagicWandSelectionProperties();
    }

    onContextMenu(event: MouseEvent): void {
        if (this.currentType !== SelectionType.MagicWandSelection || this.isAreaSelected) return;
        this.currentMousePosition = this.getPositionFromMouse(event);
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.magicWandService.copyMagicSelection(this.currentMousePosition, false);
        this.initializeMagicWandSelectionProperties();
    }

    private initializeMagicWandSelectionProperties(): void {
        this.isAreaSelected = true;
        this.positiveStartingPos.x = this.drawingService.previewCtx.canvas.offsetLeft;
        this.positiveStartingPos.y = this.drawingService.previewCtx.canvas.offsetTop;
        this.positiveWidth = this.drawingService.previewCtx.canvas.width;
        this.positiveHeight = this.drawingService.previewCtx.canvas.height;
        this.moveSelectionService.setFinalPosition(this.magicWandService.startingPosition);
        this.moveSelectionService.imgData = this.magicWandService.imgData;
        this.selectionImageData = this.moveSelectionService.imgData;
        this.rotateSelectionService.initializeRotation();
    }

    onMouseScroll(event: WheelEvent): void {
        if (!this.isAreaSelected) return;

        let image = this.selectionImageData;
        if (this.resizeSelectionService.scaleX !== 1 || this.resizeSelectionService.scaleY !== 1) {
            image = this.resizeSelectionService.scaledImage;
        }
        this.rotateSelectionService.scroll(event, image, this.atlDown);
        this.moveSelectionService.setFinalPosition({
            x: this.drawingService.previewCtx.canvas.offsetLeft,
            y: this.drawingService.previewCtx.canvas.offsetTop,
        });
        this.drawSelectionBox({ x: 0, y: 0 }, this.drawingService.previewCtx.canvas.width, this.drawingService.previewCtx.canvas.height);
        this.lastAction = SelectionAction.Rotate;
    }

    onKeyDown(event: KeyboardEvent): void {
        if (event.key === 'Escape' && (this.mouseDown || this.isAreaSelected)) {
            this.drawSelection();
        }
        if (this.isAreaSelected) {
            if (this.activeMagnet) {
                this.magneticMoveKeyboard(event.key);
            } else if (this.moveSelectionService.checkArrowKeysPressed(event)) {
                this.drawSelectionBox({ x: 0, y: 0 }, this.positiveWidth, this.positiveHeight);
            }
        } else {
            super.onKeyDown(event);
            return;
        }
        switch (event.key) {
            case 'Delete':
                this.deleteSelection();
                break;
            case 'Shift':
                if (!this.shiftDown && this.resizeSelectionService.isResizing()) {
                    let image = this.selectionImageData;
                    if (this.rotateSelectionService.angle !== 0) {
                        image = this.rotateSelectionService.rotatedImage.image;
                    }
                    this.resizeSelectionService.scaleImageKeepRatio(image);
                    this.shiftDown = true;
                }
                break;
            case 'Alt':
                this.atlDown = true;
                break;
        }
    }

    magneticMoveKeyboard(key: string): void {
        let position: Vec2 = { x: 0, y: 0 };
        if (this.magnetismService.firstmove) {
            position.x = this.moveSelectionService.finalPosition.x + this.drawingService.baseCtx.canvas.getBoundingClientRect().x;
            position.y = this.moveSelectionService.finalPosition.y + this.drawingService.baseCtx.canvas.getBoundingClientRect().y;
            this.magneticMove(position.x, position.y);
        } else {
            position = this.magnetismService.moveKeyBord(key, this.moveSelectionService.finalPosition);
            this.moveSelectionService.moveSelectionMagnetic(position.x, position.y);
        }
    }

    onKeyUp(event: KeyboardEvent): void {
        if (!this.isAreaSelected) {
            super.onKeyUp(event);
            return;
        }
        this.moveSelectionService.checkArrowKeysReleased(event);
        if (event.key === 'Shift') {
            if (!this.resizeSelectionService.isResizing()) return;
            this.shiftDown = false;
            let image = this.selectionImageData;
            if (this.rotateSelectionService.angle !== 0) {
                image = this.rotateSelectionService.rotatedImage.image;
            }
            this.resizeSelectionService.scaleImage(image);
        } else if (event.key === 'Alt') {
            this.atlDown = false;
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
        this.rotateSelectionService.initializeRotation();
        this.drawSelectionBox({ x: 0, y: 0 }, this.positiveWidth, this.positiveHeight);
    }

    drawSelection(): void {
        if (!this.isAreaSelected) return;

        if (!this.deletePressed) {
            if (this.lastAction === SelectionAction.Resize) this.selectionImageData = this.resizeSelectionService.scaledImage;
            else if (this.lastAction === SelectionAction.Rotate) this.selectionImageData = this.rotateSelectionService.rotatedImage.image;
        }
        this.executedCommand.emit(this.clone());
        this.resetSelection();
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
        this.lastAction = SelectionAction.None;
        this.resizeSelectionService.scaleX = 1;
        this.resizeSelectionService.scaleY = 1;
        this.deletePressed = false;
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
        this.magnetismService.firstmove = true;
        if (this.resizeSelectionService.isResizing()) return;
        this.mouseDown = false;
        this.isAreaSelected = false;
        this.shiftDown = false;
        this.positiveStartingPos = { x: 0, y: 0 };
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
    }

    copySelection(): void {
        if (!this.isAreaSelected) return;
        let height = this.selectionImageData.height;
        let width = this.selectionImageData.width;
        let imgData = this.selectionImageData.data;

        if (this.lastAction === SelectionAction.Resize) {
            width = this.resizeSelectionService.scaledImage.width;
            height = this.resizeSelectionService.scaledImage.width;
            imgData = this.resizeSelectionService.scaledImage.data;
        } else if (this.lastAction === SelectionAction.Rotate) {
            width = this.rotateSelectionService.rotatedImage.image.width;
            height = this.rotateSelectionService.rotatedImage.image.height;
            imgData = this.rotateSelectionService.rotatedImage.image.data;
        }

        this.clipboardImage = {
            image: new ImageData(width, height),
            selectionType: this.currentType,
        };
        const dataCopy = new Uint8ClampedArray(imgData);
        this.clipboardImage.image.data.set(dataCopy);
    }

    pasteSelection(): void {
        if (!this.clipboardImage) return;

        this.setSelectionType(this.clipboardImage.selectionType);
        this.isAreaSelected = true;

        this.selectionImageData = new ImageData(this.clipboardImage.image.width, this.clipboardImage.image.height);
        const dataCopy = new Uint8ClampedArray(this.clipboardImage.image.data);
        this.selectionImageData.data.set(dataCopy);
        this.moveSelectionService.imgData = this.selectionImageData;

        this.drawingService.previewCtx.canvas.width = this.clipboardImage.image.width;
        this.drawingService.previewCtx.canvas.height = this.clipboardImage.image.height;
        this.positiveWidth = this.clipboardImage.image.width;
        this.positiveHeight = this.clipboardImage.image.height;
        this.drawingService.previewCtx.putImageData(this.clipboardImage.image, 0, 0);
        this.moveSelectionService.finalPosition.x = 0;
        this.moveSelectionService.finalPosition.y = 0;
        this.drawingService.previewCtx.canvas.style.cursor = 'move';
        this.rotateSelectionService.initializeRotation();
        this.drawSelectionBox({ x: 0, y: 0 }, this.clipboardImage.image.width, this.clipboardImage.image.height);
    }

    cutSelection(): void {
        this.copySelection();
        this.deleteSelection();
    }

    deleteSelection(): void {
        for (let i = 0; i < this.selectionImageData.data.length; i++) {
            this.selectionImageData.data[i] = 0;
        }

        this.deletePressed = true;
        this.executedCommand.emit(this.clone());
        this.resetSelection();
    }

    resize(event: MouseEvent): void {
        if (!this.resizeSelectionService.isResizing()) return;
        let image = this.selectionImageData;
        if (this.rotateSelectionService.angle !== 0) {
            image = this.rotateSelectionService.rotatedImage.image;
        }

        this.resizeSelectionService.onResize(event, this.moveSelectionService.finalPosition);
        if (this.shiftDown) this.resizeSelectionService.scaleImageKeepRatio(image);
        else this.resizeSelectionService.scaleImage(image);

        this.moveSelectionService.finalPosition.x = this.drawingService.previewCtx.canvas.offsetLeft;
        this.moveSelectionService.finalPosition.y = this.drawingService.previewCtx.canvas.offsetTop;
        this.rotateSelectionService.originalWidth = this.drawingService.previewCtx.canvas.width;
        this.rotateSelectionService.originalHeight = this.drawingService.previewCtx.canvas.height;
        this.rotateSelectionService.originalOffsetLeft = this.moveSelectionService.finalPosition.x;
        this.rotateSelectionService.originalOffsetTop = this.moveSelectionService.finalPosition.y;
        this.drawSelectionBox({ x: 0, y: 0 }, this.drawingService.previewCtx.canvas.width, this.drawingService.previewCtx.canvas.height);
        this.lastAction = SelectionAction.Resize;
    }

    isClipboardEmpty(): boolean {
        return this.clipboardImage === undefined;
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
        switch (this.lastAction) {
            case SelectionAction.None:
                selectionService.selectionImageData = this.selectionImageData;
                break;
            case SelectionAction.Rotate:
                selectionService.selectionImageData = this.rotateSelectionService.rotatedImage.image;
                break;
            case SelectionAction.Resize:
                selectionService.selectionImageData = this.resizeSelectionService.scaledImage;
                break;
        }
    }

    clone(): SelectionService {
        const selectionClone: SelectionService = new SelectionService(
            this.drawingService,
            new MoveSelectionService(this.drawingService),
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
        this.drawingService.previewCtx.canvas.width = this.selectionImageData.width;
        this.drawingService.previewCtx.canvas.height = this.selectionImageData.height;
        this.resetSelection();
    }
}
