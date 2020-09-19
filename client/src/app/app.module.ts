import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSliderModule } from '@angular/material/slider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/app/app.component';
import { ColorPickerComponent } from './components/color-picker/color-picker.component';
import { ColorToolComponent } from './components/color-tool/color-tool.component';
import { DrawingComponent } from './components/drawing/drawing.component';
import { EditorComponent } from './components/editor/editor.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { EllipseComponent } from './components/tools-options/ellipse/ellipse.component';
import { PencilComponent } from './components/tools-options/pencil/pencil.component';
import { RectangleComponent } from './components/tools-options/rectangle/rectangle.component';
import { RecentColorsComponent } from './recent-colors/recent-colors.component';

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
        MatSliderModule,
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
