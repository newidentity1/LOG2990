import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { Color } from '@app/classes/color/color';
import { MatDialogMock } from '@app/classes/mat-dialog-test-helper';
import { BLACK, WHITE } from '@app/constants/constants';
import { ColorPickerService } from '@app/services/color-picker/color-picker.service';
import { BehaviorSubject } from 'rxjs';
import { ColorToolComponent } from './color-tool.component';

describe('ColorToolComponent', () => {
    let component: ColorToolComponent;
    let fixture: ComponentFixture<ColorToolComponent>;

    let colorPickerServiceSpy: jasmine.SpyObj<ColorPickerService>;
    // tslint:disable:no-any / reason: jasmine spy
    let dialogOpenSpy: jasmine.Spy<any>;

    beforeEach(async(() => {
        colorPickerServiceSpy = jasmine.createSpyObj('ColorPickerService', ['swapColors', 'resetSelectedColor']);

        TestBed.configureTestingModule({
            declarations: [ColorToolComponent],
            providers: [
                { provide: ColorPickerService, useValue: colorPickerServiceSpy },
                { provide: MatDialog, useClass: MatDialogMock },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();

        colorPickerServiceSpy = TestBed.inject(ColorPickerService) as jasmine.SpyObj<ColorPickerService>;
        colorPickerServiceSpy.primaryColor = new BehaviorSubject<Color>(new Color(BLACK));
        colorPickerServiceSpy.secondaryColor = new BehaviorSubject<Color>(new Color(WHITE));
        dialogOpenSpy = spyOn<any>(TestBed.inject(MatDialog), 'open').and.callThrough();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ColorToolComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it(' openPrimaryColorPicker should open dialog', () => {
        component.openPrimaryColorPicker();
        expect(dialogOpenSpy).toHaveBeenCalled();
    });

    it(' openSecondaryColorPicker should open dialog', () => {
        component.openSecondaryColorPicker();
        expect(dialogOpenSpy).toHaveBeenCalled();
    });

    it(' getPrimaryColor should return primary color from colorPickerService', () => {
        const returnedColor = component.getPrimaryColor();
        expect(returnedColor).toBeTruthy();
        expect(returnedColor).toEqual(colorPickerServiceSpy.primaryColor.getValue().toStringRGBA());
    });

    it(' getSecondaryColor should return secondary color from colorPickerService', () => {
        const returnedColor = component.getSecondaryColor();
        expect(returnedColor).toBeTruthy();
        expect(returnedColor).toEqual(colorPickerServiceSpy.secondaryColor.getValue().toStringRGBA());
    });

    it(' onSwapColors should call swapColors of colorPickerService', () => {
        component.onSwapColors();
        expect(colorPickerServiceSpy.swapColors).toHaveBeenCalled();
    });

    it(' openDialog should call resetSelectedColor with false if primary color dialog is opened', () => {
        // tslint:disable-next-line:no-string-literal / reason: accessing private property
        component['openDialog'](false);
        expect(colorPickerServiceSpy.resetSelectedColor).toHaveBeenCalledWith(false);
    });

    it(' openDialog should call resetSelectedColor with false if primary color dialog is opened', () => {
        // tslint:disable-next-line:no-string-literal / reason: accessing private property
        component['openDialog'](true);
        expect(colorPickerServiceSpy.resetSelectedColor).toHaveBeenCalledWith(true);
    });
});
