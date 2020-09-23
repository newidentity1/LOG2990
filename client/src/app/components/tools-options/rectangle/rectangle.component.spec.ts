import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { MatSliderModule } from '@angular/material/slider';
import { ThicknessSliderComponent } from '@app/components/tools-options/thickness-slider/thickness-slider.component';
import { RectangleComponent } from './rectangle.component';

describe('RectangleComponent', () => {
    let component: RectangleComponent;
    let fixture: ComponentFixture<RectangleComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [RectangleComponent, ThicknessSliderComponent],
            imports: [MatSliderModule, MatRadioModule, FormsModule],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(RectangleComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
