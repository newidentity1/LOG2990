import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContinueDrawingComponent } from '@app/components/continue-drawing/continue-drawing.component';
import { AutomaticSavingService } from '@app/services/automatic-saving/automatic-saving.service';

describe('ContinueDrawingComponent', () => {
    let component: ContinueDrawingComponent;
    let fixture: ComponentFixture<ContinueDrawingComponent>;
    let automaticSavingServiceSpy: jasmine.SpyObj<AutomaticSavingService>;

    beforeEach(async(() => {
        automaticSavingServiceSpy = jasmine.createSpyObj('AutomaticSavingService', ['recover', 'savedDrawingExists']);
        TestBed.configureTestingModule({
            declarations: [ContinueDrawingComponent],
            providers: [{ provide: AutomaticSavingService, useValue: automaticSavingServiceSpy }],
        }).compileComponents();

        automaticSavingServiceSpy = TestBed.inject(AutomaticSavingService) as jasmine.SpyObj<AutomaticSavingService>;
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ContinueDrawingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('continueDrawing should call recover of automaticSavingService', () => {
        component.continueDrawing();
        expect(automaticSavingServiceSpy.recover).toHaveBeenCalled();
    });

    it('canContinueDrawing should call savedDrawingExists of automaticSavingService', () => {
        component.canContinueDrawing();
        expect(automaticSavingServiceSpy.savedDrawingExists).toHaveBeenCalled();
    });
});
