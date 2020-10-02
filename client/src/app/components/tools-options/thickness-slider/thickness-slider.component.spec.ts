import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSlider, MatSliderChange, MatSliderModule } from '@angular/material/slider';
import { MAXIMUM_THICKNESS, MINIMUM_THICKNESS } from '@app/constants/constants';
import { ThicknessSliderComponent } from './thickness-slider.component';

describe('ThicknessSliderComponent', () => {
    let component: ThicknessSliderComponent;
    let fixture: ComponentFixture<ThicknessSliderComponent>;
    // tslint:disable-next-line: prefer-const / reason: using sliderSource as a placeholder for MatSlideChange event
    let sliderSource: MatSlider;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ThicknessSliderComponent],
            imports: [MatSliderModule],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ThicknessSliderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('onThicknessChange should emit if the thickness value is MINIMUM_THICKNESS', () => {
        const thicknessValue = MINIMUM_THICKNESS;
        const sliderChange: MatSliderChange = { source: sliderSource, value: thicknessValue };
        const emitSpy = spyOn(component.thicknessChange, 'emit');
        component.onThicknessChange(sliderChange);
        expect(emitSpy).toHaveBeenCalled();
        expect(emitSpy).toHaveBeenCalledWith(sliderChange);
    });

    it('onThicknessChange should not emit if the thickness value is less than MININIM_THICKNESS', () => {
        const thicknessValue = MINIMUM_THICKNESS - 1;
        const sliderChange: MatSliderChange = { source: sliderSource, value: thicknessValue };
        const emitSpy = spyOn(component.thicknessChange, 'emit');
        component.onThicknessChange(sliderChange);
        expect(emitSpy).not.toHaveBeenCalled();
    });

    it('onThicknessChange should emit if the thickness value is MAXIMUM_THICKNESS', () => {
        const thicknessValue = MAXIMUM_THICKNESS;
        const sliderChange: MatSliderChange = { source: sliderSource, value: thicknessValue };
        const emitSpy = spyOn(component.thicknessChange, 'emit');
        component.onThicknessChange(sliderChange);
        expect(emitSpy).toHaveBeenCalled();
        expect(emitSpy).toHaveBeenCalledWith(sliderChange);
    });

    it('onThicknessChange should not emit if the thickness value is greather than MAXIMUM_THICKNESS', () => {
        const thicknessValue = MAXIMUM_THICKNESS + 1;
        const sliderChange: MatSliderChange = { source: sliderSource, value: thicknessValue };
        const emitSpy = spyOn(component.thicknessChange, 'emit');
        component.onThicknessChange(sliderChange);
        expect(emitSpy).not.toHaveBeenCalled();
    });
    it('minimumThickness should return the minimum thickness constant value', () => {
        const value = component.minimumThickness;
        const expectedResult = MINIMUM_THICKNESS;
        expect(value).toEqual(expectedResult);
    });

    it('maximumThickness should return the maximum thickness constant value', () => {
        const value = component.maximumThickness;
        const expectedResult = MAXIMUM_THICKNESS;
        expect(value).toEqual(expectedResult);
    });
});
