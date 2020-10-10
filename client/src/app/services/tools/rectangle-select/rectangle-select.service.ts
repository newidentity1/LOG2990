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

@Injectable({
    providedIn: 'root',
})
export class RectangleSelectService extends RectangleService {
    private positiveStartingPos: Vec2;
    private positiveWidth: number;
    private positiveHeight: number;
    private isAreaSelected: boolean;

    private resizers: string[] = ['nwse-resize', 'ns-resize', 'nesw-resize', 'ew-resize', '', 'ew-resize', 'nesw-resize', 'ns-resize', 'nwse-resize'];

    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.name = 'Rectangle Select';
        this.tooltip = 'Selection par rectangle(r)';
        this.iconName = 'highlight_alt';
        this.isAreaSelected = false;
        this.positiveStartingPos = { x: 0, y: 0 };
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDownCoord = this.getPositionFromMouse(event);
        if (this.isAreaSelected && (this.isInSelection(this.mouseDownCoord) || this.isOnControlPoint(this.mouseDownCoord))) {
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
        if (!this.mouseDown && this.isAreaSelected) {
            if (this.isOnControlPoint(this.currentMousePosition)) {
                // this.drawingService.previewCtx.canvas.style.cursor = 'ew-resize';
            } else if (this.isInSelection(this.currentMousePosition)) {
                this.drawingService.previewCtx.canvas.style.cursor = 'move';
            }
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            const mouseUpPosition = this.getPositionFromMouse(event);
            if (mouseUpPosition.x !== this.mouseDownCoord.x || mouseUpPosition.y !== this.mouseDownCoord.y) {
                this.isAreaSelected = true;
                this.computePositiveRectangleValues();
                this.drawControlPoints(this.drawingService.previewCtx);
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

    private isInSelection(position: Vec2): boolean {
        const inSelection =
            position.x > this.positiveStartingPos.x &&
            position.x < this.positiveStartingPos.x + this.positiveWidth &&
            position.y > this.positiveStartingPos.y &&
            position.y < this.positiveStartingPos.y + this.positiveHeight;

        this.drawingService.previewCtx.canvas.style.cursor = inSelection ? 'move' : '';
        return inSelection;
    }

    private isOnControlPoint(position: Vec2): boolean {
        let onControlPoint = false;

        for (let i = 0; i < SELECTION_CONTROL_COLUMNS; i++) {
            for (let j = 0; j < SELECTION_CONTROL_COLUMNS; j++) {
                if (i !== 1 || j !== 1) {
                    if (
                        position.x >= this.positiveStartingPos.x + (this.positiveWidth * i) / 2 - SELECTION_CONTROL_POINT_SIZE &&
                        position.x <= this.positiveStartingPos.x + (this.positiveWidth * i) / 2 + SELECTION_CONTROL_POINT_SIZE &&
                        position.y >= this.positiveStartingPos.y + (this.positiveHeight * j) / 2 - SELECTION_CONTROL_POINT_SIZE &&
                        position.y <= this.positiveStartingPos.y + (this.positiveHeight * j) / 2 + SELECTION_CONTROL_POINT_SIZE
                    ) {
                        this.drawingService.previewCtx.canvas.style.cursor = this.resizers[i + j * SELECTION_CONTROL_COLUMNS];
                        onControlPoint = true;
                    }
                }
            }
        }

        return onControlPoint;
    }

    private computePositiveRectangleValues(): void {
        this.positiveStartingPos.x = this.width >= 0 ? this.startingX : this.startingX + this.width;
        this.positiveWidth = Math.abs(this.width);

        this.positiveStartingPos.y = this.height >= 0 ? this.startingY : this.startingY + this.height;
        this.positiveHeight = Math.abs(this.height);
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
