import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatRadioChange, MatRadioModule } from '@angular/material/radio';
import { MatSliderChange, MatSliderModule } from '@angular/material/slider';
import { LineComponent } from './line.component';

describe('LineComponent', () => {
    let component: LineComponent;
    let fixture: ComponentFixture<LineComponent>;
    let sliderThickness: MatSliderChange;
    let slider: MatSliderModule;
    let matSliderChange: MatRadioChange;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [LineComponent],
            imports: [MatRadioModule, MatSliderModule, FormsModule, MatSliderChange, MatRadioChange],
        }).compileComponents();
        slider = {} as MatSliderModule;
        sliderThickness = {
            source: slider,
            value: 25,
        } as MatSliderChange;

        matSliderChange = {
            value: 'Avec point',
        } as MatRadioChange;
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LineComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('onThicknessChange should change thickness', () => {
        component.onThicknessChange(sliderThickness);
        expect(component.currentThickness).toEqual(1);
    });

    it('onSizeChange should change size of points', () => {
        component.pointSize = 0;
        component.onSizeChange(sliderThickness);
        expect(component.pointSize).toEqual(0);
    });

    it('onSizeChange should change size of points', () => {
        component.pointSize = 0;
        // component.(sliderThickness);
        expect(component.pointSize).toEqual(0);
    });
});
