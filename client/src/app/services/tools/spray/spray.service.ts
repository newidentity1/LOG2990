import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool/tool';
import { SprayProperties } from '@app/classes/tools-properties/spray-properties';
import { Vec2 } from '@app/classes/vec2';
import { MouseButton } from '@app/enums/mouse-button.enum';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class SprayService extends Tool {
    sprayCoords: Vec2[] = [];
    currentMouseCoord: Vec2;
    sprayIntervalRef: number;

    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.name = 'Spray';
        this.tooltip = 'Aérosol(a)';
        this.iconName = 'blur_on';
        this.toolProperties = new SprayProperties();
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.clearPath();
            this.currentMouseCoord = mousePosition;
            this.mouseDownCoord = mousePosition;
            this.sprayIntervalRef = setInterval(this.draw.bind(this), 100, this.drawingService.previewCtx);
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            this.draw(this.drawingService.baseCtx);
            this.executedCommand.emit(this.clone());
            clearInterval(this.sprayIntervalRef);
        }
        this.mouseDown = false;
        this.clearPath();
    }

    onMouseMove(event: MouseEvent): void {
        const mousePosition = this.getPositionFromMouse(event);
        if (this.mouseDown) {
            this.currentMouseCoord = mousePosition;
        }
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        const properties = this.toolProperties as SprayProperties;
        for (const sprayCoord of this.sprayCoords) {
            ctx.fillRect(sprayCoord.x, sprayCoord.y, 1, 1);
        }
        if (ctx === this.drawingService.baseCtx) return;
        for (let i = 0; i < properties.dropsPerSecond; ++i) {
            const radius = (Math.random() * properties.diameterSpray) / 2;
            const angle = Math.random() * (2 * Math.PI);
            const sprayXCoord = this.currentMouseCoord.x + radius * Math.cos(angle);
            const sprayYCoord = this.currentMouseCoord.y + radius * Math.sin(angle);
            ctx.fillRect(sprayXCoord, sprayYCoord, 1, 1);
            this.sprayCoords.push({ x: sprayXCoord, y: sprayYCoord } as Vec2);
        }
    }

    clearPath(): void {
        this.sprayCoords = [];
    }

    // setFilter(value: string): void {
    //     const brushProperties = this.toolProperties as SprayProperties;
    //     if (brushProperties.filterType.includes(value)) {
    //         brushProperties.currentFilter = value;
    //     }
    // }

    clone(): SprayService {
        const sprayClone: SprayService = new SprayService(this.drawingService);
        this.copyTool(sprayClone);
        // const brushCloneProperties = sprayClone.toolProperties as BrushProperties;
        // const brushProperties = this.toolProperties as BrushProperties;
        // brushCloneProperties.currentFilter = brushProperties.currentFilter;
        return sprayClone;
    }
}
