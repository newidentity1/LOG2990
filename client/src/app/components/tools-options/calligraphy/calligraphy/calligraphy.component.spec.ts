import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSliderChange, MatSliderModule } from '@angular/material/slider';
import { CalligraphyService } from '@app/services/tools/calligraphy/calligraphy.service';
import { CalligraphyComponent } from './calligraphy.component';

describe('CalligraphyComponent', () => {
    let component: CalligraphyComponent;
    let fixture: ComponentFixture<CalligraphyComponent>;
    let calligraphyServiceSpy: jasmine.SpyObj<CalligraphyService>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CalligraphyComponent],
            imports: [MatSliderModule],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();

        calligraphyServiceSpy = TestBed.inject(CalligraphyService) as jasmine.SpyObj<CalligraphyService>;
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CalligraphyComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('onLineLengthChange should change lineLength of calligraphy service if value is in scope', () => {
        calligraphyServiceSpy.lineLength = 1;
        const matSliderEvent = { value: 2 } as MatSliderChange;
        component.onLineLengthChange(matSliderEvent);
        expect(calligraphyServiceSpy.lineLength).toEqual(2);
    });

    it('onLineLengthChange should not change lineLength of calligraphy service if value is not in scope', () => {
        calligraphyServiceSpy.lineLength = 1;
        const matSliderEvent = { value: 0 } as MatSliderChange;
        component.onLineLengthChange(matSliderEvent);
        expect(calligraphyServiceSpy.lineLength).toEqual(1);
    });

    it('onLineAngleChange should change lineAngle of calligraphy service if value is in scope', () => {
        calligraphyServiceSpy.lineAngle = 0;
        const matSliderEvent = { value: 1 } as MatSliderChange;
        component.onLineAngleChange(matSliderEvent);
        expect(calligraphyServiceSpy.lineAngle).toEqual(1);
    });

    it('onLineAngleChange should not change lineAngle of calligraphy service if value is not in scope', () => {
        calligraphyServiceSpy.lineAngle = 0;
        const matSliderEvent = { value: -1 } as MatSliderChange;
        component.onLineAngleChange(matSliderEvent);
        expect(calligraphyServiceSpy.lineAngle).toEqual(0);
    });

    it('lineLength getter should return lineLength of calligraphy service', () => {
        calligraphyServiceSpy.lineLength = 2;
        const returnedValue = component.lineLength;
        expect(returnedValue).toEqual(calligraphyServiceSpy.lineLength);
    });

    it('lineAngle getter should return lineAngle of calligraphy service', () => {
        calligraphyServiceSpy.lineAngle = 2;
        const returnedValue = component.lineAngle;
        expect(returnedValue).toEqual(calligraphyServiceSpy.lineAngle);
    });
});
