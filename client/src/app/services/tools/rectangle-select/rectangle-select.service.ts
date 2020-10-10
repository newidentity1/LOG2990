import { Injectable } from '@angular/core';
import { Color } from '@app/classes/color/color';
import { Vec2 } from '@app/classes/vec2';
import {
    BLACK,
    DASHED_SEGMENTS,
    SELECTION_BOX_THICKNESS,
    SELECTION_CONTROL_COLUMNS,
    SELECTION_CONTROL_POINT_SIZE,
    WHITE,
} from '@app/constants/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { RectangleService } from '@app/services/tools/rectangle/rectangle.service';

// TODO: Refactor with ellipse select, too much duplicate code
@Injectable({
    providedIn: 'root',
})
export class RectangleSelectService extends RectangleService {
    private positiveStartingPos: Vec2;
    private positiveWidth: number;
    private positiveHeight: number;
    private isAreaSelected: boolean;
    private isInSelection: boolean;
    private isOnControlPoint: boolean;

    private resizers: string[] = ['nwse-resize', 'ns-resize', 'nesw-resize', 'ew-resize', '', 'ew-resize', 'nesw-resize', 'ns-resize', 'nwse-resize'];

    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.name = 'Rectangle Select';
        this.tooltip = 'Selection par rectangle(r)';
        this.iconName = 'highlight_alt';
        this.isAreaSelected = false;
        this.positiveStartingPos = { x: 0, y: 0 };
        this.isInSelection = false;
        this.isOnControlPoint = false;
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDownCoord = this.getPositionFromMouse(event);
        if (this.isAreaSelected && (this.isInSelection || this.isOnControlPoint)) {
            // TODO: move selection and resize
        } else {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.isAreaSelected = false;
            super.onMouseDown(event);
        }
    }

    onMouseMove(event: MouseEvent): void {
        super.onMouseMove(event);
        this.drawingService.previewCtx.canvas.style.cursor = '';
        console.log(this.mouseDown, this.isAreaSelected);
        if (!this.mouseDown && this.isAreaSelected) {
            this.updateCursor();
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            const mouseUpPosition = this.getPositionFromMouse(event);
            if (mouseUpPosition.x !== this.mouseDownCoord.x || mouseUpPosition.y !== this.mouseDownCoord.y) {
                this.drawSelectedArea();
            }
        }
        this.mouseDown = false;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        if (this.shiftDown) {
            const square: Vec2 = this.transformToSquare(this.width, this.height);
            this.width = square.x;
            this.height = square.y;
        }
        this.drawingService.clearCanvas(this.drawingService.previewCtx);

        this.drawingService.setColor(new Color(WHITE).toStringRGBA());
        this.drawStrokeRect(this.drawingService.previewCtx, this.width, this.height);

        this.drawingService.previewCtx.setLineDash([DASHED_SEGMENTS]);
        this.drawingService.setColor(new Color(BLACK).toStringRGBA());
        this.drawStrokeRect(this.drawingService.previewCtx, this.width, this.height);
        this.drawingService.previewCtx.setLineDash([]);
    }

    selectAll(): void {
        this.startingX = 0;
        this.startingY = 0;
        this.width = this.drawingService.canvas.width;
        this.height = this.drawingService.canvas.height;
        this.drawSelectedArea();
    }

    private drawSelectedArea(): void {
        this.draw(this.drawingService.previewCtx);
        this.drawControlPoints(this.drawingService.previewCtx);
        this.computePositiveRectangleValues();
        this.isAreaSelected = true;
    }

    private drawControlPoints(ctx: CanvasRenderingContext2D): void {
        for (let i = 0; i <= 2; i++) {
            for (let j = 0; j <= 2; j++) {
                if (i !== 1 || j !== 1) {
                    ctx.beginPath();
                    this.drawingService.previewCtx.rect(
                        this.startingX + (this.width * i) / 2 - SELECTION_CONTROL_POINT_SIZE / 2,
                        this.startingY + (this.height * j) / 2 - SELECTION_CONTROL_POINT_SIZE / 2,
                        SELECTION_CONTROL_POINT_SIZE,
                        SELECTION_CONTROL_POINT_SIZE,
                    );

                    this.drawingService.setColor(new Color(WHITE).toStringRGBA());
                    ctx.stroke();
                    this.drawingService.setColor(new Color(BLACK).toStringRGBA());
                    ctx.fill();
                }
            }
        }
    }

    private CheckIsInSelection(): void {
        this.isInSelection =
            this.currentMousePosition.x > this.positiveStartingPos.x &&
            this.currentMousePosition.x < this.positiveStartingPos.x + this.positiveWidth &&
            this.currentMousePosition.y > this.positiveStartingPos.y &&
            this.currentMousePosition.y < this.positiveStartingPos.y + this.positiveHeight;

        this.drawingService.previewCtx.canvas.style.cursor = this.isInSelection ? 'move' : '';
    }

    private CheckIsOnControlPoint(): void {
        this.isOnControlPoint = false;
        for (let i = 0; i < SELECTION_CONTROL_COLUMNS; i++) {
            for (let j = 0; j < SELECTION_CONTROL_COLUMNS; j++) {
                if (i !== 1 || j !== 1) {
                    if (
                        this.currentMousePosition.x >= this.positiveStartingPos.x + (this.positiveWidth * i) / 2 - SELECTION_CONTROL_POINT_SIZE &&
                        this.currentMousePosition.x <= this.positiveStartingPos.x + (this.positiveWidth * i) / 2 + SELECTION_CONTROL_POINT_SIZE &&
                        this.currentMousePosition.y >= this.positiveStartingPos.y + (this.positiveHeight * j) / 2 - SELECTION_CONTROL_POINT_SIZE &&
                        this.currentMousePosition.y <= this.positiveStartingPos.y + (this.positiveHeight * j) / 2 + SELECTION_CONTROL_POINT_SIZE
                    ) {
                        this.drawingService.previewCtx.canvas.style.cursor = this.resizers[i + j * SELECTION_CONTROL_COLUMNS];
                        this.isOnControlPoint = true;
                    }
                }
            }
        }
    }

    private computePositiveRectangleValues(): void {
        this.positiveStartingPos.x = this.width >= 0 ? this.startingX : this.startingX + this.width;
        this.positiveWidth = Math.abs(this.width);

        this.positiveStartingPos.y = this.height >= 0 ? this.startingY : this.startingY + this.height;
        this.positiveHeight = Math.abs(this.height);
    }

    private updateCursor(): void {
        this.CheckIsInSelection();
        this.CheckIsOnControlPoint();
    }

    resetContext(): void {
        this.mouseDown = false;
        this.shiftDown = false;
        // this.escapeDown = false;
        this.isAreaSelected = false;
        this.drawingService.setThickness(SELECTION_BOX_THICKNESS);
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
    }
}
