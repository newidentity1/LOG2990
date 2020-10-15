import { Injectable } from '@angular/core';
import { ShapeTool } from '@app/classes/tool/shape-tool';
import { Tool } from '@app/classes/tool/tool';
import { BasicShapeProperties } from '@app/classes/tools-properties/basic-shape-properties';
import { Vec2 } from '@app/classes/vec2';
import { DASHED_SEGMENTS, SELECTION_BOX_THICKNESS } from '@app/constants/constants';
import { DrawingType } from '@app/enums/drawing-type.enum';
import { MouseButton } from '@app/enums/mouse-button.enum';
import { SelectionType } from '@app/enums/selection-type.enum';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { EllipseService } from '@app/services/tools/ellipse/ellipse.service';
import { RectangleService } from '@app/services/tools/rectangle/rectangle.service';

@Injectable({
    providedIn: 'root',
})
export class SelectionService extends Tool {
    currentType: SelectionType;
    isAreaSelected: boolean;
    protected isMovingSelection: boolean;
    protected positiveStartingPos: Vec2;
    protected positiveWidth: number;
    protected positiveHeight: number;
    protected escapePressed: boolean;
    protected imgData: ImageData;
    protected shapeService: ShapeTool;
    private previousShapeType: DrawingType;

    constructor(drawingService: DrawingService, private rectangleService: RectangleService, private ellipseService: EllipseService) {
        super(drawingService);
        this.name = 'Selection';
        this.tooltip = 'Selection (r)';
        this.iconName = 'highlight_alt';
        this.toolProperties = new BasicShapeProperties();
        this.shapeService = rectangleService;
        this.currentType = SelectionType.RectangleSelection;
    }

    setSelectionType(type: SelectionType): void {
        switch (type) {
            case SelectionType.RectangleSelection:
                this.shapeService = this.rectangleService;
                this.currentType = SelectionType.RectangleSelection;
                break;
            case SelectionType.EllipseSelection:
                this.shapeService = this.ellipseService;
                this.currentType = SelectionType.EllipseSelection;
                break;
        }
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        this.mouseDownCoord = this.getPositionFromMouse(event);
        if (this.mouseDown) {
            if (this.isAreaSelected) {
                // TODO : Handle move
                this.isMovingSelection = true;
            } else {
                const shapeServiceProperties = this.shapeService.toolProperties as BasicShapeProperties;
                this.previousShapeType = shapeServiceProperties.currentType as DrawingType;
                this.shapeService.setTypeDrawing(DrawingType.Stroke);
                this.drawingService.previewCtx.setLineDash([DASHED_SEGMENTS]);
                this.setThickness(SELECTION_BOX_THICKNESS);
                this.shapeService.onMouseDown(event);
            }
        }
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            this.drawingService.previewCtx.setLineDash([DASHED_SEGMENTS]);
            this.shapeService.onMouseMove(event);
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            if (this.isMovingSelection) {
                this.isMovingSelection = false;
            } else {
                this.shapeService.mouseDown = false;
                const mouseUpPosition = this.getPositionFromMouse(event);
                if (mouseUpPosition.x !== this.mouseDownCoord.x || mouseUpPosition.y !== this.mouseDownCoord.y) {
                    this.computePositiveRectangleValues();
                    this.drawSelectedArea();
                    this.escapePressed = false;
                }
            }
            this.mouseDown = false;
        }
    }

    onKeyDown(event: KeyboardEvent): void {
        this.escapePressed = event.key === 'Escape';
        if (this.escapePressed && (this.mouseDown || this.isAreaSelected)) {
            this.resetSelection();
        }
        if (this.mouseDown) {
            this.drawingService.previewCtx.setLineDash([DASHED_SEGMENTS]);
            this.shapeService.onKeyDown(event);
        }
    }

    onKeyUp(event: KeyboardEvent): void {
        if (this.mouseDown) {
            this.shapeService.onKeyUp(event);
        }
    }

    selectAll(): void {
        this.setSelectionType(SelectionType.RectangleSelection);
        this.positiveStartingPos.x = 0;
        this.positiveStartingPos.y = 0;
        this.positiveWidth = this.drawingService.canvas.width;
        this.positiveHeight = this.drawingService.canvas.height;
        this.drawSelectedArea();
    }

    resetSelection(): void {
        if (this.isAreaSelected) {
            this.isAreaSelected = false;
            const selectionCtx = this.drawingService.previewCtx;
            // TODO : Handle move

            // this.imgData = selectionCtx.getImageData(0, 0, this.positiveWidth, this.positiveHeight);
            // const canvasTopOffset = +selectionCtx.canvas.style.top.substring(0, selectionCtx.canvas.style.top.length - 2);
            // const canvasLeftOffset = +selectionCtx.canvas.style.left.substring(0, selectionCtx.canvas.style.left.length - 2);
            // this.drawingService.baseCtx.putImageData(
            // this.imgData,
            // canvasLeftOffset,
            // canvasTopOffset,
            // 0,
            // 0,
            // this.positiveWidth,
            // this.positiveWidth
            // );
            selectionCtx.canvas.width = this.drawingService.canvas.width;
            selectionCtx.canvas.height = this.drawingService.canvas.height;
            selectionCtx.canvas.style.left = '0px';
            selectionCtx.canvas.style.top = '0px';

            this.escapePressed = false;

            selectionCtx.canvas.style.cursor = '';
            this.shapeService.setTypeDrawing(this.previousShapeType);
        }
    }

    private drawSelectedArea(): void {
        if (this.escapePressed) return;

        this.isAreaSelected = true;
        const selectionCtx = this.drawingService.previewCtx;

        selectionCtx.canvas.style.left = this.positiveStartingPos.x + 'px';
        selectionCtx.canvas.style.top = this.positiveStartingPos.y + 'px';
        selectionCtx.canvas.width = this.positiveWidth;
        selectionCtx.canvas.height = this.positiveHeight;
        this.imgData = this.drawingService.baseCtx.getImageData(
            this.positiveStartingPos.x,
            this.positiveStartingPos.y,
            this.positiveWidth,
            this.positiveHeight,
        );

        setTimeout(() => {
            // TODO : Handle move

            // selectionCtx.putImageData(this.imgData, 0, 0, 0, 0, this.positiveWidth, this.positiveWidth);
            // this.drawingService.baseCtx.clearRect(this.positiveStartingPos.x, this.positiveStartingPos.y, this.positiveWidth, this.positiveHeight);

            // this.ellipseService.mouseDownCoord = { x: 0, y: 0 };
            // selectionCtx.setLineDash([DASHED_SEGMENTS]);
            // this.ellipseService.drawShape(selectionCtx);
            selectionCtx.canvas.style.cursor = 'move';
        }, 0);
    }

    private computePositiveRectangleValues(): void {
        this.positiveStartingPos.x = this.shapeService.width >= 0 ? this.mouseDownCoord.x : this.mouseDownCoord.x + this.shapeService.width;
        this.positiveWidth = Math.abs(this.shapeService.width);
        this.positiveStartingPos.y = this.shapeService.height >= 0 ? this.mouseDownCoord.y : this.mouseDownCoord.y + this.shapeService.height;
        this.positiveHeight = Math.abs(this.shapeService.height);
    }

    resetContext(): void {
        this.mouseDown = false;
        this.isAreaSelected = false;
        this.escapePressed = false;
        this.isMovingSelection = false;
        this.positiveStartingPos = { x: 0, y: 0 };
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
    }
}
