import { Injectable } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import { ControlPoint } from '@app/enums/control-point.enum';
import { ResizeService } from '@app/services/resize/resize.service';

@Injectable({
    providedIn: 'root',
})
export class ResizeSelectionService {
    newWidth: number;
    newHeight: number;
    newStartingPosition: number;

    constructor(private resizeService: ResizeService) {}

    onResize(event: MouseEvent, startingPoint: Vec2): void {
        // const currentSizePreview = this.resizeService.currentPreviewCanvasSize;
    }

    get isResizing(): boolean {
        return this.resizeService.isResizing;
    }

    get controlPoint(): ControlPoint | null {
        return this.resizeService.controlPoint;
    }
}
