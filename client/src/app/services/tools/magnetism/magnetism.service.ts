import { Injectable } from '@angular/core';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { GridService } from '@app/services/tools/grid/grid.service';
import { MoveSelectionService } from '@app/services/tools/selection/move-selection/move-selection.service';
import { SelectionService } from '@app/services/tools/selection/selection.service';

@Injectable({
    providedIn: 'root',
})
export class MagnetismService extends SelectionService {
    // private grid: GridService;
    constructor(drawingService: DrawingService, protected moveSelectionService: MoveSelectionService) {
        super(drawingService, moveSelectionService);
    }

    onMouseMove(event: MouseEvent): void {
        console.log('bon mouse moove');
        this.currentMousePosition = this.getPositionFromMouse(event);
        if (this.mouseDown) {
            if (this.isAreaSelected) {
                const moveX = this.moveSelectionPos.x - event.clientX;
                const moveY = this.moveSelectionPos.y - event.clientY;
                this.moveSelectionPos.x = event.clientX;
                this.moveSelectionPos.y = event.clientY;
                this.moveSelectionService.moveSelection(this.calculPosition(moveX), this.calculPosition(moveY));
                this.drawSelectionBox({ x: 0, y: 0 }, this.positiveWidth, this.positiveHeight);
            } else {
                this.drawPreview();
            }
        }
    }

    private calculPosition(position: number): number {
        position = position - (position % GridService.dx);
        return position;
    }
}
