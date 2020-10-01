import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';
import { Tool } from '@app/classes/tool';
import { GuideComponent } from '@app/components/guide/guide.component';
import { ToolbarService } from '@app/services/toolbar/toolbar.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
    tools: Tool[];
    @ViewChild('toolProperties') sidenavProperties: MatSidenav;

    constructor(protected toolbarService: ToolbarService, private dialog: MatDialog) {
        this.tools = toolbarService.getTools();
    }

    isCurrentTool(tool: Tool): boolean {
        return tool === this.currentTool;
    }

    onToolChanged(tool: Tool): void {
        if (tool !== this.currentTool) {
            this.currentTool.resetContext();
            this.currentTool = tool;
            this.toolbarService.applyCurrentToolColor();
            this.sidenavProperties.open();
        } else {
            this.sidenavProperties.toggle();
        }
    }

    get currentTool(): Tool {
        return this.toolbarService.currentTool;
    }

    set currentTool(tool: Tool) {
        this.toolbarService.currentTool = tool;
    }

    openDialog(): void {
        this.dialog.open(GuideComponent, {
            height: '95%',
        });
    }
}
