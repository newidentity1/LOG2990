import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SVGFilterComponent } from './svgfilter.component';

describe('SVGFilterComponent', () => {
    let component: SVGFilterComponent;
    let fixture: ComponentFixture<SVGFilterComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SVGFilterComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SVGFilterComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
