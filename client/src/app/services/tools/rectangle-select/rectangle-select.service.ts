import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool/tool';
import { BasicShapeProperties } from '@app/classes/tools-properties/basic-shape-properties';
import { Vec2 } from '@app/classes/vec2';
import { DASHED_SEGMENTS, SELECTION_BOX_THICKNESS } from '@app/constants/constants';
import { DrawingType } from '@app/enums/drawing-type.enum';
import { MouseButton } from '@app/enums/mouse-button.enum';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { RectangleService } from '@app/services/tools/rectangle/rectangle.service';

// TODO: Refactor with ellipse select, too much duplicate code
@Injectable({
    providedIn: 'root',
})
export class RectangleSelectService extends Tool {
    isAreaSelected: boolean;
    private isMovingSelection: boolean;
    private positiveStartingPos: Vec2;
    private positiveWidth: number;
    private positiveHeight: number;
    private escapePressed: boolean;
    imgData: ImageData;

    constructor(drawingService: DrawingService, private rectangleService: RectangleService) {
        super(drawingService);
        this.name = 'Rectangle Select';
        this.tooltip = 'Selection par rectangle(r)';
        this.iconName = 'highlight_alt';
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        this.mouseDownCoord = this.getPositionFromMouse(event);
        if (this.mouseDown) {
            if (this.isAreaSelected) {
                // TODO : Handle move
                this.isMovingSelection = true;
            } else {
                this.isAreaSelected = false;
                this.rectangleService.onMouseDown(event);
                this.drawingService.previewCtx.setLineDash([DASHED_SEGMENTS]);
            }
        }
    }

    onMouseMove(event: MouseEvent): void {
        if (this.isMovingSelection) {
            // // TODO : Handle move
        } else {
            this.rectangleService.onMouseMove(event);
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            if (this.isMovingSelection) {
                this.isMovingSelection = false;
            } else {
                this.rectangleService.mouseDown = false;
                const mouseUpPosition = this.getPositionFromMouse(event);
                if (mouseUpPosition.x !== this.mouseDownCoord.x || mouseUpPosition.y !== this.mouseDownCoord.y) {
                    this.computePositiveRectangleValues();
                    this.drawSelectedArea();
                    this.escapePressed = false;
                }
            }
            this.drawingService.previewCtx.setLineDash([]);
            this.mouseDown = false;
        }
    }

    onKeyDown(event: KeyboardEvent): void {
        this.escapePressed = event.key === 'Escape';
        if (this.escapePressed) {
            this.resetSelection();
        }
        if (this.mouseDown) {
            this.rectangleService.onKeyDown(event);
        }
    }

    onKeyUp(event: KeyboardEvent): void {
        if (this.mouseDown) {
            this.rectangleService.onKeyUp(event);
        }
    }

    selectAll(): void {
        this.positiveStartingPos.x = 0;
        this.positiveStartingPos.y = 0;
        this.positiveWidth = this.drawingService.canvas.width;
        this.positiveHeight = this.drawingService.canvas.height;
        this.drawSelectedArea();
    }

    resetSelection(): void {
        if (this.isAreaSelected) {
            this.isAreaSelected = false;
            const selectionCtx = this.drawingService.previewCtx;
            this.imgData = selectionCtx.getImageData(0, 0, this.positiveWidth, this.positiveHeight);
            const canvasTopOffset = +selectionCtx.canvas.style.top.substring(0, selectionCtx.canvas.style.top.length - 2);
            const canvasLeftOffset = +selectionCtx.canvas.style.left.substring(0, selectionCtx.canvas.style.left.length - 2);
            this.drawingService.baseCtx.putImageData(this.imgData, canvasLeftOffset, canvasTopOffset, 0, 0, this.positiveWidth, this.positiveWidth);
            selectionCtx.canvas.width = this.drawingService.canvas.width;
            selectionCtx.canvas.height = this.drawingService.canvas.height;
            selectionCtx.canvas.style.left = '0px';
            selectionCtx.canvas.style.top = '0px';

            this.escapePressed = false;
            selectionCtx.canvas.style.cursor = '';
        }
    }

    private drawSelectedArea(): void {
        if (this.escapePressed) return;

        this.isAreaSelected = true;
        const selectionCtx = this.drawingService.previewCtx;

        selectionCtx.canvas.style.left = this.positiveStartingPos.x + 'px';
        selectionCtx.canvas.style.top = this.positiveStartingPos.y + 'px';
        selectionCtx.canvas.width = this.positiveWidth;
        selectionCtx.canvas.height = this.positiveHeight;
        this.imgData = this.drawingService.baseCtx.getImageData(
            this.positiveStartingPos.x,
            this.positiveStartingPos.y,
            this.positiveWidth,
            this.positiveHeight,
        );

        setTimeout(() => {
            selectionCtx.putImageData(this.imgData, 0, 0, 0, 0, this.positiveWidth, this.positiveWidth);
            this.drawingService.baseCtx.clearRect(this.positiveStartingPos.x, this.positiveStartingPos.y, this.positiveWidth, this.positiveHeight);
            selectionCtx.canvas.style.cursor = 'move';
        }, 0);
    }

    private computePositiveRectangleValues(): void {
        this.positiveStartingPos.x = this.rectangleService.width >= 0 ? this.mouseDownCoord.x : this.mouseDownCoord.x + this.rectangleService.width;
        this.positiveWidth = Math.abs(this.rectangleService.width);
        this.positiveStartingPos.y = this.rectangleService.height >= 0 ? this.mouseDownCoord.y : this.mouseDownCoord.y + this.rectangleService.height;
        this.positiveHeight = Math.abs(this.rectangleService.height);
    }

    resetContext(): void {
        this.isAreaSelected = false;
        this.escapePressed = false;
        this.isMovingSelection = false;
        this.positiveStartingPos = { x: 0, y: 0 };

        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.drawingService.setThickness(SELECTION_BOX_THICKNESS);
        const rectangleServiceProperties = this.rectangleService.toolProperties as BasicShapeProperties;
        rectangleServiceProperties.currentType = DrawingType.Stroke;
    }
}
