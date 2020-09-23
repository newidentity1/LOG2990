import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import { CANVAS_MIN_HEIGHT, CANVAS_MIN_WIDTH, DEFAULT_HEIGHT, DEFAULT_WIDTH } from '@app/constants/constants';
import { MouseButton } from '@app/enums/mouse-button.enum';
import { ColorPickerService } from '@app/services/color-picker/color-picker.service';
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

    private baseCtx: CanvasRenderingContext2D;
    private previewCtx: CanvasRenderingContext2D;
    private canvasSize: Vec2 = { x: DEFAULT_WIDTH, y: DEFAULT_HEIGHT };

    isResizingWidth: boolean = false;
    isResizingHeight: boolean = false;

    constructor(private drawingService: DrawingService, private toolbarService: ToolbarService, private colorService: ColorPickerService) {}

    ngAfterViewInit(): void {
        this.baseCtx = this.baseCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.previewCtx = this.previewCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.drawingService.baseCtx = this.baseCtx;
        this.drawingService.previewCtx = this.previewCtx;
        this.drawingService.canvas = this.baseCanvas.nativeElement;
        this.colorService.updateDrawingColor();
    }

    onMouseMove(event: MouseEvent): void {
        if (!this.isResizingWidth && !this.isResizingHeight) {
            this.toolbarService.currentTool.onMouseMove(event);
        }
    }

    onMouseDown(event: MouseEvent): void {
        if (!this.isResizingWidth && !this.isResizingHeight) {
            this.toolbarService.currentTool.onMouseDown(event);
        }
    }

    @HostListener('window:mouseup', ['$event'])
    onMouseUp(event: MouseEvent): void {
        console.log(event.target);
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
            this.toolbarService.currentTool.onMouseUp(event);
        }
    }

    onMouseEnter(event: MouseEvent): void {
        this.toolbarService.currentTool.onMouseEnter(event);
    }

    onMouseLeave(event: MouseEvent): void {
        this.toolbarService.currentTool.onMouseLeave(event);
    }

    onDoubleClick(event: MouseEvent): void {
        this.toolbarService.currentTool.onDoubleClick(event);
    }

    onClick(event: MouseEvent): void {
        this.toolbarService.currentTool.onClick(event);
    }

    @HostListener('window:mousemove', ['$event'])
    onResize(event: MouseEvent): void {
        if (this.isResizingWidth) {
            event.preventDefault();
            const newWidth = event.clientX - this.baseCanvas.nativeElement.getBoundingClientRect().x;
            if (newWidth >= CANVAS_MIN_WIDTH) {
                this.previewCanvas.nativeElement.width = newWidth;
            }
        }

        if (this.isResizingHeight) {
            event.preventDefault();
            const newHeight = event.clientY - this.baseCanvas.nativeElement.getBoundingClientRect().y;
            if (newHeight >= CANVAS_MIN_HEIGHT) {
                this.previewCanvas.nativeElement.height = newHeight;
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
