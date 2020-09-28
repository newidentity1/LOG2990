import { Color } from '@app/classes/color/color';
import { Tool } from '@app/classes/tool';
import { BasicShapeProperties } from '@app/classes/tools-properties/basic-shape-properties';
import { Vec2 } from '@app/classes/vec2';
import { MouseButton } from '@app/enums/mouse-button.enum';
import { DrawingService } from '@app/services/drawing/drawing.service';

export abstract class TracingTool extends Tool {
    protected pathData: Vec2[];
    color: Color;

    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.toolProperties = new BasicShapeProperties();
        this.clearPath();
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        if (this.mouseDown) {
            this.clearPath();

            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.pathData.push(this.mouseDownCoord);
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.pathData.push(mousePosition);
            this.drawLine(this.drawingService.baseCtx, this.pathData);
        }
        this.mouseDown = false;
        this.clearPath();
    }

    onMouseMove(event: MouseEvent): void {
        const mousePosition = this.getPositionFromMouse(event);
        if (this.mouseDown) {
            this.pathData.push(mousePosition);
            // On dessine sur le canvas de prévisualisation et on l'efface à chaque déplacement de la souris
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawLine(this.drawingService.previewCtx, this.pathData);
        }
        this.drawCursor(mousePosition);
    }

    onMouseEnter(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.pathData.push(mousePosition);
            this.drawLine(this.drawingService.previewCtx, this.pathData);
            this.clearPath();
        }
    }

    onMouseLeave(event: MouseEvent): void {
        const mousePosition = this.getPositionFromMouse(event);
        this.pathData.push(mousePosition);
        if (this.mouseDown) {
            this.drawLine(this.drawingService.baseCtx, this.pathData);
            this.clearPath();
        }
        this.drawCursor(mousePosition);
    }

    setColors(primaryColor: Color, secondaryColor: Color): void {
        this.drawingService.setColor(primaryColor.toStringRGBA());
    }

    protected abstract drawLine(ctx: CanvasRenderingContext2D, path: Vec2[]): void;

    protected abstract drawCursor(position: Vec2): void;

    protected clearPath(): void {
        this.pathData = [];
    }
}
