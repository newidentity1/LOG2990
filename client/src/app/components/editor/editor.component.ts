import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { ToolbarService } from '@app/services/toolbar/toolbar.service';

@Component({
    selector: 'app-editor',
    templateUrl: './editor.component.html',
    styleUrls: ['./editor.component.scss'],
})
export class EditorComponent implements OnInit {
    @ViewChild('drawingContainer', { static: true }) drawingContainer: ElementRef;

    height: number;
    width: number;

    constructor(private toolbarService: ToolbarService) {}

    ngOnInit(): void {
        this.ComputeDimensionsDrawingContainer();
    }

    @HostListener('keydown', ['$event'])
    onKeyDown(event: KeyboardEvent): void {
        // Send the event to toolbar
        this.toolbarService.onKeyDown(event);
    }

    @HostListener('keypress', ['$event'])
    onKeyPress(event: KeyboardEvent): void {
        this.toolbarService.onKeyPress(event);
    }

    @HostListener('keyup', ['$event'])
    onKeyUp(event: KeyboardEvent): void {
        this.toolbarService.onKeyUp(event);
    }

    ComputeDimensionsDrawingContainer(): void {
        const heightString = getComputedStyle(this.drawingContainer.nativeElement).height;
        this.height = +heightString.substring(0, heightString.length - 2);

        const widthString = getComputedStyle(this.drawingContainer.nativeElement).width;
        this.width = +widthString.substring(0, widthString.length - 2);
    }
}
