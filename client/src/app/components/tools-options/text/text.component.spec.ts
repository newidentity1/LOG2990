import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatRadioChange, MatRadioModule, _MatRadioButtonBase } from '@angular/material/radio';
import { MatSlider, MatSliderChange, MatSliderModule } from '@angular/material/slider';
import { TextProperties } from '@app/classes/tools-properties/text-properties';
import { MAXIMUM_TEXT_SIZE, MINIMUM_TEXT_SIZE } from '@app/constants/constants';
import { TextAlignment } from '@app/enums/text-alignment.enum';
import { TextFont } from '@app/enums/text-font.enum';
import { TextService } from '@app/services/tools/text/text.service';
import { TextComponent } from './text.component';

describe('TextComponent', () => {
    let component: TextComponent;
    let fixture: ComponentFixture<TextComponent>;
    let textServiceSpy: jasmine.SpyObj<TextService>;
    let matSliderEvent: MatSliderChange;
    // tslint:disable-next-line: prefer-const / reason: needed for matSliderSource and matRadioSource as placeholders
    let matSliderSource: MatSlider;
    let matRadioEvent: MatRadioChange;
    // tslint:disable-next-line: prefer-const
    let matRadioSource: _MatRadioButtonBase;

    beforeEach(async(() => {
        textServiceSpy = jasmine.createSpyObj('TextService', [
            'setBold',
            'setItalic',
            'setFontText',
            'isTextInProgress',
            'setTextAlignment',
            'setSizeText',
        ]);

        TestBed.configureTestingModule({
            declarations: [TextComponent],
            imports: [MatSliderModule, MatRadioModule, FormsModule],
            providers: [{ provide: TextService, useValue: textServiceSpy }],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();

        textServiceSpy = TestBed.inject(TextService) as jasmine.SpyObj<TextService>;
        textServiceSpy.toolProperties = new TextProperties();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TextComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('onBoldChange should change isBold Value and call setBold of text service', () => {
        component.isBold = false;
        component.onBoldChange();
        expect(component.isBold).toBeTrue();
        expect(textServiceSpy.setBold).toHaveBeenCalled();
    });

    it('onItalicChange should change isBold Value and call setBold of text service', () => {
        component.isItalic = false;
        component.onItalicChange();
        expect(component.isItalic).toBeTrue();
        expect(textServiceSpy.setItalic).toHaveBeenCalled();
    });

    it('onFontChange should call setFontText of text service if value is in Enum TextFont and emit textPropertyChange is TextInProgress', () => {
        spyOn(component.textPropertyChange, 'emit');
        textServiceSpy.isTextInProgress.and.callFake(() => {
            return false;
        });
        matRadioEvent = { source: matRadioSource, value: TextFont.Arial };
        component.onFontChange(matRadioEvent);
        expect(textServiceSpy.setFontText).toHaveBeenCalledWith(matRadioEvent.value);
        expect(component.font).toEqual(matRadioEvent.value);
        expect(component.textPropertyChange.emit).not.toHaveBeenCalled();

        textServiceSpy.isTextInProgress.and.callFake(() => {
            return true;
        });
        matRadioEvent = { source: matRadioSource, value: TextFont.CourierNew };
        component.onFontChange(matRadioEvent);
        expect(textServiceSpy.setFontText).toHaveBeenCalledWith(matRadioEvent.value);
        expect(component.font).toEqual(matRadioEvent.value);
        expect(component.textPropertyChange.emit).toHaveBeenCalled();

        matRadioEvent = { source: matRadioSource, value: TextFont.Georgia };
        component.onFontChange(matRadioEvent);
        expect(textServiceSpy.setFontText).toHaveBeenCalledWith(matRadioEvent.value);
        expect(component.font).toEqual(matRadioEvent.value);

        matRadioEvent = { source: matRadioSource, value: TextFont.TimesNewRoman };
        component.onFontChange(matRadioEvent);
        expect(textServiceSpy.setFontText).toHaveBeenCalledWith(matRadioEvent.value);
        expect(component.font).toEqual(matRadioEvent.value);

        matRadioEvent = { source: matRadioSource, value: TextFont.Verdana };
        component.onFontChange(matRadioEvent);
        expect(textServiceSpy.setFontText).toHaveBeenCalledWith(matRadioEvent.value);
        expect(component.font).toEqual(matRadioEvent.value);
    });

    it('onFontChange should not call setFontText of text service if value is not in Enum TextFont', () => {
        matRadioEvent = { source: matRadioSource, value: '' };
        component.onFontChange(matRadioEvent);
        expect(textServiceSpy.setFontText).not.toHaveBeenCalled();
    });

    it('onSizeChange should call setSizeText of text service if value is inside scope and emit textPropertyChange if text in progress', () => {
        spyOn(component.textPropertyChange, 'emit');
        textServiceSpy.isTextInProgress.and.callFake(() => {
            return true;
        });
        matSliderEvent = { source: matSliderSource, value: MAXIMUM_TEXT_SIZE / 2 };
        component.onSizeChange(matSliderEvent);
        expect(textServiceSpy.setSizeText).toHaveBeenCalledWith(matSliderEvent.value);
        expect(component.textPropertyChange.emit).toHaveBeenCalled();
    });

    it('onSizeChange should call setSizeText of text service if value is inside scope and not emit if text isnt in progress', () => {
        spyOn(component.textPropertyChange, 'emit');
        textServiceSpy.isTextInProgress.and.callFake(() => {
            return false;
        });
        matSliderEvent = { source: matSliderSource, value: MAXIMUM_TEXT_SIZE / 2 };
        component.onSizeChange(matSliderEvent);
        expect(textServiceSpy.setSizeText).toHaveBeenCalledWith(matSliderEvent.value);
        expect(component.textPropertyChange.emit).not.toHaveBeenCalled();
    });

    it('onSizeChange should not call setSizeText of text service if value is outside scope', () => {
        matSliderEvent = { source: matSliderSource, value: MINIMUM_TEXT_SIZE - 1 };
        component.onSizeChange(matSliderEvent);
        expect(textServiceSpy.setSizeText).not.toHaveBeenCalled();
    });

    it('onTextAlignmentChange should call setTextAlignment of text service if value is in Enum TextAlignment', () => {
        matRadioEvent = { source: matRadioSource, value: TextAlignment.Left };
        component.onTextAlignmentChange(matRadioEvent);
        expect(textServiceSpy.setTextAlignment).toHaveBeenCalledWith(matRadioEvent.value);
        expect(component.textAlignment).toEqual(matRadioEvent.value);

        matRadioEvent = { source: matRadioSource, value: TextAlignment.Middle };
        component.onTextAlignmentChange(matRadioEvent);
        expect(textServiceSpy.setTextAlignment).toHaveBeenCalledWith(matRadioEvent.value);
        expect(component.textAlignment).toEqual(matRadioEvent.value);

        matRadioEvent = { source: matRadioSource, value: TextAlignment.Right };
        component.onTextAlignmentChange(matRadioEvent);
        expect(textServiceSpy.setTextAlignment).toHaveBeenCalledWith(matRadioEvent.value);
        expect(component.textAlignment).toEqual(matRadioEvent.value);
    });

    it('onTextAlignmentChange should not call setTextAlignment of text service if value is not in Enum TextAlignment', () => {
        matRadioEvent = { source: matRadioSource, value: '' };
        component.onTextAlignmentChange(matRadioEvent);
        expect(textServiceSpy.setFontText).not.toHaveBeenCalled();
    });

    it('isCurrentAlignment should return true if its the same alignment', () => {
        component.textAlignment = TextAlignment.Left;
        expect(component.isCurrentAlignment(TextAlignment.Left)).toBeTrue();
    });

    it('isCurrentAlignment should return false if its the same alignment', () => {
        component.textAlignment = TextAlignment.Left;
        expect(component.isCurrentAlignment(TextAlignment.Middle)).toBeFalse();
    });

    it('minimumTextSize should return MINIMUM_TEXT_SIZE', () => {
        expect(component.minimumTextSize).toEqual(MINIMUM_TEXT_SIZE);
    });

    it('maximumTextSize should return MAXIMUM_TEXT_SIZE', () => {
        expect(component.maximumTextSize).toEqual(MAXIMUM_TEXT_SIZE);
    });
});
