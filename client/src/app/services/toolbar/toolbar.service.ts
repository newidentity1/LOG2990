import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { BrushService } from '@app/services/tools/brush/brush.service';
import { EllipseService } from '@app/services/tools/ellipse/ellipse.service';
import { PencilService } from '@app/services/tools/pencil/pencil-service';
import { RectangleService } from '@app/services/tools/rectangle/rectangle.service';

@Injectable({
    providedIn: 'root',
})
export class ToolbarService {
    private tools: Tool[];
    currentTool: Tool;

    constructor(
        protected pencilService: PencilService,
        protected brushService: BrushService,
        protected rectangleService: RectangleService,
        protected ellipseService: EllipseService,
    ) {
        this.tools = [pencilService, brushService, rectangleService, ellipseService];
        this.currentTool = this.tools[0];
    }

    getTools(): Tool[] {
        return this.tools;
    }
}
