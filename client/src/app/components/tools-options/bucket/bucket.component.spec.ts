import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSliderModule } from '@angular/material/slider';
import { BucketComponent } from './bucket.component';

describe('BucketComponent', () => {
    let component: BucketComponent;
    let fixture: ComponentFixture<BucketComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [BucketComponent],
            imports: [MatSliderModule],
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
});
