import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Tool } from '@app/classes/tool/tool';
import { CreateNewDrawingComponent } from '@app/components/create-new-drawing/create-new-drawing.component';
import { ExportDrawingComponent } from '@app/components/export-drawing/export-drawing.component';
import { GalleryComponent } from '@app/components/gallery/gallery.component';
import { UploadComponent } from '@app/components/upload/upload.component';
import { ShortcutService } from '@app/services/shortcut/shortcut.service';
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
    @ViewChild(GalleryComponent) galleryRef: GalleryComponent;

    constructor(protected toolbarService: ToolbarService, protected shortcutService: ShortcutService) {
        this.tools = this.toolbarService.getTools();
    }

    isCurrentTool(tool: Tool): boolean {
        return tool === this.currentTool;
    }

    onToolChanged(tool: Tool): void {
        const isWritingTextMode = tool.name === 'Text' && this.currentTool.name !== 'Text';

        if (tool !== this.currentTool) {
            if (this.currentTool.name === 'Text') this.shortcutService.removeWritingTextMode();
            this.toolbarService.changeTool(tool);
            this.sidenavProperties.open();
        } else {
            this.sidenavProperties.toggle();
        }

        if (tool.name === 'Eyedropper') this.sidenavProperties.close();
        if (isWritingTextMode) this.shortcutService.writingTextMode();
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
