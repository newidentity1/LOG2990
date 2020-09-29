import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatRadioChange, MatRadioModule, _MatRadioButtonBase } from '@angular/material/radio';
import { MatSlider, MatSliderChange, MatSliderModule } from '@angular/material/slider';
import { ThicknessSliderComponent } from '@app/components/tools-options/thickness-slider/thickness-slider.component';
import { MAXIMUM_THICKNESS, MINIMUM_THICKNESS } from '@app/constants/constants';
import { DrawingType } from '@app/enums/drawing-type.enum';
import { RectangleService } from '@app/services/tools/rectangle/rectangle.service';
import { RectangleComponent } from './rectangle.component';

describe('RectangleComponent', () => {
    let component: RectangleComponent;
    let fixture: ComponentFixture<RectangleComponent>;
    let rectangleService: jasmine.SpyObj<RectangleService>;
    // tslint:disable-next-line: no-any / reason: spy of functions
    let thicknessSpy: jasmine.SpyObj<any>;
    // tslint:disable-next-line: no-any / reason: spy of functions
    let typeDrawingSpy: jasmine.SpyObj<any>;

    let matSliderEvent: MatSliderChange;
    // tslint:disable-next-line: prefer-const / reason: needed for matSliderSource and matRadioSource as placeholders
    let matSliderSource: MatSlider;
    let matRadioEvent: MatRadioChange;
    // tslint:disable-next-line: prefer-const
    let matRadioSource: _MatRadioButtonBase;

    beforeEach(async(() => {
        rectangleService = jasmine.createSpyObj('RectangleService', ['setThickness', 'setTypeDrawing']);
        TestBed.configureTestingModule({
            declarations: [RectangleComponent, ThicknessSliderComponent],
            imports: [MatSliderModule, MatRadioModule, FormsModule],
            providers: [{ provide: RectangleService, useValue: rectangleService }],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
        rectangleService = TestBed.inject(RectangleService) as jasmine.SpyObj<RectangleService>;
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(RectangleComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('onThicknessChange should call setThickness of rectangle service if value is inside scope', () => {
        thicknessSpy = spyOn(rectangleService, 'setThickness').and.callThrough();
        matSliderEvent = { source: matSliderSource, value: MAXIMUM_THICKNESS / 2 };
        component.onThicknessChange(matSliderEvent);
        expect(thicknessSpy).toHaveBeenCalled();
        expect(thicknessSpy).toHaveBeenCalledWith(MAXIMUM_THICKNESS / 2);
    });

    it('onThicknessChange should not call setThickness of rectangle service if value is outside scope', () => {
        thicknessSpy = spyOn(rectangleService, 'setThickness').and.callThrough();
        matSliderEvent = { source: matSliderSource, value: MINIMUM_THICKNESS - 1 };
        component.onThicknessChange(matSliderEvent);
        expect(thicknessSpy).not.toHaveBeenCalled();
    });

    it('onTypeDrawingChange should call setTypeDrawing of rectangle service if value is in Enum DrawingType', () => {
        typeDrawingSpy = spyOn(rectangleService, 'setTypeDrawing').and.callThrough();
        matRadioEvent = { source: matRadioSource, value: DrawingType.Fill };
        component.onTypeDrawingChange(matRadioEvent);
        expect(typeDrawingSpy).toHaveBeenCalled();
        expect(typeDrawingSpy).toHaveBeenCalledWith(DrawingType.Fill);
    });

    it('onTypeDrawingChange should not call setTypeDrawing of rectangle service if value is not in Enum DrawingType', () => {
        typeDrawingSpy = spyOn(rectangleService, 'setTypeDrawing').and.callThrough();
        matRadioEvent = { source: matRadioSource, value: '' };
        component.onTypeDrawingChange(matRadioEvent);
        expect(typeDrawingSpy).not.toHaveBeenCalled();
    });
});
