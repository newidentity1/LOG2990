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
import { EllipseService } from '@app/services/tools/ellipse/ellipse.service';

// TODO: Refactor with ellipse select, too much duplicate code
@Injectable({
    providedIn: 'root',
})
export class EllipseSelectService extends EllipseService {
    private positiveStartingPos: Vec2;
    private positiveWidth: number;
    private positiveHeight: number;
    private isAreaSelected: boolean;
    private isInSelection: boolean;
    private isOnControlPoint: boolean;

    private resizers: string[] = ['nwse-resize', 'ns-resize', 'nesw-resize', 'ew-resize', '', 'ew-resize', 'nesw-resize', 'ns-resize', 'nwse-resize'];

    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.name = 'Ellipse Select';
        this.tooltip = 'Selection par ellipse(s)';
        this.iconName = 'filter_tilt_shift';
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
        if (!this.mouseDown && this.isAreaSelected) {
            this.updateCursor();
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            this.computeDimensions();
            const mouseUpPosition = this.getPositionFromMouse(event);
            if (mouseUpPosition.x !== this.mouseDownCoord.x || mouseUpPosition.y !== this.mouseDownCoord.y) {
                this.isAreaSelected = true;
                this.computePositiveRectangleValues();
                this.drawControlPoints(this.drawingService.previewCtx);
            }
        }
        this.mouseDown = false;
    }

    drawEllipse(ctx: CanvasRenderingContext2D): void {
        const radius: Vec2 = { x: this.width / 2, y: this.height / 2 };
        // const ellipseProperties = this.toolProperties as BasicShapeProperties;
        const dx = 0;
        const dy = 0;

        ctx.beginPath();
        ctx.ellipse(this.pathStart.x + radius.x, this.pathStart.y + radius.y, Math.abs(radius.x - dx), Math.abs(radius.y - dy), 0, 0, 2 * Math.PI);
        this.drawingService.setColor(new Color(WHITE).toStringRGBA());
        ctx.stroke();

        this.drawingService.previewCtx.setLineDash([DASHED_SEGMENTS]);
        this.drawingService.setColor(new Color(BLACK).toStringRGBA());
        ctx.stroke();
        this.drawingService.previewCtx.setLineDash([]);

        this.drawBoxGuide(ctx);
    }

    private drawControlPoints(ctx: CanvasRenderingContext2D): void {
        for (let i = 0; i <= 2; i++) {
            for (let j = 0; j <= 2; j++) {
                if (i !== 1 || j !== 1) {
                    ctx.beginPath();
                    this.drawingService.previewCtx.rect(
                        this.pathStart.x + (this.width * i) / 2 - SELECTION_CONTROL_POINT_SIZE / 2,
                        this.pathStart.y + (this.height * j) / 2 - SELECTION_CONTROL_POINT_SIZE / 2,
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
        this.positiveStartingPos.x = this.width >= 0 ? this.pathStart.x : this.pathStart.x + this.width;
        this.positiveWidth = Math.abs(this.width);

        this.positiveStartingPos.y = this.height >= 0 ? this.pathStart.y : this.pathStart.y + this.height;
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
