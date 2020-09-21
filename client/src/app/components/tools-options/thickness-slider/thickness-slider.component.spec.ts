import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSliderModule } from '@angular/material/slider';
import { ThicknessSliderComponent } from './thickness-slider.component';

describe('ThicknessSliderComponent', () => {
    let component: ThicknessSliderComponent;
    let fixture: ComponentFixture<ThicknessSliderComponent>;

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
});
