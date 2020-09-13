import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { PencilService } from '../tools/pencil-service';

@Injectable({
    providedIn: 'root',
})
export class ToolbarService {
    private tools: Tool[];
    currentTool: Tool;

    constructor(pencilService: PencilService) {
        this.tools = [pencilService];
        this.currentTool = this.tools[0];
    }

    getTools(): Tool[] {
        return this.tools;
    }
}
