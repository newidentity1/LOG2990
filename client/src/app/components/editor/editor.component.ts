import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Tool } from '@app/classes/tool/tool';
import { SidebarComponent } from '@app/components/sidebar/sidebar.component';
import { DEFAULT_HEIGHT, DEFAULT_WIDTH } from '@app/constants/constants';
import { ShortcutService } from '@app/services/shortcut/shortcut.service';
import { ToolbarService } from '@app/services/toolbar/toolbar.service';
import { BehaviorSubject, Subscription } from 'rxjs';

@Component({
    selector: 'app-editor',
    templateUrl: './editor.component.html',
    styleUrls: ['./editor.component.scss'],
})
export class EditorComponent implements OnInit, OnDestroy {
    @ViewChild('drawingContainer', { static: true }) drawingContainer: ElementRef;

    @ViewChild(SidebarComponent) toolbarRef: SidebarComponent;

    height: number = DEFAULT_HEIGHT;
    width: number = DEFAULT_WIDTH;

    dimensionsUpdatedSubject: BehaviorSubject<number[]> = new BehaviorSubject([this.width, this.height]);
    private subscribedShortcuts: Subscription[] = [];

    constructor(private shortcutService: ShortcutService, private toolbarService: ToolbarService) {}

    ngOnInit(): void {
        this.computeDimensionsDrawingContainer();
        this.initializeShortcuts();
    }

    ngOnDestroy(): void {
        this.subscribedShortcuts.forEach((subscribedShortcut: Subscription) => {
            subscribedShortcut.unsubscribe();
        });
    }

    @HostListener('keydown', ['$event'])
    onKeyDown(event: KeyboardEvent): void {
        event.preventDefault();
        this.toolbarService.onKeyDown(event);
    }

    @HostListener('keypress', ['$event'])
    onKeyPress(event: KeyboardEvent): void {
        event.preventDefault();
        this.toolbarService.onKeyPress(event);
    }

    @HostListener('keyup', ['$event'])
    onKeyUp(event: KeyboardEvent): void {
        event.preventDefault();
        this.toolbarService.onKeyUp(event);
    }

    computeDimensionsDrawingContainer(): void {
        const heightString = getComputedStyle(this.drawingContainer.nativeElement).height;
        this.height = +heightString.substring(0, heightString.length - 2);

        const widthString = getComputedStyle(this.drawingContainer.nativeElement).width;
        this.width = +widthString.substring(0, widthString.length - 2);
        this.dimensionsUpdatedSubject.next([this.width, this.height]);
    }

    initializeShortcuts(): void {
        this.toolbarService.keyShortcuts.forEach((tool: Tool, shortcut: string) => {
            this.subscribedShortcuts.push(
                this.shortcutService.addShortcut(shortcut).subscribe(() => {
                    this.toolbarService.changeTool(tool);
                }),
            );
        });

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
    }
}
