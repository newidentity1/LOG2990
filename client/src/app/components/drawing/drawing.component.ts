import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Command } from '@app/classes/commands/command';
import { ResizeCommand } from '@app/classes/commands/resize-command';
import { ResizerProperties } from '@app/classes/resizer-properties';
import { CANVAS_MARGIN_LEFT, CANVAS_MARGIN_TOP, CANVAS_MIN_HEIGHT, CANVAS_MIN_WIDTH, SELECTION_CONTROL_POINT_SIZE } from '@app/constants/constants';
import { MouseButton } from '@app/enums/mouse-button.enum';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ToolbarService } from '@app/services/toolbar/toolbar.service';
import { Observable, Subscription } from 'rxjs';

@Component({
    selector: 'app-drawing',
    templateUrl: './drawing.component.html',
    styleUrls: ['./drawing.component.scss'],
})
export class DrawingComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('baseCanvas', { static: false }) baseCanvas: ElementRef<HTMLCanvasElement>;
    // On utilise ce canvas pour dessiner sans affecter le dessin final
    @ViewChild('previewCanvas', { static: false }) previewCanvas: ElementRef<HTMLCanvasElement>;

    @Input() drawingContainerWidth: number;
    @Input() drawingContainerHeight: number;
    @Input() dimensionsUpdatedEvent: Observable<number[]>;

    @Output() requestDrawingContainerDimensions: EventEmitter<void> = new EventEmitter();

    previewCtx: CanvasRenderingContext2D;
    private subscribeCreateNewDrawing: Subscription;
    private subscribeResetCanvasSize: Subscription;
    private subscribeDimensionsUpdated: Subscription;
    private subscribeExecutedCommand: Subscription;
    isResizingWidth: boolean = false;
    isResizingHeight: boolean = false;
    resizeCommand: ResizeCommand = new ResizeCommand(this.drawingService);

    constructor(private drawingService: DrawingService, private toolbarService: ToolbarService) {}

    ngOnInit(): void {
        this.subscribeCreateNewDrawing = this.drawingService.createNewDrawingEventListener().subscribe(() => {
            this.toolbarService.resetSelection();
            this.drawingService.clearCanvas(this.drawingService.baseCtx);
            this.requestDrawingContainerDimensions.emit();
        });
        this.subscribeResetCanvasSize = this.drawingService.resetCanvasSizeEventListener().subscribe(() => {
            this.requestDrawingContainerDimensions.emit();
        });
        this.subscribeDimensionsUpdated = this.dimensionsUpdatedEvent.subscribe((dimensions) => {
            this.drawingContainerWidth = dimensions[0];
            this.drawingContainerHeight = dimensions[1];
            if (!!dimensions[2]) this.newCanvasSetSize();
            setTimeout(() => {
                this.toolbarService.applyCurrentTool();
                this.drawingService.setWhiteBackground();
            }, 0);
        });
        this.subscribeExecutedCommand = this.resizeCommand.executedCommand.subscribe((command: Command) => {
            this.toolbarService.addCommand(command);
        });
    }

    ngAfterViewInit(): void {
        this.resizeCommand.baseCtx = this.baseCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.previewCtx = this.previewCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.drawingService.baseCtx = this.resizeCommand.baseCtx;
        this.drawingService.previewCtx = this.previewCtx;
        this.drawingService.canvas = this.baseCanvas.nativeElement;

        this.drawingService.setWhiteBackground();
        this.toolbarService.initializeListeners();
    }

    ngOnDestroy(): void {
        this.subscribeCreateNewDrawing.unsubscribe();
        this.subscribeDimensionsUpdated.unsubscribe();
        this.subscribeResetCanvasSize.unsubscribe();
        this.toolbarService.unsubscribeListeners();
        this.subscribeExecutedCommand.unsubscribe();
    }

    onMouseMove(event: MouseEvent): void {
        if (!this.isResizingWidth && !this.isResizingHeight) {
            this.toolbarService.onMouseMove(event);
        }
    }

    onMouseDown(event: MouseEvent): void {
        event.preventDefault();
        if (!this.isResizingWidth && !this.isResizingHeight) {
            this.toolbarService.onMouseDown(event);
        }
    }

    @HostListener('window:mouseup', ['$event'])
    onMouseUp(event: MouseEvent): void {
        event.preventDefault();
        if (this.isResizingWidth || this.isResizingHeight) {
            const newWidth = this.isResizingWidth ? this.previewCanvas.nativeElement.width : this.width;
            const newHeight = this.isResizingHeight ? this.previewCanvas.nativeElement.height : this.height;

            this.resizeCommand.resize(newWidth, newHeight);

            setTimeout(() => {
                this.toolbarService.applyCurrentTool();
                this.resizeCommand.applyCurrentSettings();
            }, 0);
            this.isResizingWidth = false;
            this.isResizingHeight = false;
        } else {
            this.toolbarService.onMouseUp(event);
        }
    }

    onMouseEnter(event: MouseEvent): void {
        this.toolbarService.onMouseEnter(event);
    }

    onMouseLeave(event: MouseEvent): void {
        this.toolbarService.onMouseLeave(event);
    }

    onDoubleClick(event: MouseEvent): void {
        this.toolbarService.onDoubleClick(event);
    }

    onClick(event: MouseEvent): void {
        this.toolbarService.onClick(event);
    }

    onContextMenu(): boolean {
        return false;
    }

    @HostListener('window:mousemove', ['$event'])
    onResize(event: MouseEvent): void {
        if (this.isResizingWidth) {
            event.preventDefault();
            let newWidth = event.clientX - this.baseCanvas.nativeElement.getBoundingClientRect().x;
            const widthLimit = this.drawingContainerWidth - CANVAS_MARGIN_LEFT;
            if (newWidth < CANVAS_MIN_WIDTH) {
                newWidth = CANVAS_MIN_WIDTH;
            } else if (newWidth > widthLimit) {
                newWidth = widthLimit;
            }
            this.previewCanvas.nativeElement.width = newWidth;
        }

        if (this.isResizingHeight) {
            event.preventDefault();
            let newHeight = event.clientY - this.baseCanvas.nativeElement.getBoundingClientRect().y;
            const heightLimit = this.drawingContainerHeight - CANVAS_MARGIN_TOP;
            if (newHeight < CANVAS_MIN_HEIGHT) {
                newHeight = CANVAS_MIN_HEIGHT;
            } else if (newHeight > heightLimit) {
                newHeight = heightLimit;
            }
            this.previewCanvas.nativeElement.height = newHeight;
        }
    }

    onResizeWidthStart(event: MouseEvent): void {
        if (event.button === MouseButton.Left) {
            this.isResizingWidth = true;
        }
    }

    onResizeHeightStart(event: MouseEvent): void {
        if (event.button === MouseButton.Left) {
            this.isResizingHeight = true;
        }
    }

    onResizeBothStart(event: MouseEvent): void {
        this.onResizeWidthStart(event);
        this.onResizeHeightStart(event);
    }

    newCanvasSetSize(): void {
        const newWidth = this.drawingContainerWidth / 2;
        const newHeight = this.drawingContainerHeight / 2;

        const width = newWidth >= CANVAS_MIN_WIDTH ? newWidth : CANVAS_MIN_WIDTH;
        const height = newHeight >= CANVAS_MIN_HEIGHT ? newHeight : CANVAS_MIN_HEIGHT;
        this.resizeCommand.resize(width, height);
    }

    isAreaSelected(): boolean {
        return this.toolbarService.isAreaSelected();
    }

    get width(): number {
        return this.resizeCommand.canvasSize.x;
    }

    get height(): number {
        return this.resizeCommand.canvasSize.y;
    }

    onBaseCanvasMouseDown(event: MouseEvent): void {
        if (this.isAreaSelected()) {
            this.toolbarService.resetSelection();
            this.onMouseDown(event);
        }
    }

    calculateResizerStyle(rowPosition: number, columnPosition: number): ResizerProperties {
        let resizerPosition: ResizerProperties;

        if (this.previewCanvas) {
            const previewCanvasElement = this.previewCanvas.nativeElement;
            const canvasTopOffset = previewCanvasElement.offsetTop;
            const canvasLeftOffset = previewCanvasElement.offsetLeft;

            resizerPosition = {
                top: canvasTopOffset + (previewCanvasElement.height * rowPosition) / 2 - SELECTION_CONTROL_POINT_SIZE / 2 + 'px',
                left: canvasLeftOffset + (previewCanvasElement.width * columnPosition) / 2 - SELECTION_CONTROL_POINT_SIZE / 2 + 'px',
            };
        } else {
            resizerPosition = {
                top: (this.height * rowPosition) / 2 - SELECTION_CONTROL_POINT_SIZE / 2 + 'px',
                left: (this.width * columnPosition) / 2 - SELECTION_CONTROL_POINT_SIZE / 2 + 'px',
            };
        }
        return resizerPosition;
    }
}
