import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatRadioChange, MatRadioModule, _MatRadioButtonBase } from '@angular/material/radio';
import { MatSlider, MatSliderChange, MatSliderModule } from '@angular/material/slider';
import { BasicShapeProperties } from '@app/classes/tools-properties/basic-shape-properties';
import { ThicknessSliderComponent } from '@app/components/tools-options/thickness-slider/thickness-slider.component';
import { MAXIMUM_THICKNESS } from '@app/constants/constants';
import { LineService } from '@app/services/tools/line/line.service';
import { LineComponent } from './line.component';

describe('LineComponent', () => {
    let component: LineComponent;
    let fixture: ComponentFixture<LineComponent>;
    let lineServiceMock: jasmine.SpyObj<LineService>;
    let matSliderEvent: MatSliderChange;
    // tslint:disable-next-line: prefer-const / reason: needed for matSliderSource and matRadioSource as placeholders
    let matSliderSource: MatSlider;
    let matRadioEvent: MatRadioChange;
    // tslint:disable-next-line: prefer-const
    let matRadioSource: _MatRadioButtonBase;
    beforeEach(async(() => {
        lineServiceMock = jasmine.createSpyObj('LineService', ['setThickness', 'setPointeSize', 'setTypeDrawing']);
        TestBed.configureTestingModule({
            declarations: [LineComponent, ThicknessSliderComponent],
            imports: [MatSliderModule, FormsModule, MatRadioModule],
            providers: [{ provide: LineService, useValue: lineServiceMock }],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
        lineServiceMock = TestBed.inject(LineService) as jasmine.SpyObj<LineService>;
        lineServiceMock.toolProperties = new BasicShapeProperties();
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
        matSliderEvent = { source: matSliderSource, value: MAXIMUM_THICKNESS / 2 };
        component.onThicknessChange(matSliderEvent);
        expect(lineServiceMock.setThickness).toHaveBeenCalled();
        expect(lineServiceMock.setThickness).toHaveBeenCalledWith(MAXIMUM_THICKNESS / 2);
    });

    it('onSizeChange should change size of points', () => {
        matSliderEvent = { source: matSliderSource, value: MAXIMUM_THICKNESS / 2 };
        component.onSizeChange(matSliderEvent);
        expect(lineServiceMock.setPointeSize).toHaveBeenCalled();
        expect(lineServiceMock.setPointeSize).toHaveBeenCalledWith(MAXIMUM_THICKNESS / 2);
    });

    it('onTypeDrawingChange should call setTypeDrawing of line service if value is in Enum DrawingType', () => {
        matRadioEvent = { source: matRadioSource, value: 'Avec point' };
        component.onTypeDrawingChange(matRadioEvent);
        expect(lineServiceMock.setTypeDrawing).toHaveBeenCalled();
    });
});
