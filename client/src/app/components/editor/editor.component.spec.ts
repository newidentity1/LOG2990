import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ColorToolComponent } from '@app/components//color-tool/color-tool.component';
import { DrawingComponent } from '@app/components/drawing/drawing.component';
import { SidebarComponent } from '@app/components/sidebar/sidebar.component';
import { EllipseComponent } from '@app/components/tools-options/ellipse/ellipse.component';
import { PencilComponent } from '@app/components/tools-options/pencil/pencil.component';
import { RectangleComponent } from '@app/components/tools-options/rectangle/rectangle.component';
import { RecentColorsComponent } from '@app/recent-colors/recent-colors.component';
import { EditorComponent } from './editor.component';

describe('EditorComponent', () => {
    let component: EditorComponent;
    let fixture: ComponentFixture<EditorComponent>;

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
            ],
            imports: [MatIconModule, MatTooltipModule, MatSidenavModule, BrowserAnimationsModule],
            providers: [{ provide: MatDialog, useValue: {} }],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EditorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
