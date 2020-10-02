import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { CreateNewDrawingComponent } from './create-new-drawing.component';

class MatDialogMock {
    open(): {} {
        return {};
    }
}

describe('CreateNewDrawingComponent', () => {
    let component: CreateNewDrawingComponent;
    let fixture: ComponentFixture<CreateNewDrawingComponent>;
    let drawingServiceSpy: jasmine.SpyObj<DrawingService>;
    // tslint:disable:no-any / reason: jasmine spy
    let dialogOpenSpy: jasmine.Spy<any>;

    beforeEach(async(() => {
        drawingServiceSpy = jasmine.createSpyObj('DrawingService', ['canvasEmpty', 'clearCanvas', 'emitCreateNewDrawingEvent']);

        TestBed.configureTestingModule({
            declarations: [CreateNewDrawingComponent],
            imports: [MatIconModule, MatTooltipModule],
            providers: [
                { provide: MatDialog, useClass: MatDialogMock },
                { provide: DrawingService, useValue: drawingServiceSpy },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
        drawingServiceSpy = TestBed.inject(DrawingService) as jasmine.SpyObj<DrawingService>;
        dialogOpenSpy = spyOn<any>(TestBed.inject(MatDialog), 'open').and.callThrough();
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
        // tslint:disable-next-line: no-any / reason spying a function
        const spyWarningClearCanvas = spyOn<any>(component, 'warningClearCanvas').and.callFake(() => {
            return;
        });
        component.createNewDrawing();
        expect(spyWarningClearCanvas).toHaveBeenCalled();
    });

    it('createNewDrawing should call clearCanvas and emitCreateNewDrawingEvent when canvas is empty', () => {
        drawingServiceSpy.canvasEmpty.and.callFake(() => {
            return true;
        });
        component.createNewDrawing();
        expect(drawingServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(drawingServiceSpy.emitCreateNewDrawingEvent).toHaveBeenCalled();
    });

    it(' warningClearCanvas should open the dialog', () => {
        // tslint:disable-next-line: no-any / reason: spying on function
        component.warningClearCanvas();
        expect(dialogOpenSpy).toHaveBeenCalled();
    });
});
