import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ThicknessSliderComponent } from '@app/components/tools-options/thickness-slider/thickness-slider.component';
import { EraseComponent } from './erase.component';

describe('EraseComponent', () => {
    let component: EraseComponent;
    let fixture: ComponentFixture<EraseComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [EraseComponent, ThicknessSliderComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EraseComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
