import { Component, HostListener, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
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
    @ViewChild('toolProperties') sidenavProperties: MatSidenav;

    constructor(protected toolbarService: ToolbarService) {
        this.tools = toolbarService.getTools();
        this.currentTool = toolbarService.currentTool;
    }

    isCurrentTool(tool: Tool): boolean {
        return tool === this.currentTool;
    }

    onToolChanged(tool: Tool): void {
        if (tool !== this.currentTool) {
            if (this.currentTool.toolProperties)
                // TODO: enlever le if quand tous les outils auront leurs proprietes
                this.currentTool.toolProperties.resetProperties();
            this.currentTool = tool;
            this.toolbarService.currentTool = tool;
            this.sidenavProperties.open();
        } else {
            this.sidenavProperties.toggle();
        }
    }

    @HostListener('keydown', ['$event'])
    onKeyDown(event: KeyboardEvent): void {
        this.toolbarService.currentTool.onKeyDown(event);
        // Send the event to toolbar
        this.toolbarService.onKeyDown(event);
    }

    @HostListener('keypress', ['$event'])
    onKeyPress(event: KeyboardEvent): void {
        this.toolbarService.currentTool.onKeyPress(event);
    }

    @HostListener('keyup', ['$event'])
    onKeyUp(event: KeyboardEvent): void {
        this.toolbarService.currentTool.onKeyUp(event);
    }
}
