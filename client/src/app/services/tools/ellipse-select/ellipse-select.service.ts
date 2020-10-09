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

@Injectable({
    providedIn: 'root',
})
export class EllipseSelectService extends EllipseService {
    isAreaSelected: boolean;

    private resizers: string[] = ['nwse-resize', 'ns-resize', 'nesw-resize', 'ew-resize', '', 'ew-resize', 'nesw-resize', 'ns-resize', 'nwse-resize'];

    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.name = 'Ellipse Select';
        this.tooltip = 'Selection par ellipse(s)';
        this.iconName = 'filter_tilt_shift';
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
            this.computeDimensions();
            const mouseUpPosition = this.getPositionFromMouse(event);
            if (mouseUpPosition.x !== this.mouseDownCoord.x || mouseUpPosition.y !== this.mouseDownCoord.y) {
                this.isAreaSelected = true;
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

    private isInSelection(position: Vec2): boolean {
        let inWidth = false;
        let inHeight = false;
        if (this.width >= 0) {
            inWidth = position.x > this.pathStart.x && position.x < this.pathStart.x + this.width;
        } else {
            inWidth = position.x < this.pathStart.x && position.x > this.pathStart.x + this.width;
        }

        if (this.height >= 0) {
            inHeight = position.y > this.pathStart.y && position.y < this.pathStart.y + this.height;
        } else {
            inHeight = position.y < this.pathStart.y && position.y > this.pathStart.y + this.height;
        }
        return inWidth && inHeight;
    }

    private isOnControlPoint(position: Vec2): boolean {
        let onControlPoint = false;

        for (let i = 0; i < SELECTION_CONTROL_COLUMNS; i++) {
            for (let j = 0; j < SELECTION_CONTROL_COLUMNS; j++) {
                if (i !== 1 || j !== 1) {
                    if (
                        position.x >= this.pathStart.x + (this.width * i) / 2 - SELECTION_CONTROL_POINT_SIZE &&
                        position.x <= this.pathStart.x + (this.width * i) / 2 + SELECTION_CONTROL_POINT_SIZE &&
                        position.y >= this.pathStart.y + (this.height * j) / 2 - SELECTION_CONTROL_POINT_SIZE &&
                        position.y <= this.pathStart.y + (this.height * j) / 2 + SELECTION_CONTROL_POINT_SIZE
                    ) {
                        this.drawingService.previewCtx.canvas.style.cursor = this.resizers[i + j * SELECTION_CONTROL_COLUMNS];
                        onControlPoint = true;
                    }
                }
            }
        }

        return onControlPoint;
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
