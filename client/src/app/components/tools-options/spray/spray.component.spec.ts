import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSlider, MatSliderChange, MatSliderModule } from '@angular/material/slider';
import { SprayProperties } from '@app/classes/tools-properties/spray-properties';
import {
    MAXIMUM_DIAMETER_DROPS,
    MAXIMUM_DIAMETER_SPRAY,
    MAXIMUM_DROPS_PER_SECOND,
    MINIMUM_DIAMETER_DROPS,
    MINIMUM_DIAMETER_SPRAY,
    MINIMUM_DROPS_PER_SECOND,
} from '@app/constants/constants';
import { SprayService } from '@app/services/tools/spray/spray.service';
import { SprayComponent } from './spray.component';

describe('SprayComponent', () => {
    let component: SprayComponent;
    let fixture: ComponentFixture<SprayComponent>;
    let sprayServiceMock: jasmine.SpyObj<SprayService>;

    let matSliderEvent: MatSliderChange;
    // tslint:disable-next-line: prefer-const / reason: needed for matSliderSource and matRadioSource as placeholders
    let matSliderSource: MatSlider;

    beforeEach(async(() => {
        sprayServiceMock = jasmine.createSpyObj('SprayService', ['draw']);
        TestBed.configureTestingModule({
            declarations: [SprayComponent],
            imports: [MatSliderModule],
            providers: [{ provide: SprayService, useValue: sprayServiceMock }],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
        sprayServiceMock = TestBed.inject(SprayService) as jasmine.SpyObj<SprayService>;
        sprayServiceMock.toolProperties = new SprayProperties();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SprayComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('onDiameterSprayChange should change the property diameter spray of spray service properties if value is inside scope', () => {
        matSliderEvent = { source: matSliderSource, value: MAXIMUM_DIAMETER_SPRAY / 2 };
        component.onDiameterSprayChange(matSliderEvent);
        const properties = sprayServiceMock.toolProperties as SprayProperties;
        expect(properties.diameterSpray).toEqual(matSliderEvent.value as number);
    });

    it('onDiameterSprayChange should change the property diameter spray of spray service properties if value is inside scope', () => {
        const properties = sprayServiceMock.toolProperties as SprayProperties;
        matSliderEvent = { source: matSliderSource, value: MAXIMUM_DIAMETER_SPRAY + 1 };
        component.onDiameterSprayChange(matSliderEvent);

        matSliderEvent = { source: matSliderSource, value: MINIMUM_DIAMETER_SPRAY - 1 };
        component.onDiameterSprayChange(matSliderEvent);
        expect(properties.diameterSpray).toEqual(MINIMUM_DIAMETER_SPRAY);
    });

    it('onDiameterDropsChange should change the property diameter spray of spray service properties if value is inside scope', () => {
        matSliderEvent = { source: matSliderSource, value: MAXIMUM_DIAMETER_DROPS / 2 };
        component.onDiameterDropsChange(matSliderEvent);
        const properties = sprayServiceMock.toolProperties as SprayProperties;
        expect(properties.diameterDrops).toEqual(matSliderEvent.value as number);
    });

    it('onDiameterDropsChange should change the property diameter spray of spray service properties if value is inside scope', () => {
        const properties = sprayServiceMock.toolProperties as SprayProperties;
        matSliderEvent = { source: matSliderSource, value: MAXIMUM_DIAMETER_DROPS + 1 };
        component.onDiameterDropsChange(matSliderEvent);

        matSliderEvent = { source: matSliderSource, value: MINIMUM_DIAMETER_DROPS - 1 };
        component.onDiameterDropsChange(matSliderEvent);
        expect(properties.diameterDrops).toEqual(MINIMUM_DIAMETER_DROPS);
    });

    it('onDropsPerSecondeChange should change the property diameter spray of spray service properties if value is inside scope', () => {
        matSliderEvent = { source: matSliderSource, value: MAXIMUM_DROPS_PER_SECOND / 2 };
        component.onDropsPerSecondeChange(matSliderEvent);
        const properties = sprayServiceMock.toolProperties as SprayProperties;
        expect(properties.dropsPerSecond).toEqual(matSliderEvent.value as number);
    });

    it('onDropsPerSecondeChange should change the property diameter spray of spray service properties if value is inside scope', () => {
        const properties = sprayServiceMock.toolProperties as SprayProperties;
        matSliderEvent = { source: matSliderSource, value: MAXIMUM_DROPS_PER_SECOND + 1 };
        component.onDropsPerSecondeChange(matSliderEvent);

        matSliderEvent = { source: matSliderSource, value: MINIMUM_DROPS_PER_SECOND - 1 };
        component.onDropsPerSecondeChange(matSliderEvent);
        expect(properties.dropsPerSecond).toEqual(MINIMUM_DROPS_PER_SECOND);
    });
});
