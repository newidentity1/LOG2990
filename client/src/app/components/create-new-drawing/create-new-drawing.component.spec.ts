import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogMock } from '@app/classes/mat-dialog-test-helper';
import { AutomaticSavingService } from '@app/services/automatic-saving/automatic-saving.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { CreateNewDrawingComponent } from './create-new-drawing.component';

describe('CreateNewDrawingComponent', () => {
    let component: CreateNewDrawingComponent;
    let fixture: ComponentFixture<CreateNewDrawingComponent>;
    let drawingServiceSpy: jasmine.SpyObj<DrawingService>;
    let automaticSavingServiceSpy: jasmine.SpyObj<AutomaticSavingService>;
    // tslint:disable:no-any / reason: jasmine spy on function
    let dialogOpenSpy: jasmine.Spy<any>;

    beforeEach(async(() => {
        drawingServiceSpy = jasmine.createSpyObj('DrawingService', ['canvasEmpty', 'clearCanvas', 'emitCreateNewDrawingEvent']);
        automaticSavingServiceSpy = jasmine.createSpyObj('AutomaticSavingService', ['savedDrawingExists', 'recover']);

        TestBed.configureTestingModule({
            declarations: [CreateNewDrawingComponent],
            imports: [MatIconModule, MatTooltipModule],
            providers: [
                { provide: MatDialog, useClass: MatDialogMock },
                { provide: DrawingService, useValue: drawingServiceSpy },
                { provide: AutomaticSavingService, useValue: automaticSavingServiceSpy },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
        drawingServiceSpy = TestBed.inject(DrawingService) as jasmine.SpyObj<DrawingService>;
        dialogOpenSpy = spyOn<any>(TestBed.inject(MatDialog), 'open').and.callThrough();

        automaticSavingServiceSpy = TestBed.inject(AutomaticSavingService) as jasmine.SpyObj<AutomaticSavingService>;
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CreateNewDrawingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('createNewDrawing should call warningClearCanvas when canvas is not empty', () => {
        drawingServiceSpy.canvasEmpty.and.callFake(() => {
            return false;
        });

        const spyWarningClearCanvas = spyOn(component, 'warningClearCanvas').and.callFake(() => {
            return;
        });
        component.createNewDrawing();
        expect(spyWarningClearCanvas).toHaveBeenCalled();
    });

    it('createNewDrawing should emitCreateNewDrawingEvent when canvas is empty', () => {
        drawingServiceSpy.canvasEmpty.and.callFake(() => {
            return true;
        });
        component.createNewDrawing();
        expect(drawingServiceSpy.emitCreateNewDrawingEvent).toHaveBeenCalled();
    });

    it('createNewDrawing should check if a saved drawing exists when trying to create a new daring from the main page', () => {
        component.inMenu = true;
        component.createNewDrawing();
        expect(automaticSavingServiceSpy.savedDrawingExists).toHaveBeenCalled();
    });

    it('createNewDrawing should recover saved drawing exists when trying to create a new daring from the main page and saved drawing exists', () => {
        component.inMenu = true;
        automaticSavingServiceSpy.savedDrawingExists.and.returnValue(true);
        component.createNewDrawing();
        expect(automaticSavingServiceSpy.recover).toHaveBeenCalled();
    });

    it(' warningClearCanvas should open the dialog', () => {
        component.warningClearCanvas();
        expect(dialogOpenSpy).toHaveBeenCalled();
    });
});
