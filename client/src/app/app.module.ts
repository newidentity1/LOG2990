import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgImageSliderModule } from 'ng-image-slider';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/app/app.component';
import { ColorPickerFormComponent } from './components/color/color-picker-form/color-picker-form.component';
import { ColorPickerComponent } from './components/color/color-picker/color-picker.component';
import { ColorToolComponent } from './components/color/color-tool/color-tool.component';
import { RecentColorsComponent } from './components/color/recent-colors/recent-colors.component';
import { ContinueDrawingComponent } from './components/continue-drawing/continue-drawing.component';
import { CreateNewDrawingComponent } from './components/create-new-drawing/create-new-drawing.component';
import { NewDrawingDialogComponent } from './components/create-new-drawing/new-drawing-dialog/new-drawing-dialog.component';
import { DrawingComponent } from './components/drawing/drawing.component';
import { EditorComponent } from './components/editor/editor.component';
import { ExportDrawingDialogComponent } from './components/export-drawing/export-drawing-dialog/export-drawing-dialog.component';
import { ExportDrawingComponent } from './components/export-drawing/export-drawing.component';
import { GalleryDialogComponent } from './components/gallery/gallery-dialog/gallery-dialog.component';
import { GalleryComponent } from './components/gallery/gallery.component';
import { WarningDialogComponent } from './components/gallery/warning/warning-dialog.component';
import { GuideComponent } from './components/guide/guide.component';
import { OpenGuideComponent } from './components/guide/open-guide/open-guide.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { BrushComponent } from './components/tools-options/brush/brush.component';
import { SVGFilterComponent } from './components/tools-options/brush/svgfilter/svgfilter.component';
import { BucketComponent } from './components/tools-options/bucket/bucket.component';
import { CalligraphyComponent } from './components/tools-options/calligraphy/calligraphy.component';
import { EllipseComponent } from './components/tools-options/ellipse/ellipse.component';
import { EraseComponent } from './components/tools-options/erase/erase.component';
import { EyedropperComponent } from './components/tools-options/eyedropper/eyedropper.component';
import { GridComponent } from './components/tools-options/grid/grid.component';
import { LineComponent } from './components/tools-options/line/line.component';
import { PencilComponent } from './components/tools-options/pencil/pencil.component';
import { PolygonComponent } from './components/tools-options/polygon/polygon.component';
import { RectangleComponent } from './components/tools-options/rectangle/rectangle.component';
import { MagnetismComponent } from './components/tools-options/selection/magnetism/magnetism.component';
import { SelectionComponent } from './components/tools-options/selection/selection.component';
import { SprayComponent } from './components/tools-options/spray/spray.component';
import { StampComponent } from './components/tools-options/stamp/stamp.component';
import { TextComponent } from './components/tools-options/text/text.component';
import { ThicknessSliderComponent } from './components/tools-options/thickness-slider/thickness-slider.component';
import { UndoRedoComponent } from './components/undo-redo/undo-redo.component';
import { UploadDialogComponent } from './components/upload/upload-dialog/upload-dialog.component';
import { UploadComponent } from './components/upload/upload.component';
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
        GuideComponent,
        LineComponent,
        ThicknessSliderComponent,
        SVGFilterComponent,
        BrushComponent,
        ColorPickerFormComponent,
        EraseComponent,
        CreateNewDrawingComponent,
        NewDrawingDialogComponent,
        OpenGuideComponent,
        PolygonComponent,
        UndoRedoComponent,
        EyedropperComponent,
        ExportDrawingComponent,
        ExportDrawingDialogComponent,
        SelectionComponent,
        BucketComponent,
        GalleryDialogComponent,
        GalleryComponent,
        UploadComponent,
        UploadDialogComponent,
        WarningDialogComponent,
        TextComponent,
        StampComponent,
        GridComponent,
        MagnetismComponent,
        ContinueDrawingComponent,
        CalligraphyComponent,
        SprayComponent,
    ],
    imports: [
        MatGridListModule,
        NgImageSliderModule,
        AngularFireModule.initializeApp({
            apiKey: 'AIzaSyA-FAAkdvUBcaXpf87ypqLsMdPNW_ElUWU',
            authDomain: 'log2990-2011.firebaseapp.com',
            databaseURL: 'https://log2990-2011.firebaseio.com',
            projectId: 'log2990-2011',
            storageBucket: 'log2990-2011.appspot.com',
            messagingSenderId: '408322091008',
            appId: '1:408322091008:web:920757c8a7e33e14d910e5',
            measurementId: 'G-9X4P4RJB02',
        }),
        MatSlideToggleModule,
        BrowserModule,
        HttpClientModule,
        AppRoutingModule,
        MatIconModule,
        MatTooltipModule,
        BrowserAnimationsModule,
        BrowserModule,
        MatDialogModule,
        MatSliderModule,
        MatButtonModule,
        MatTabsModule,
        MatDividerModule,
        MatDialogModule,
        BrowserAnimationsModule,
        MatSidenavModule,
        MatRadioModule,
        FormsModule,
        ReactiveFormsModule,
        MatInputModule,
        MatFormFieldModule,
        MatButtonModule,
        MatExpansionModule,
        MatSelectModule,
        MatChipsModule,
        MatSnackBarModule,
    ],
    providers: [{ provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher }],
    bootstrap: [AppComponent],
})
export class AppModule {}
