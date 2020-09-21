import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { MatSliderModule } from '@angular/material/slider';
import { EllipseComponent } from './ellipse.component';

describe('EllipseComponent', () => {
    let component: EllipseComponent;
    let fixture: ComponentFixture<EllipseComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [EllipseComponent],
            imports: [MatRadioModule, MatSliderModule, FormsModule],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EllipseComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
