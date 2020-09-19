import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ThicknessSliderComponent } from './thickness-slider.component';

describe('ThicknessSliderComponent', () => {
    let component: ThicknessSliderComponent;
    let fixture: ComponentFixture<ThicknessSliderComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ThicknessSliderComponent],
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
