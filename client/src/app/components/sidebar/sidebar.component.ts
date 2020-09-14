import { Component } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { ToolbarService } from '@app/services/toolbar/toolbar.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
    tools: Tool[];
    currentTool: Tool;

    constructor(protected toolbarService: ToolbarService) {
        this.tools = toolbarService.getTools();
        this.currentTool = toolbarService.currentTool;
    }

    isCurrentTool(tool: Tool): boolean {
        return tool === this.currentTool;
    }

    onToolChanged(tool: Tool): void {
        if (tool !== this.currentTool) {
            this.currentTool = tool;
            this.toolbarService.currentTool = tool;
        }
    }
}
