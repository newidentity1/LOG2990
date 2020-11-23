import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContinueDrawingComponent } from '@app/components/continue-drawing/continue-drawing.component';

describe('ContinueDrawingComponent', () => {
    let component: ContinueDrawingComponent;
    let fixture: ComponentFixture<ContinueDrawingComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ContinueDrawingComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ContinueDrawingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
