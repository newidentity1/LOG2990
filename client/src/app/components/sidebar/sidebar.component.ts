import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Tool } from '@app/classes/tool/tool';
import { CreateNewDrawingComponent } from '@app/components/create-new-drawing/create-new-drawing.component';
import { ExportComponent } from '@app/components/export/export.component';
import { ToolbarService } from '@app/services/toolbar/toolbar.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
    tools: Tool[];
    @ViewChild('toolProperties') sidenavProperties: MatSidenav;
    @ViewChild(CreateNewDrawingComponent) newDrawingRef: CreateNewDrawingComponent;
    @ViewChild(ExportComponent) exportRef: ExportComponent;

    constructor(protected toolbarService: ToolbarService) {
        this.tools = toolbarService.getTools();
    }

    isCurrentTool(tool: Tool): boolean {
        return tool === this.currentTool;
    }

    onToolChanged(tool: Tool): void {
        if (tool !== this.currentTool) {
            this.toolbarService.changeTool(tool);
            this.sidenavProperties.open();
        } else {
            this.sidenavProperties.toggle();
        }
    }

    createNewDrawing(): void {
        this.newDrawingRef.createNewDrawing();
    }

    exportDrawing(): void {
        this.exportRef.exportDrawing();
    }

    get currentTool(): Tool {
        return this.toolbarService.currentTool;
    }
}
