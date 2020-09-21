import { Injectable } from '@angular/core';
import { Color } from '@app/classes/color/color';
import { Tool } from '@app/classes/tool';
import { BrushService } from '@app/services/tools/brush/brush.service';
import { EllipseService } from '@app/services/tools/ellipse/ellipse.service';
import { LineService } from '@app/services/tools/Line/line.service';
import { PencilService } from '@app/services/tools/pencil/pencil-service';
import { RectangleService } from '@app/services/tools/rectangle/rectangle.service';

export enum toolsIndex {
    pencil,
    brush,
    rectangle,
    ellipse,
    lines,
}

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
        protected brushService: BrushService,
        protected rectangleService: RectangleService,
        protected ellipseService: EllipseService,
        protected lineService: LineService,
    ) {
        this.tools = [pencilService, brushService, rectangleService, ellipseService, lineService];
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

    // TODO: Change also change icon when switches
    onKeyDown(event: KeyboardEvent): void {
        switch (event.key) {
            case 'c':
                this.currentTool = this.tools[toolsIndex.pencil];
                break;

            // Pinceau
            case 'w':
                this.currentTool = this.tools[toolsIndex.brush];
                break;

            // Rectangle
            case '1':
                this.currentTool = this.tools[toolsIndex.rectangle];
                break;

            // Ellipse
            case '2':
                this.currentTool = this.tools[toolsIndex.ellipse];
                break;

            // Lines
            case 'l':
                this.currentTool = this.tools[toolsIndex.lines];
                break;
        }
    }
}
