import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EraseComponent } from './erase.component';

describe('EraseComponent', () => {
    let component: EraseComponent;
    let fixture: ComponentFixture<EraseComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [EraseComponent],
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
