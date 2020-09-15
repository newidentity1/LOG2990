import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { PencilService } from '@app/services/tools/pencil/pencil-service';
import { RectangleService } from '@app/services/tools/rectangle/rectangle.service';

@Injectable({
    providedIn: 'root',
})
export class ToolbarService {
    private tools: Tool[];
    currentTool: Tool;

    constructor(protected pencilService: PencilService, protected rectangleService: RectangleService) {
        this.tools = [pencilService, rectangleService];
        this.currentTool = this.tools[0];
    }

    getTools(): Tool[] {
        return this.tools;
    }
}
