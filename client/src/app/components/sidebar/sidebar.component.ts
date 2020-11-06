import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Tool } from '@app/classes/tool/tool';
import { CreateNewDrawingComponent } from '@app/components/create-new-drawing/create-new-drawing.component';
import { ExportDrawingComponent } from '@app/components/export-drawing/export-drawing.component';
import { OpenGalleryComponent } from '@app/components/gallery/open-gallery/open-gallery.component';
import { UploadComponent } from '@app/components/upload/upload.component';
import { ToolbarService } from '@app/services/toolbar/toolbar.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
    tools: Tool[] = [];
    @ViewChild('toolProperties') sidenavProperties: MatSidenav;
    @ViewChild(CreateNewDrawingComponent) newDrawingRef: CreateNewDrawingComponent;
    @ViewChild(ExportDrawingComponent) exportRef: ExportDrawingComponent;
    @ViewChild(UploadComponent) uploadRef: UploadComponent;
    @ViewChild(OpenGalleryComponent) galleryRef: OpenGalleryComponent;

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
        if (tool.name === 'Eyedropper') {
            this.sidenavProperties.close();
        }
    }

    createNewDrawing(): void {
        this.newDrawingRef.createNewDrawing();
    }

    exportDrawing(): void {
        this.exportRef.exportDrawing();
    }

    openGallery(): void {
        this.galleryRef.openDialog();
    }

    uploadImage(): void {
        this.uploadRef.uploadImage();
    }

    get currentTool(): Tool {
        return this.toolbarService.currentTool;
    }
}
