import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatRadioChange, MatRadioModule, _MatRadioButtonBase } from '@angular/material/radio';
import { MatSliderChange, MatSliderModule } from '@angular/material/slider';
import { BrushProperties } from '@app/classes/tools-properties/brush-properties';
import { ThicknessSliderComponent } from '@app/components/tools-options/thickness-slider/thickness-slider.component';
import { MAXIMUM_THICKNESS, MINIMUM_THICKNESS } from '@app/constants/constants';
import { BrushType } from '@app/enums/brush-filters.enum';
import { BrushService } from '@app/services/tools/brush/brush.service';
import { BrushComponent } from './brush.component';

describe('BrushComponent', () => {
    let component: BrushComponent;
    let fixture: ComponentFixture<BrushComponent>;
    let brushServiceMock: jasmine.SpyObj<BrushService>;
    // tslint:disable-next-line: prefer-const / reason: needed for matSliderSource and matRadioSource as placeholders
    let matSliderEvent: MatSliderChange;
    let matRadioEvent: MatRadioChange;
    // tslint:disable-next-line: prefer-const
    let matRadioSource: _MatRadioButtonBase;

    beforeEach(async(() => {
        brushServiceMock = jasmine.createSpyObj('BrushService', ['setThickness', 'setFilter']);
        TestBed.configureTestingModule({
            declarations: [BrushComponent, ThicknessSliderComponent],
            imports: [MatSliderModule, MatRadioModule, FormsModule],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            providers: [{ provide: BrushService, useValue: brushServiceMock }],
        }).compileComponents();
        brushServiceMock = TestBed.inject(BrushService) as jasmine.SpyObj<BrushService>;
        brushServiceMock.setThickness.and.callFake(() => {
            return;
        });
        brushServiceMock.setFilter.and.callFake(() => {
            return;
        });
        const toolProperties = new BrushProperties();
        toolProperties.currentFilter = BrushType.Blurred;
        brushServiceMock.toolProperties = toolProperties;
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(BrushComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('onThicknessChange should call setThickness of pencilService if value is inside scope', () => {
        matSliderEvent = { value: MAXIMUM_THICKNESS / 2 } as MatSliderChange;
        component.onThicknessChange(matSliderEvent);
        expect(brushServiceMock.setThickness).toHaveBeenCalledWith(MAXIMUM_THICKNESS / 2);
    });

    it('onThicknessChange should not call setThickness of pencilService if value is outside scope', () => {
        matSliderEvent = { value: MINIMUM_THICKNESS - 1 } as MatSliderChange;
        component.onThicknessChange(matSliderEvent);
        expect(brushServiceMock.setThickness).not.toHaveBeenCalledWith(matSliderEvent.value);
    });

    it('onFilterChange should call setFilter of brushService if value is in Enum BrushType', () => {
        matRadioEvent = { source: matRadioSource, value: BrushType.Blurred };
        component.onFilterChange(matRadioEvent);
        expect(brushServiceMock.setFilter).toHaveBeenCalled();
        expect(brushServiceMock.setFilter).toHaveBeenCalledWith(BrushType.Blurred);
    });

    it('onFilterChange should not call setFilter of brushService if value is not in Enum BrushType', () => {
        matRadioEvent = { source: matRadioSource, value: '' };
        component.onFilterChange(matRadioEvent);
        expect(brushServiceMock.setFilter).not.toHaveBeenCalled();
    });
});
