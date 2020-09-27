import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSliderChange, MatSliderModule } from '@angular/material/slider';
import { ThicknessSliderComponent } from '@app/components/tools-options/thickness-slider/thickness-slider.component';
import { MINIMUM_THICKNESS } from '@app/constants/constants';
import { PencilService } from '@app/services/tools/pencil/pencil-service';
import { PencilComponent } from './pencil.component';

describe('PencilComponent', () => {
    let component: PencilComponent;
    let fixture: ComponentFixture<PencilComponent>;
    let pencilServiceStub: PencilService;
    // tslint:disable: no-any / reason: spy of functions
    let thicknessSpy: jasmine.SpyObj<any>;
    // tslint:enable: no-any

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PencilComponent, ThicknessSliderComponent],
            imports: [MatSliderModule],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
        pencilServiceStub = TestBed.inject(PencilService);

        thicknessSpy = spyOn(pencilServiceStub, 'setThickness').and.callThrough();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PencilComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should create', () => {
        component.onThicknessChange({ value: MINIMUM_THICKNESS } as MatSliderChange);
        expect(thicknessSpy).toHaveBeenCalled();
    });
});
