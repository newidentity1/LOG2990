import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSlider, MatSliderChange, MatSliderModule } from '@angular/material/slider';
import { MAXIMUM_THICKNESS } from '@app/constants/constants';
import { BucketService } from '@app/services/tools/bucket/bucket.service';
import { BucketComponent } from './bucket.component';

describe('BucketComponent', () => {
    let component: BucketComponent;
    let fixture: ComponentFixture<BucketComponent>;
    let matSliderEvent: MatSliderChange;
    // tslint:disable-next-line:prefer-const / reason: needed for matSliderSource and matRadioSource as placeholders
    let matSliderSource: MatSlider;
    let bucketServiceMock: jasmine.SpyObj<BucketService>;
    beforeEach(async(() => {
        bucketServiceMock = jasmine.createSpyObj('BucketService', ['setTolerance']);
        TestBed.configureTestingModule({
            declarations: [BucketComponent],
            imports: [MatSliderModule, MatSliderModule],
            providers: [{ provide: BucketService, useValue: bucketServiceMock }],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(BucketComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('onThicknessChange should call setThickness of rectangle service if value is inside scope', () => {
        matSliderEvent = { source: matSliderSource, value: MAXIMUM_THICKNESS / 2 };
        component.onToleranceChange(matSliderEvent);
        expect(bucketServiceMock.setTolerance).toHaveBeenCalled();
    });
});
