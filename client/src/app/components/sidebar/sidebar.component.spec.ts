import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSliderModule } from '@angular/material/slider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ColorToolComponent } from '@app/components/color-tool/color-tool.component';
import { EllipseComponent } from '@app/components/tools-options/ellipse/ellipse.component';
import { PencilComponent } from '@app/components/tools-options/pencil/pencil.component';
import { RectangleComponent } from '@app/components/tools-options/rectangle/rectangle.component';
import { ThicknessSliderComponent } from '@app/components/tools-options/thickness-slider/thickness-slider.component';
import { RecentColorsComponent } from '@app/recent-colors/recent-colors.component';
import { ToolbarService } from '@app/services/toolbar/toolbar.service';
import { SidebarComponent } from './sidebar.component';

describe('SidebarComponent', () => {
    let component: SidebarComponent;
    let fixture: ComponentFixture<SidebarComponent>;
    let toolbarService: ToolbarService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                SidebarComponent,
                EllipseComponent,
                PencilComponent,
                RectangleComponent,
                ColorToolComponent,
                RecentColorsComponent,
                ThicknessSliderComponent,
            ],
            imports: [MatIconModule, MatTooltipModule, MatSidenavModule, BrowserAnimationsModule, MatSliderModule],
            providers: [{ provide: MatDialog, useValue: {} }, ToolbarService],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();

        toolbarService = TestBed.inject(ToolbarService);
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SidebarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('tools should be the same as toolbarService tools', () => {
        const expectedResult = toolbarService.getTools();
        expect(component.tools).toEqual(expectedResult);
    });

    it('isCurrentTool should return true if the parameter is the currentTool', () => {
        toolbarService.currentTool = component.tools[0];
        const tool = toolbarService.currentTool;
        const result = component.isCurrentTool(tool);
        expect(result).toEqual(true);
    });

    it('isCurrentTool should return false if the parameter is not the currentTool', () => {
        toolbarService.currentTool = component.tools[0];
        const tool = component.tools[1];
        const result = component.isCurrentTool(tool);
        expect(result).toEqual(false);
    });

    it('onToolChanged should change the currentTool, call applyCurrentToolColor of toolbarService and open the MatSideNav if the parameter is not the currentTool', () => {
        toolbarService.currentTool = component.tools[0];
        const tool = component.tools[1];
        const spyApplyCurrent = spyOn(toolbarService, 'applyCurrentToolColor');
        const spySideNav = spyOn(component.sidenavProperties, 'open');
        component.onToolChanged(tool);
        expect(toolbarService.currentTool).toEqual(tool);
        expect(spyApplyCurrent).toHaveBeenCalled();
        expect(spySideNav).toHaveBeenCalled();
    });

    it('onToolChanged should toggle the MatSideNav if the parameter is not the currentTool', () => {
        toolbarService.currentTool = component.tools[0];
        const tool = component.tools[0];
        const spySideNav = spyOn(component.sidenavProperties, 'toggle');
        component.onToolChanged(tool);
        expect(spySideNav).toHaveBeenCalled();
    });

    it('get currentTool should return the current tool of toolbarService', () => {
        toolbarService.currentTool = component.tools[0];
        const currentTool = toolbarService.currentTool;
        expect(component.currentTool).toEqual(currentTool);
    });

    it('set currentTool should set the current tool of toolbarService', () => {
        const currentTool = component.tools[0];
        component.currentTool = currentTool;
        expect(toolbarService.currentTool).toEqual(currentTool);
    });
});
