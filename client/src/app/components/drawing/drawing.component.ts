import { AfterViewInit, Component, ElementRef, HostListener, Input, ViewChild } from '@angular/core';
import { Color } from '@app/classes/color/color';
import { Vec2 } from '@app/classes/vec2';
import {
    BLACK,
    CANVAS_MARGIN_LEFT,
    CANVAS_MARGIN_TOP,
    CANVAS_MIN_HEIGHT,
    CANVAS_MIN_WIDTH,
    DEFAULT_HEIGHT,
    DEFAULT_WIDTH,
    WHITE,
} from '@app/constants/constants';
import { MouseButton } from '@app/enums/mouse-button.enum';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ToolbarService } from '@app/services/toolbar/toolbar.service';

@Component({
    selector: 'app-drawing',
    templateUrl: './drawing.component.html',
    styleUrls: ['./drawing.component.scss'],
})
export class DrawingComponent implements AfterViewInit {
    @ViewChild('baseCanvas', { static: false }) baseCanvas: ElementRef<HTMLCanvasElement>;
    // On utilise ce canvas pour dessiner sans affecter le dessin final
    @ViewChild('previewCanvas', { static: false }) previewCanvas: ElementRef<HTMLCanvasElement>;

    @Input() drawingContainerWidth: number;
    @Input() drawingContainerHeight: number;

    private baseCtx: CanvasRenderingContext2D;
    private previewCtx: CanvasRenderingContext2D;
    private canvasSize: Vec2 = { x: DEFAULT_WIDTH, y: DEFAULT_HEIGHT };

    isResizingWidth: boolean = false;
    isResizingHeight: boolean = false;

    constructor(private drawingService: DrawingService, private toolbarService: ToolbarService) {}

    ngAfterViewInit(): void {
        this.baseCtx = this.baseCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.previewCtx = this.previewCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.drawingService.baseCtx = this.baseCtx;
        this.drawingService.previewCtx = this.previewCtx;
        this.drawingService.canvas = this.baseCanvas.nativeElement;
        this.toolbarService.setColors(new Color(BLACK), new Color(WHITE));
        // Set size of initial canvas and new canvas
        this.drawingService.childEventListener().subscribe((resetMessage) => {
            this.newCanvasSetSize();
            console.log(resetMessage);
        });
    }

    onMouseMove(event: MouseEvent): void {
        if (!this.isResizingWidth && !this.isResizingHeight) {
            this.toolbarService.onMouseMove(event);
        }
    }

    onMouseDown(event: MouseEvent): void {
        if (!this.isResizingWidth && !this.isResizingHeight) {
            this.toolbarService.onMouseDown(event);
        }
    }

    @HostListener('window:mouseup', ['$event'])
    onMouseUp(event: MouseEvent): void {
        if (this.isResizingWidth || this.isResizingHeight) {
            const newWidth = this.isResizingWidth ? this.previewCanvas.nativeElement.width : this.width;
            const newHeight = this.isResizingHeight ? this.previewCanvas.nativeElement.height : this.height;

            const imgData = this.baseCtx.getImageData(0, 0, newWidth, newHeight);
            this.width = newWidth;
            this.height = newHeight;
            setTimeout(() => {
                this.baseCtx.putImageData(imgData, 0, 0);
            }, 0); // Whyyyy does this work?

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

    @HostListener('window:mousemove', ['$event'])
    onResize(event: MouseEvent): void {
        if (this.isResizingWidth) {
            event.preventDefault();
            const newWidth = event.clientX - this.baseCanvas.nativeElement.getBoundingClientRect().x;
            if (newWidth >= CANVAS_MIN_WIDTH) {
                this.previewCanvas.nativeElement.width =
                    newWidth >= this.drawingContainerWidth - CANVAS_MARGIN_LEFT ? this.drawingContainerWidth - CANVAS_MARGIN_LEFT : newWidth;
            }
        }

        if (this.isResizingHeight) {
            event.preventDefault();
            const newHeight = event.clientY - this.baseCanvas.nativeElement.getBoundingClientRect().y;
            if (newHeight >= CANVAS_MIN_HEIGHT) {
                this.previewCanvas.nativeElement.height =
                    newHeight >= this.drawingContainerHeight - CANVAS_MARGIN_TOP ? this.drawingContainerHeight - CANVAS_MARGIN_TOP : newHeight;
            }
        }
    }

    onResizeBothStart(event: MouseEvent): void {
        this.onResizeWidthStart(event);
        this.onResizeHeightStart(event);
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

    // TODO : ComputeDimensionsDrawingComponent to calculate canvas size
    // TODO : 6 failed tests
    newCanvasSetSize(): void {
        // this.canvasSize.x = this.drawingContainerWidth / 2;
        // this.canvasSize.y = this.drawingContainerHeight / 2;
        // this.canvasSize.x = window.innerWidth / 2 >= CANVAS_MIN_WIDTH ? window.innerWidth / 2 : CANVAS_MIN_WIDTH;
        // this.canvasSize.y = window.innerHeight / 2 >= CANVAS_MIN_HEIGHT ? window.innerHeight / 2 : CANVAS_MIN_HEIGHT;
    }

    get width(): number {
        return this.canvasSize.x;
    }

    set width(newWidth: number) {
        this.canvasSize.x = newWidth;
    }

    get height(): number {
        return this.canvasSize.y;
    }

    set height(newHeight: number) {
        this.canvasSize.y = newHeight;
    }
}
