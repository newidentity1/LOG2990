import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSliderModule } from '@angular/material/slider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ColorToolComponent } from '@app/components//color-tool/color-tool.component';
import { DrawingComponent } from '@app/components/drawing/drawing.component';
import { SidebarComponent } from '@app/components/sidebar/sidebar.component';
import { SVGFilterComponent } from '@app/components/svgfilter/svgfilter.component';
import { EllipseComponent } from '@app/components/tools-options/ellipse/ellipse.component';
import { PencilComponent } from '@app/components/tools-options/pencil/pencil.component';
import { RectangleComponent } from '@app/components/tools-options/rectangle/rectangle.component';
import { ThicknessSliderComponent } from '@app/components/tools-options/thickness-slider/thickness-slider.component';
import { RecentColorsComponent } from '@app/recent-colors/recent-colors.component';
import { ToolbarService } from '@app/services/toolbar/toolbar.service';
import { EditorComponent } from './editor.component';

describe('EditorComponent', () => {
    let component: EditorComponent;
    let fixture: ComponentFixture<EditorComponent>;
    let toolbarService: ToolbarService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                EditorComponent,
                DrawingComponent,
                SidebarComponent,
                EllipseComponent,
                PencilComponent,
                RectangleComponent,
                ColorToolComponent,
                RecentColorsComponent,
                ThicknessSliderComponent,
                SVGFilterComponent,
            ],
            imports: [MatIconModule, MatTooltipModule, MatSidenavModule, BrowserAnimationsModule, MatSliderModule],
            providers: [{ provide: MatDialog, useValue: {} }, ToolbarService],
        }).compileComponents();
        toolbarService = TestBed.inject(ToolbarService);
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EditorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should call the toolbar onKeyDown when receiving a keyboard event', () => {
        const event = {} as KeyboardEvent;
        const keyboardEventSpy = spyOn(toolbarService, 'onKeyDown').and.callThrough();
        component.onKeyDown(event);
        expect(keyboardEventSpy).toHaveBeenCalled();
        expect(keyboardEventSpy).toHaveBeenCalledWith(event);
    });

    it('should call the toolbar onKeyPress when receiving a keyboard event', () => {
        const event = {} as KeyboardEvent;
        const keyboardEventSpy = spyOn(toolbarService.currentTool, 'onKeyPress').and.callThrough();
        component.onKeyPress(event);
        expect(keyboardEventSpy).toHaveBeenCalled();
        expect(keyboardEventSpy).toHaveBeenCalledWith(event);
    });

    it('should call the toolbar onKeyUp when receiving a keyboard event', () => {
        const event = {} as KeyboardEvent;
        const keyboardEventSpy = spyOn(toolbarService.currentTool, 'onKeyUp').and.callThrough();
        component.onKeyUp(event);
        expect(keyboardEventSpy).toHaveBeenCalled();
        expect(keyboardEventSpy).toHaveBeenCalledWith(event);
    });
});
