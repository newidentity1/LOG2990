import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Color } from '@app/classes/color/color';
import { BLACK, MAX_RECENT_COLORS_SIZE, WHITE } from '@app/constants/constants';
import { MouseButton } from '@app/enums/mouse-button.enum';
import { ColorPickerService } from '@app/services/color-picker/color-picker.service';
import { BehaviorSubject } from 'rxjs';
import { ColorPickerComponent } from './color-picker.component';

describe('ColorPickerComponent', () => {
    let component: ColorPickerComponent;
    let fixture: ComponentFixture<ColorPickerComponent>;

    let colorPickerServiceSpy: jasmine.SpyObj<ColorPickerService>;
    let mouseEvent: MouseEvent;

    const mockDialogRef = {
        close: jasmine.createSpy('close'),
    };

    beforeEach(async(() => {
        colorPickerServiceSpy = jasmine.createSpyObj('ColorPickerService', ['onMouseDown', 'onMouseMove', 'onMouseUp', 'confirmSelectedColor']);

        TestBed.configureTestingModule({
            declarations: [ColorPickerComponent],
            imports: [ReactiveFormsModule],
            providers: [
                { provide: ColorPickerService, useValue: colorPickerServiceSpy },
                { provide: MatDialogRef, useValue: mockDialogRef },
                { provide: MAT_DIALOG_DATA, useValue: [] },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();

        colorPickerServiceSpy = TestBed.inject(ColorPickerService) as jasmine.SpyObj<ColorPickerService>;
        colorPickerServiceSpy.primaryColor = new BehaviorSubject<Color>(new Color(BLACK));
        colorPickerServiceSpy.secondaryColor = new BehaviorSubject<Color>(new Color(WHITE));
        colorPickerServiceSpy.selectedColor = new Color('FF0000');
        colorPickerServiceSpy.recentColors = [];
        for (let index = 0; index < MAX_RECENT_COLORS_SIZE; index++) {
            colorPickerServiceSpy.recentColors.push(new Color(BLACK));
        }

        mouseEvent = {
            offsetX: 25,
            offsetY: 25,
            button: MouseButton.Left,
            // tslint:disable-next-line:no-empty / reason: mock preventDefault of MouseEvent
            preventDefault: () => {},
        } as MouseEvent;
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ColorPickerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it(' mouseDown should call onMouseDown of colorPickerService', () => {
        component.onMouseDown(mouseEvent);
        expect(colorPickerServiceSpy.onMouseDown).toHaveBeenCalledWith(mouseEvent);
    });

    it(' mouseMove should call onMouseMove of colorPickerService', () => {
        component.onMouseMove(mouseEvent);
        expect(colorPickerServiceSpy.onMouseMove).toHaveBeenCalledWith(mouseEvent);
    });

    it(' mouseUp should call onMouseUp of colorPickerService', () => {
        component.onMouseUp(mouseEvent);
        expect(colorPickerServiceSpy.onMouseUp).toHaveBeenCalledWith(mouseEvent);
    });

    it(' getCurrentColor should return selectedColor from colorPickerService', () => {
        const returnedSelectedColors = component.getCurrentColor();
        expect(returnedSelectedColors).toBeTruthy();
        expect(returnedSelectedColors).toEqual(colorPickerServiceSpy.selectedColor);
    });

    it(' getPreviousColor should return primary color if isSecondaryColorPicker is false', () => {
        // tslint:disable-next-line:no-string-literal / reason: accessing private member
        component['data'].isSecondaryColorPicker = false;
        const returnedColor = component.getPreviousColor();
        expect(returnedColor).toBeTruthy();
        expect(returnedColor).toEqual(colorPickerServiceSpy.primaryColor.getValue());
    });

    it(' getPreviousColor should return secondary color if isSecondaryColorPicker is true', () => {
        // tslint:disable-next-line:no-string-literal / reason: accessing private member
        component['data'].isSecondaryColorPicker = true;
        const returnedColor = component.getPreviousColor();
        expect(returnedColor).toBeTruthy();
        expect(returnedColor).toEqual(colorPickerServiceSpy.secondaryColor.getValue());
    });

    it(' onDialogClose should call confirmSelectedColor with false if isSecondaryColorPicker is false', () => {
        // tslint:disable-next-line:no-string-literal / reason: accessing private member
        component['data'].isSecondaryColorPicker = false;
        component.onDialogClose();
        expect(colorPickerServiceSpy.confirmSelectedColor).toHaveBeenCalledWith(false);
    });

    it(' onDialogClose should call confirmSelectedColor with true if isSecondaryColorPicker is true', () => {
        // tslint:disable-next-line:no-string-literal / reason: accessing private member
        component['data'].isSecondaryColorPicker = true;
        component.onDialogClose();
        expect(colorPickerServiceSpy.confirmSelectedColor).toHaveBeenCalledWith(true);
    });

    it(' onDialogClose should close dialog', () => {
        component.onDialogClose();
        expect(mockDialogRef.close).toHaveBeenCalled();
    });

    it(' width should return canvas width', () => {
        const returnedWidth = component.width;
        // tslint:disable-next-line:no-string-literal / reason: accessing private member
        const expectedWidth = component['canvasSize'].x;
        expect(returnedWidth).toEqual(expectedWidth);
    });

    it(' height should return canvas height', () => {
        const returnedHeight = component.height;
        // tslint:disable-next-line:no-string-literal / reason: accessing private member
        const expectedHeight = component['canvasSize'].x;
        expect(returnedHeight).toEqual(expectedHeight);
    });
});
