import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Color } from '@app/classes/color/color';
import { BLACK } from '@app/constants/constants';
import { ColorPickerFormComponent } from './color-picker-form.component';

describe('ColorPickerFormComponent', () => {
    let component: ColorPickerFormComponent;
    let fixture: ComponentFixture<ColorPickerFormComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ColorPickerFormComponent],
            imports: [ReactiveFormsModule, FormsModule, MatFormFieldModule, MatInputModule, BrowserAnimationsModule],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ColorPickerFormComponent);
        component = fixture.componentInstance;
        component.color = new Color();
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it(' onRedChange should change colors hex if value is valid', () => {
        component.color = new Color(BLACK);
        component.onRedChange('FF');
        expect(component.color.hex).toEqual('FF0000');
    });

    it(' onRedChange should not change colors hex if value is invalid', () => {
        component.color = new Color(BLACK);
        component.onRedChange('LL');
        expect(component.color.hex).toEqual(BLACK);
    });

    it(' onGreenChange should change colors hex if value is valid', () => {
        component.color = new Color(BLACK);
        component.onGreenChange('FF');
        expect(component.color.hex).toEqual('00FF00');
    });

    it(' onGreenChange should not change colors hex if value is invalid', () => {
        component.color = new Color(BLACK);
        component.onGreenChange('LL');
        expect(component.color.hex).toEqual(BLACK);
    });

    it(' onBlueChange should change colors hex if value is valid', () => {
        component.color = new Color(BLACK);
        component.onBlueChange('FF');
        expect(component.color.hex).toEqual('0000FF');
    });

    it(' onBlueChange should not change colors hex if value is invalid', () => {
        component.color = new Color(BLACK);
        component.onBlueChange('LL');
        expect(component.color.hex).toEqual(BLACK);
    });

    it(' changeOpacity should change opacity of color if value is valid', () => {
        const expectedOpacity = 0.5;
        component.color = new Color(BLACK, 1.0);
        component.changeOpacity(expectedOpacity);
        expect(component.color.opacity).toEqual(expectedOpacity);
    });

    it(' changeOpacity should not change opacity of color if value is invalid', () => {
        const expectedOpacity = 1.0;
        component.color = new Color(BLACK, expectedOpacity);
        component.changeOpacity(2);
        expect(component.color.opacity).toEqual(expectedOpacity);
    });

    it(' changeHex should change colors hex if value is valid', () => {
        const expectedHex = 'AC12FF';
        component.color = new Color(BLACK);
        component.changeHex(expectedHex);
        expect(component.color.hex).toEqual(expectedHex);
    });

    it(' changeHex should not change colors hex if value is invalid', () => {
        component.color = new Color(BLACK);
        component.changeHex('LLLLLL');
        expect(component.color.hex).toEqual(BLACK);
    });

    it(' closeDialog should emit confirm event', () => {
        const emitSpy = spyOn(component.confirm, 'emit');
        component.closeDialog();
        expect(emitSpy).toHaveBeenCalled();
    });

    it(' form should be invalid if it contains an invalid value', () => {
        component.redForm.setValue('');
        const isValid = component.isColorInvalid();
        expect(isValid).toBeTruthy();
    });

    it(' form should be valid if all values are valid', () => {
        component.hexForm.setValue(BLACK);
        component.alphaForm.setValue(1);
        const isValid = component.isColorInvalid();
        expect(isValid).toBeFalsy();
    });
});
