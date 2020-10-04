import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EyedropperComponent } from './eyedropper.component';

describe('EyedropperComponent', () => {
    let component: EyedropperComponent;
    let fixture: ComponentFixture<EyedropperComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [EyedropperComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EyedropperComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
