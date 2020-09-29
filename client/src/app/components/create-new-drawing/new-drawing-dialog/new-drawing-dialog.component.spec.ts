import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewDrawingDialogComponent } from './new-drawing-dialog.component';

describe('NewDrawingDialogComponent', () => {
    let component: NewDrawingDialogComponent;
    let fixture: ComponentFixture<NewDrawingDialogComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [NewDrawingDialogComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(NewDrawingDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
