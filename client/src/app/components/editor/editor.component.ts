import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { SidebarComponent } from '@app/components/sidebar/sidebar.component';
import { DEFAULT_HEIGHT, DEFAULT_WIDTH } from '@app/constants/constants';
import { ToolbarService } from '@app/services/toolbar/toolbar.service';
import { BehaviorSubject } from 'rxjs';

@Component({
    selector: 'app-editor',
    templateUrl: './editor.component.html',
    styleUrls: ['./editor.component.scss'],
})
export class EditorComponent implements OnInit {
    @ViewChild('drawingContainer', { static: true }) drawingContainer: ElementRef;

    @ViewChild(SidebarComponent) toolbarRef: SidebarComponent;

    height: number = DEFAULT_HEIGHT;
    width: number = DEFAULT_WIDTH;
    isCtrlDown: boolean = false;

    dimensionsUpdatedSubject: BehaviorSubject<number[]> = new BehaviorSubject([this.width, this.height]);

    constructor(private toolbarService: ToolbarService) {}

    ngOnInit(): void {
        this.computeDimensionsDrawingContainer();
    }

    @HostListener('keydown', ['$event'])
    onKeyDown(event: KeyboardEvent): void {
        event.preventDefault();
        if (this.isCtrlDown && event.key === 'o') {
            this.toolbarRef.createNewDrawing();
        }
        if (event.key === 'Control') {
            this.isCtrlDown = true;
        }
        // Send the event to toolbar
        this.toolbarService.onKeyDown(event);
        this.isCtrlDown = event.key === 'Control';
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
}
