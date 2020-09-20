import { Injectable } from '@angular/core';
import { Color } from '@app/classes/color/color';
import { Tool } from '@app/classes/tool';
import { EllipseService } from '@app/services/tools/ellipse/ellipse.service';
import { LineService } from '@app/services/tools/Line/line.service';
import { PencilService } from '@app/services/tools/pencil/pencil-service';
import { RectangleService } from '@app/services/tools/rectangle/rectangle.service';

@Injectable({
    providedIn: 'root',
})
export class ToolbarService {
    private tools: Tool[];
    currentTool: Tool;
    primaryColor: Color;
    secondaryColor: Color;

    constructor(
        protected pencilService: PencilService,
        protected rectangleService: RectangleService,
        protected ellipseService: EllipseService,
        protected lineService: LineService,
    ) {
        this.tools = [pencilService, rectangleService, ellipseService, lineService];
        this.currentTool = this.tools[0];
    }

    getTools(): Tool[] {
        return this.tools;
    }

    setColors(primaryColor: Color, secondaryColor: Color): void {
        this.primaryColor = primaryColor;
        this.secondaryColor = secondaryColor;
        this.applyCurrentToolColor();
    }

    applyCurrentToolColor(): void {
        this.currentTool.setColors(this.primaryColor, this.secondaryColor);
    }
}
