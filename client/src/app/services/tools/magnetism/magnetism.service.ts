import { Injectable } from '@angular/core';
// import { DrawingService } from '@app/services/drawing/drawing.service';
// import { MoveSelectionService } from '@app/services/tools/selection/move-selection/move-selection.service';
// import { SelectionService } from '@app/services/tools/selection/selection.service';
// import { GridService } from '@app/services/tools/grid/grid.service';

@Injectable({
    providedIn: 'root',
})
export class MagnetismService {
    // private grid : GridService;
    constructor() {
        //
    }

    // onMouseMove(event: MouseEvent): void {
    //     this.currentMousePosition = this.getPositionFromMouse(event);
    //     if (this.mouseDown) {
    //         if (this.isAreaSelected) {
    //             const moveX = this.moveSelectionPos.x - event.clientX;
    //             const moveY = this.moveSelectionPos.y - event.clientY;
    //             this.moveSelectionPos.x = event.clientX;
    //             this.moveSelectionPos.y = event.clientY;
    //             this.moveSelectionService.moveSelection(moveX, moveY);
    //             this.drawSelectionBox({ x: 0, y: 0 }, this.positiveWidth, this.positiveHeight);
    //         } else {
    //             this.drawPreview();
    //         }
    //     }
    // }
}
