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

    constructor(toolbarService: ToolbarService) {
        this.tools = toolbarService.getTools();
    }
}
