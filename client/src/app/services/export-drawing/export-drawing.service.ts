import { Injectable } from '@angular/core';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class ExportDrawingService {
    constructor(public drawingService: DrawingService) {}

    getCanvasImageUrl(format: string): string {
        return this.drawingService.canvas.toDataURL('image/' + format);
    }
}
