import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool/tool';
import { SprayProperties } from '@app/classes/tools-properties/spray-properties';
import { Vec2 } from '@app/classes/vec2';
import { SPRAY_INTERVAL } from '@app/constants/constants';
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
            this.clearSpray();
            this.currentMouseCoord = mousePosition;
            this.mouseDownCoord = mousePosition;
            this.sprayIntervalRef = window.setInterval(this.draw.bind(this), SPRAY_INTERVAL, this.drawingService.previewCtx);
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            this.drawingService.baseCtx.drawImage(this.drawingService.previewCtx.canvas, 0, 0);
            this.executedCommand.emit(this.clone());
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
        }
        this.mouseDown = false;
        this.clearSpray();
        this.clearPath();
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) this.currentMouseCoord = this.getPositionFromMouse(event);
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        const SPRAY_PER_SECOND = 50;
        const properties = this.toolProperties as SprayProperties;

        for (const sprayCoord of this.sprayCoords) {
            ctx.beginPath();
            ctx.arc(sprayCoord.x, sprayCoord.y, properties.diameterDrops / 2, 0, 2 * Math.PI);
            ctx.fill();
        }

        for (let i = 0; i < properties.dropsPerSecond / SPRAY_PER_SECOND; ++i) {
            const radius = (Math.random() * properties.diameterSpray) / 2;
            const angle = Math.random() * (2 * Math.PI);
            const sprayXCoord = this.currentMouseCoord.x + radius * Math.cos(angle);
            const sprayYCoord = this.currentMouseCoord.y + radius * Math.sin(angle);
            ctx.beginPath();
            ctx.arc(sprayXCoord, sprayYCoord, properties.diameterDrops / 2, angle, 2 * Math.PI + angle);
            ctx.fill();
            this.sprayCoords.push({ x: sprayXCoord, y: sprayYCoord } as Vec2);
        }
    }

    clearSpray(): void {
        if (this.sprayIntervalRef) window.clearInterval(this.sprayIntervalRef);
    }

    clearPath(): void {
        this.sprayCoords = [];
    }

    resetContext(): void {
        super.resetContext();
        this.clearPath();
        this.clearSpray();
    }

    getPositionFromMouse(event: MouseEvent): Vec2 {
        const canvasBoundingRect = this.drawingService.canvas.getBoundingClientRect();
        return { x: event.clientX - canvasBoundingRect.x, y: event.clientY - canvasBoundingRect.y };
    }

    clone(): SprayService {
        const sprayClone: SprayService = new SprayService(this.drawingService);
        this.copyTool(sprayClone);
        const properties = this.toolProperties as SprayProperties;
        const cloneProperties = sprayClone.toolProperties as SprayProperties;
        cloneProperties.diameterDrops = properties.diameterDrops;
        cloneProperties.diameterSpray = properties.diameterSpray;
        cloneProperties.dropsPerSecond = properties.dropsPerSecond;
        sprayClone.sprayCoords = this.sprayCoords;
        return sprayClone;
    }
}
