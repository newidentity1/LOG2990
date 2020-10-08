import { Injectable } from '@angular/core';
import { Color } from '@app/classes/color/color';
import { Vec2 } from '@app/classes/vec2';
import { BLACK, DASHED_SEGMENTS, SELECTION_CONTROL_POINT_SIZE, WHITE } from '@app/constants/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { RectangleService } from '@app/services/tools/rectangle/rectangle.service';

@Injectable({
    providedIn: 'root',
})
export class RectangleSelectService extends RectangleService {
    isAreaSelected: boolean;

    private resizers: string[] = ['nwse-resize', 'ns-resize', 'nesw-resize', 'ew-resize', '', 'ew-resize', 'nesw-resize', 'ns-resize', 'nwse-resize'];

    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.name = 'Rectangle Select';
        this.tooltip = 'Selection par rectangle(r)';
        this.iconName = 'highlight_alt';
        this.isAreaSelected = false;
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDownCoord = this.getPositionFromMouse(event);
        if (this.isPositionInSelection(this.mouseDownCoord) || this.isOnControlPoint(this.mouseDownCoord)) {
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
            } else if (this.isPositionInSelection(this.currentMousePosition)) {
                this.drawingService.previewCtx.canvas.style.cursor = 'move';
            }
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            const mouseUpPosition = this.getPositionFromMouse(event);
            if (mouseUpPosition.x !== this.mouseDownCoord.x || mouseUpPosition.y !== this.mouseDownCoord.y) {
                this.isAreaSelected = true;
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
                    this.drawingService.previewCtx.fillRect(
                        this.startingX + (this.width * i) / 2 - SELECTION_CONTROL_POINT_SIZE / 2,
                        this.startingY + (this.height * j) / 2 - SELECTION_CONTROL_POINT_SIZE / 2,
                        SELECTION_CONTROL_POINT_SIZE,
                        SELECTION_CONTROL_POINT_SIZE,
                    );
                }
            }
        }
    }

    private isPositionInSelection(position: Vec2): boolean {
        let inWidth = false;
        let inHeight = false;
        if (this.width >= 0) {
            inWidth = position.x > this.startingX && position.x < this.startingX + this.width;
        } else {
            inWidth = position.x < this.startingX && position.x > this.startingX + this.width;
        }

        if (this.height >= 0) {
            inHeight = position.y > this.startingY && position.y < this.startingY + this.height;
        } else {
            inHeight = position.y < this.startingY && position.y > this.startingY + this.height;
        }
        return inWidth && inHeight;
    }

    private isOnControlPoint(position: Vec2): boolean {
        let onControlPoint = false;

        for (let i = 0; i <= 2; i++) {
            for (let j = 0; j <= 2; j++) {
                if (i !== 1 || j !== 1) {
                    if (
                        position.x >= this.startingX + (this.width * i) / 2 - SELECTION_CONTROL_POINT_SIZE &&
                        position.x <= this.startingX + (this.width * i) / 2 + SELECTION_CONTROL_POINT_SIZE &&
                        position.y >= this.startingY + (this.height * j) / 2 - SELECTION_CONTROL_POINT_SIZE &&
                        position.y <= this.startingY + (this.height * j) / 2 + SELECTION_CONTROL_POINT_SIZE
                    ) {
                        console.log(i + j * 3);
                        console.log(this.resizers[i + j]);
                        this.drawingService.previewCtx.canvas.style.cursor = this.resizers[i + j * 3];
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
        this.drawingService.setThickness(2);
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
    }
}
