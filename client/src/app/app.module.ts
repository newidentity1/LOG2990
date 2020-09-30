import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSliderModule } from '@angular/material/slider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/app/app.component';
import { ColorPickerFormComponent } from './components/color-picker-form/color-picker-form.component';
import { ColorPickerComponent } from './components/color-picker/color-picker.component';
import { ColorToolComponent } from './components/color-tool/color-tool.component';
import { CreateNewDrawingComponent } from './components/create-new-drawing/create-new-drawing.component';
import { NewDrawingDialogComponent } from './components/create-new-drawing/new-drawing-dialog/new-drawing-dialog.component';
import { DrawingComponent } from './components/drawing/drawing.component';
import { EditorComponent } from './components/editor/editor.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { RecentColorsComponent } from './components/recent-colors/recent-colors.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { SVGFilterComponent } from './components/svgfilter/svgfilter.component';
import { BrushComponent } from './components/tools-options/brush/brush.component';
import { EllipseComponent } from './components/tools-options/ellipse/ellipse.component';
import { LineComponent } from './components/tools-options/line/line.component';
import { PencilComponent } from './components/tools-options/pencil/pencil.component';
import { RectangleComponent } from './components/tools-options/rectangle/rectangle.component';
import { ThicknessSliderComponent } from './components/tools-options/thickness-slider/thickness-slider.component';
@NgModule({
    declarations: [
        AppComponent,
        EditorComponent,
        SidebarComponent,
        DrawingComponent,
        MainPageComponent,
        ColorPickerComponent,
        ColorToolComponent,
        RecentColorsComponent,
        PencilComponent,
        RectangleComponent,
        EllipseComponent,
        LineComponent,
        ThicknessSliderComponent,
        SVGFilterComponent,
        BrushComponent,
        ColorPickerFormComponent,
        CreateNewDrawingComponent,
        NewDrawingDialogComponent,
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        AppRoutingModule,
        MatIconModule,
        MatTooltipModule,
        BrowserAnimationsModule,
        MatDialogModule,
        MatSliderModule,
        MatButtonModule,
        MatDividerModule,
        BrowserAnimationsModule,
        MatSidenavModule,
        MatRadioModule,
        FormsModule,
        ReactiveFormsModule,
        MatInputModule,
        MatFormFieldModule,
        MatButtonModule,
    ],
    providers: [{ provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher }],
    bootstrap: [AppComponent],
})
export class AppModule {}
