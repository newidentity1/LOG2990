import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSliderChange, MatSliderModule } from '@angular/material/slider';
import { ThicknessSliderComponent } from '@app/components/tools-options/thickness-slider/thickness-slider.component';
import { MAXIMUM_THICKNESS, MINIMUM_THICKNESS } from '@app/constants/constants';
import { EraseService } from '@app/services/tools/erase/erase.service';
import { EraseComponent } from './erase.component';

describe('EraseComponent', () => {
    let component: EraseComponent;
    let fixture: ComponentFixture<EraseComponent>;
    let eraseServiceMock: jasmine.SpyObj<EraseService>;
    // tslint:disable-next-line: no-any / reason: spy of functions
    let thicknessSpy: jasmine.SpyObj<any>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [EraseComponent, ThicknessSliderComponent],
            imports: [MatSliderModule],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
        eraseServiceMock = TestBed.inject(EraseService) as jasmine.SpyObj<EraseService>;
        thicknessSpy = spyOn(eraseServiceMock, 'setThickness').and.callThrough();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EraseComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('onThicknessChange should call setThickness of pencilService if value is inside scope', () => {
        const matSliderEvent = { value: MAXIMUM_THICKNESS / 2 } as MatSliderChange;
        component.onThicknessChange(matSliderEvent);
        expect(thicknessSpy).toHaveBeenCalledWith(MAXIMUM_THICKNESS / 2);
    });

    it('onThicknessChange should not call setThickness of pencilService if value is outside scope', () => {
        const matSliderEvent = { value: MINIMUM_THICKNESS - 1 } as MatSliderChange;
        component.onThicknessChange(matSliderEvent);
        expect(thicknessSpy).toHaveBeenCalledWith(matSliderEvent.value);
    });
});
