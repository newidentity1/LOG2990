import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RecentColorsComponent } from './recent-colors.component';

describe('RecentColorsComponent', () => {
    let component: RecentColorsComponent;
    let fixture: ComponentFixture<RecentColorsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [RecentColorsComponent],
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
