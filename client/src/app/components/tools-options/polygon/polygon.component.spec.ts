import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSliderModule } from '@angular/material/slider';
import { PolygonComponent } from './polygon.component';

describe('PolygonComponent', () => {
    let component: PolygonComponent;
    let fixture: ComponentFixture<PolygonComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PolygonComponent],
            imports: [MatSliderModule],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PolygonComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
