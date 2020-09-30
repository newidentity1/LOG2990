import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatRadioChange, MatRadioModule, _MatRadioButtonBase } from '@angular/material/radio';
import { MatSlider, MatSliderChange, MatSliderModule } from '@angular/material/slider';
import { BasicShapeProperties } from '@app/classes/tools-properties/basic-shape-properties';
import { ThicknessSliderComponent } from '@app/components/tools-options/thickness-slider/thickness-slider.component';
import { MAXIMUM_THICKNESS, MINIMUM_THICKNESS } from '@app/constants/constants';
import { DrawingType } from '@app/enums/drawing-type.enum';
import { EllipseService } from '@app/services/tools/ellipse/ellipse.service';
import { EllipseComponent } from './ellipse.component';

describe('EllipseComponent', () => {
    let component: EllipseComponent;
    let fixture: ComponentFixture<EllipseComponent>;
    let ellipseServiceMock: jasmine.SpyObj<EllipseService>;
    let matSliderEvent: MatSliderChange;
    // tslint:disable-next-line: prefer-const / reason: needed for matSliderSource and matRadioSource as placeholders
    let matSliderSource: MatSlider;
    let matRadioEvent: MatRadioChange;
    // tslint:disable-next-line: prefer-const
    let matRadioSource: _MatRadioButtonBase;

    beforeEach(async(() => {
        ellipseServiceMock = jasmine.createSpyObj('EllipseService', ['setThickness', 'setTypeDrawing']);
        TestBed.configureTestingModule({
            declarations: [EllipseComponent, ThicknessSliderComponent],
            imports: [MatRadioModule, MatSliderModule, FormsModule],
            providers: [{ provide: EllipseService, useValue: ellipseServiceMock }],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
        ellipseServiceMock = TestBed.inject(EllipseService) as jasmine.SpyObj<EllipseService>;
        ellipseServiceMock.toolProperties = new BasicShapeProperties();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EllipseComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('onThicknessChange should call setThickness of rectangle service if value is inside scope', () => {
        matSliderEvent = { source: matSliderSource, value: MAXIMUM_THICKNESS / 2 };
        component.onThicknessChange(matSliderEvent);
        expect(ellipseServiceMock.setThickness).toHaveBeenCalled();
        expect(ellipseServiceMock.setThickness).toHaveBeenCalledWith(MAXIMUM_THICKNESS / 2);
    });

    it('onThicknessChange should not call setThickness of ellipse service if value is outside scope', () => {
        matSliderEvent = { source: matSliderSource, value: MINIMUM_THICKNESS - 1 };
        component.onThicknessChange(matSliderEvent);
        expect(ellipseServiceMock.setThickness).not.toHaveBeenCalledWith(matSliderEvent.value);
    });

    it('onTypeDrawingChange should call setTypeDrawing of rectangle service if value is in Enum DrawingType', () => {
        matRadioEvent = { source: matRadioSource, value: DrawingType.Fill };
        component.onTypeDrawingChange(matRadioEvent);
        expect(ellipseServiceMock.setTypeDrawing).toHaveBeenCalled();
        expect(ellipseServiceMock.setTypeDrawing).toHaveBeenCalledWith(DrawingType.Fill);
    });

    it('onTypeDrawingChange should not call setTypeDrawing of rectangle service if value is not in Enum DrawingType', () => {
        matRadioEvent = { source: matRadioSource, value: '' };
        component.onTypeDrawingChange(matRadioEvent);
        expect(ellipseServiceMock.setTypeDrawing).not.toHaveBeenCalled();
    });
});
