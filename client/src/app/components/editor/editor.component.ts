import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Tool } from '@app/classes/tool/tool';
import { DrawingComponent } from '@app/components/drawing/drawing.component';
import { SidebarComponent } from '@app/components/sidebar/sidebar.component';
import { DEFAULT_HEIGHT, DEFAULT_WIDTH } from '@app/constants/constants';
import { SelectionType } from '@app/enums/selection-type.enum';
import { AutomaticSavingService } from '@app/services/automatic-saving/automatic-saving.service';
import { ShortcutService } from '@app/services/shortcut/shortcut.service';
import { ToolbarService } from '@app/services/toolbar/toolbar.service';
import { BehaviorSubject, Subscription } from 'rxjs';

@Component({
    selector: 'app-editor',
    templateUrl: './editor.component.html',
    styleUrls: ['./editor.component.scss'],
})
export class EditorComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('drawingContainer', { static: true }) drawingContainer: ElementRef;
    @ViewChild(DrawingComponent) drawingArea: DrawingComponent;

    @ViewChild(SidebarComponent) toolbarRef: SidebarComponent;

    height: number = DEFAULT_HEIGHT;
    width: number = DEFAULT_WIDTH;

    dimensionsUpdatedSubject: BehaviorSubject<number[]> = new BehaviorSubject([this.width, this.height]);
    private subscribedShortcuts: Subscription[] = [];

    constructor(
        private shortcutService: ShortcutService,
        private toolbarService: ToolbarService,
        private automaticSavingService: AutomaticSavingService,
    ) {}

    ngOnInit(): void {
        this.initializeShortcuts();
    }

    focusCanvas(): void {
        this.drawingArea.previewCanvas.nativeElement.focus();
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            if (!this.automaticSavingService.recovering) this.computeDimensionsDrawingContainer(true);
            else this.computeDimensionsDrawingContainer(false);
        }, 0);
    }

    ngOnDestroy(): void {
        this.subscribedShortcuts.forEach((subscribedShortcut: Subscription) => {
            subscribedShortcut.unsubscribe();
        });
    }

    @HostListener('window:keydown', ['$event'])
    onKeyDown(event: KeyboardEvent): void {
        this.toolbarService.onKeyDown(event);
    }

    @HostListener('window:keyup', ['$event'])
    onKeyUp(event: KeyboardEvent): void {
        event.preventDefault();
        this.toolbarService.onKeyUp(event);
    }

    @HostListener('window:resize', [])
    onResize(): void {
        this.computeDimensionsDrawingContainer(false);
    }

    computeDimensionsDrawingContainer(setCanvasSize: boolean): void {
        const heightString = getComputedStyle(this.drawingContainer.nativeElement).height;
        this.height = +heightString.substring(0, heightString.length - 2);

        const widthString = getComputedStyle(this.drawingContainer.nativeElement).width;
        this.width = +widthString.substring(0, widthString.length - 2);
        this.dimensionsUpdatedSubject.next([this.width, this.height, +setCanvasSize]);
    }

    private initializeShortcuts(): void {
        this.toolbarService.keyShortcuts.forEach((tool: Tool, shortcut: string) => {
            this.subscribedShortcuts.push(
                this.shortcutService.addShortcut(shortcut).subscribe(() => {
                    this.toolbarService.changeTool(tool);
                }),
            );
        });

        this.subscribedShortcuts.push(
            this.shortcutService.addShortcut('r').subscribe(() => {
                this.toolbarService.changeSelectionTool(SelectionType.RectangleSelection);
            }),
        );

        this.subscribedShortcuts.push(
            this.shortcutService.addShortcut('s').subscribe(() => {
                this.toolbarService.changeSelectionTool(SelectionType.EllipseSelection);
            }),
        );
        this.subscribedShortcuts.push(
            this.shortcutService.addShortcut('v').subscribe(() => {
                this.toolbarService.changeSelectionTool(SelectionType.MagicWandSelection);
            }),
        );

        this.subscribedShortcuts.push(
            this.shortcutService.addShortcut('control.g').subscribe(() => {
                this.toolbarRef.openGallery();
            }),
        );

        this.subscribedShortcuts.push(
            this.shortcutService.addShortcut('control.o').subscribe(() => {
                this.toolbarRef.createNewDrawing();
            }),
        );
        this.subscribedShortcuts.push(
            this.shortcutService.addShortcut('control.e').subscribe(() => {
                this.toolbarRef.exportDrawing();
            }),
        );

        this.subscribedShortcuts.push(
            this.shortcutService.addShortcut('control.s').subscribe(() => {
                this.toolbarRef.uploadImage();
            }),
        );

        this.subscribedShortcuts.push(
            this.shortcutService.addShortcut('control.a').subscribe(() => {
                this.toolbarService.triggerSelectAll();
            }),
        );
        this.subscribedShortcuts.push(
            this.shortcutService.addShortcut('control.c').subscribe(() => {
                this.toolbarService.triggerCopySelection();
            }),
        );

        this.subscribedShortcuts.push(
            this.shortcutService.addShortcut('control.x').subscribe(() => {
                this.toolbarService.triggerCutSelection();
            }),
        );

        this.subscribedShortcuts.push(
            this.shortcutService.addShortcut('control.v').subscribe(() => {
                this.toolbarService.triggerPasteSelection();
            }),
        );

        this.subscribedShortcuts.push(
            this.shortcutService.addShortcut('control.z').subscribe(() => {
                this.toolbarService.undo();
            }),
        );
        this.subscribedShortcuts.push(
            this.shortcutService.addShortcut('control.shift.z').subscribe(() => {
                this.toolbarService.redo();
            }),
        );
    }
}
