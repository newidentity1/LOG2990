import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatRadioChange, MatRadioModule, _MatRadioButtonBase } from '@angular/material/radio';
import { MatSlider, MatSliderChange, MatSliderModule } from '@angular/material/slider';
import { BasicShapeProperties } from '@app/classes/tools-properties/basic-shape-properties';
import { ThicknessSliderComponent } from '@app/components/tools-options/thickness-slider/thickness-slider.component';
import { MAXIMUM_SIDES, MAXIMUM_THICKNESS, MINIMUM_SIDES, MINIMUM_THICKNESS } from '@app/constants/constants';
import { DrawingType } from '@app/enums/drawing-type.enum';
import { PolygonService } from '@app/services/tools/polygon/polygon.service';
import { PolygonComponent } from './polygon.component';

describe('PolygonComponent', () => {
    let component: PolygonComponent;
    let fixture: ComponentFixture<PolygonComponent>;
    let polygonServiceMock: jasmine.SpyObj<PolygonService>;

    let matSliderEvent: MatSliderChange;
    // tslint:disable-next-line: prefer-const / reason: needed for matSliderSource and matRadioSource as placeholders
    let matSliderSource: MatSlider;
    let matRadioEvent: MatRadioChange;
    // tslint:disable-next-line: prefer-const
    let matRadioSource: _MatRadioButtonBase;

    beforeEach(async(() => {
        polygonServiceMock = jasmine.createSpyObj('PolygonService', ['setThickness', 'setTypeDrawing', 'setNumberOfSides']);
        TestBed.configureTestingModule({
            declarations: [PolygonComponent, ThicknessSliderComponent],
            imports: [MatSliderModule, MatRadioModule, FormsModule],
            providers: [{ provide: PolygonService, useValue: polygonServiceMock }],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
        polygonServiceMock = TestBed.inject(PolygonService) as jasmine.SpyObj<PolygonService>;
        polygonServiceMock.toolProperties = new BasicShapeProperties();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PolygonComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('onThicknessChange should call setThickness of polygon service if value is inside scope', () => {
        matSliderEvent = { source: matSliderSource, value: MAXIMUM_THICKNESS / 2 };
        component.onThicknessChange(matSliderEvent);
        expect(polygonServiceMock.setThickness).toHaveBeenCalled();
        expect(polygonServiceMock.setThickness).toHaveBeenCalledWith(matSliderEvent.value);
    });

    it('onThicknessChange should not call setThickness of polygon service if value is outside scope', () => {
        matSliderEvent = { source: matSliderSource, value: MINIMUM_THICKNESS - 1 };
        component.onThicknessChange(matSliderEvent);
        expect(polygonServiceMock.setThickness).toHaveBeenCalled();
        expect(polygonServiceMock.setThickness).not.toHaveBeenCalledWith(matSliderEvent.value);
    });

    it('onNumberOfSidesChange should call setNumberOfSides of polygon service if value is inside scope', () => {
        matSliderEvent = { source: matSliderSource, value: MAXIMUM_SIDES / 2 };
        component.onNumberOfSidesChange(matSliderEvent);
        expect(polygonServiceMock.setNumberOfSides).toHaveBeenCalled();
        expect(polygonServiceMock.setNumberOfSides).toHaveBeenCalledWith(matSliderEvent.value);
    });

    it('onNumberOfSidesChange should not call setNumberOfSides of polygon service if value is outside scope', () => {
        matSliderEvent = { source: matSliderSource, value: MINIMUM_SIDES - 1 };
        component.onNumberOfSidesChange(matSliderEvent);
        expect(polygonServiceMock.setNumberOfSides).not.toHaveBeenCalled();
    });

    it('onTypeDrawingChange should call setTypeDrawing of polygon service if value is in Enum DrawingType', () => {
        matRadioEvent = { source: matRadioSource, value: DrawingType.Fill };
        component.onTypeDrawingChange(matRadioEvent);
        expect(polygonServiceMock.setTypeDrawing).toHaveBeenCalled();
        expect(polygonServiceMock.setTypeDrawing).toHaveBeenCalledWith(DrawingType.Fill);

        matRadioEvent = { source: matRadioSource, value: DrawingType.Stroke };
        component.onTypeDrawingChange(matRadioEvent);
        expect(polygonServiceMock.setTypeDrawing).toHaveBeenCalled();
        expect(polygonServiceMock.setTypeDrawing).toHaveBeenCalledWith(DrawingType.Stroke);

        matRadioEvent = { source: matRadioSource, value: DrawingType.FillAndStroke };
        component.onTypeDrawingChange(matRadioEvent);
        expect(polygonServiceMock.setTypeDrawing).toHaveBeenCalled();
        expect(polygonServiceMock.setTypeDrawing).toHaveBeenCalledWith(DrawingType.FillAndStroke);
    });

    it('onTypeDrawingChange should not call setTypeDrawing of polygon service if value is not in Enum DrawingType', () => {
        matRadioEvent = { source: matRadioSource, value: '' };
        component.onTypeDrawingChange(matRadioEvent);
        expect(polygonServiceMock.setTypeDrawing).not.toHaveBeenCalled();
    });
});
