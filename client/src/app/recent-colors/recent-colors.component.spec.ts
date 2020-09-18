import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RecentColorsComponent } from './recent-colors.component';

describe('RecentColorsComponent', () => {
    let component: RecentColorsComponent;
    let fixture: ComponentFixture<RecentColorsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [RecentColorsComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(RecentColorsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
