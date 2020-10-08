import { AfterContentInit, AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import { CANVAS_MARGIN_LEFT, CANVAS_MARGIN_TOP, CANVAS_MIN_HEIGHT, CANVAS_MIN_WIDTH, DEFAULT_HEIGHT, DEFAULT_WIDTH } from '@app/constants/constants';
import { MouseButton } from '@app/enums/mouse-button.enum';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ToolbarService } from '@app/services/toolbar/toolbar.service';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-drawing',
    templateUrl: './drawing.component.html',
    styleUrls: ['./drawing.component.scss'],
})
export class DrawingComponent implements AfterViewInit, AfterContentInit {
    @ViewChild('baseCanvas', { static: false }) baseCanvas: ElementRef<HTMLCanvasElement>;
    // On utilise ce canvas pour dessiner sans affecter le dessin final
    @ViewChild('previewCanvas', { static: false }) previewCanvas: ElementRef<HTMLCanvasElement>;

    @Input() drawingContainerWidth: number;
    @Input() drawingContainerHeight: number;
    @Input() dimensionsUpdatedEvent: Observable<number[]>;

    @Output() requestDrawingContainerDimensions: EventEmitter<void> = new EventEmitter();

    private baseCtx: CanvasRenderingContext2D;
    private previewCtx: CanvasRenderingContext2D;
    private canvasSize: Vec2 = { x: DEFAULT_WIDTH, y: DEFAULT_HEIGHT };

    isResizingWidth: boolean = false;
    isResizingHeight: boolean = false;

    constructor(private drawingService: DrawingService, private toolbarService: ToolbarService) {}

    ngAfterContentInit(): void {
        this.newCanvasSetSize();
    }

    ngAfterViewInit(): void {
        this.baseCtx = this.baseCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.previewCtx = this.previewCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.drawingService.baseCtx = this.baseCtx;
        this.drawingService.previewCtx = this.previewCtx;
        this.drawingService.canvas = this.baseCanvas.nativeElement;

        this.drawingService.createNewDrawingEventListener().subscribe(() => {
            this.requestDrawingContainerDimensions.emit();
        });
        this.dimensionsUpdatedEvent.subscribe((dimensions) => {
            this.drawingContainerWidth = dimensions[0];
            this.drawingContainerHeight = dimensions[1];
            this.newCanvasSetSize();
            setTimeout(() => {
                this.toolbarService.applyCurrentTool();
            }, 0);
        });
        this.toolbarService.initializeColors();
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

            const imgData = this.baseCtx.getImageData(0, 0, newWidth, newHeight);
            this.canvasSize.x = newWidth;
            this.canvasSize.y = newHeight;
            setTimeout(() => {
                this.baseCtx.putImageData(imgData, 0, 0);
                this.toolbarService.applyCurrentTool();
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
            const newWidth = event.clientX - this.baseCanvas.nativeElement.getBoundingClientRect().x;

            const widthLimit = this.drawingContainerWidth - CANVAS_MARGIN_LEFT;
            if (newWidth >= CANVAS_MIN_WIDTH && newWidth <= widthLimit) {
                this.previewCanvas.nativeElement.width = newWidth;
            }
        }

        if (this.isResizingHeight) {
            event.preventDefault();
            const newHeight = event.clientY - this.baseCanvas.nativeElement.getBoundingClientRect().y;
            const heightLimit = this.drawingContainerHeight - CANVAS_MARGIN_TOP;
            if (newHeight >= CANVAS_MIN_HEIGHT && newHeight <= heightLimit) {
                this.previewCanvas.nativeElement.height = newHeight;
            }
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

        this.canvasSize.x = newWidth >= CANVAS_MIN_WIDTH ? newWidth : CANVAS_MIN_WIDTH;
        this.canvasSize.y = newHeight >= CANVAS_MIN_HEIGHT ? newHeight : CANVAS_MIN_HEIGHT;
    }

    get width(): number {
        return this.canvasSize.x;
    }

    get height(): number {
        return this.canvasSize.y;
    }
}
