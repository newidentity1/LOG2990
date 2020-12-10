import { Component, EventEmitter, Output } from '@angular/core';
import { MatRadioChange } from '@angular/material/radio';
import { MatSliderChange } from '@angular/material/slider';
import { TextProperties } from '@app/classes/tools-properties/text-properties';
import { MAXIMUM_TEXT_SIZE, MINIMUM_TEXT_SIZE } from '@app/constants/constants';
import { TextAlignment } from '@app/enums/text-alignment.enum';
import { TextFont } from '@app/enums/text-font.enum';
import { TextService } from '@app/services/tools/text/text.service';

@Component({
    selector: 'app-text',
    templateUrl: './text.component.html',
    styleUrls: ['../../sidebar/sidebar.component.scss'],
})
export class TextComponent {
    isBold: boolean = false;
    isItalic: boolean = false;
    fonts: typeof TextFont = TextFont;
    font: string = TextFont.Arial;
    size: number = 20;
    textAlignments: TextAlignment[] = [TextAlignment.Left, TextAlignment.Middle, TextAlignment.Right];
    textAlignment: string = TextAlignment.Left;
    @Output() textPropertyChange: EventEmitter<void> = new EventEmitter();

    constructor(private textService: TextService) {
        const textProperties = this.textService.toolProperties as TextProperties;
        this.isBold = textProperties.isBold;
        this.isItalic = textProperties.isItalic;
        this.font = textProperties.font;
        this.size = textProperties.size;
        this.textAlignment = textProperties.textAlignment;
    }

    onBoldChange(): void {
        this.isBold = !this.isBold;
        this.textService.setBold(this.isBold);
    }

    onItalicChange(): void {
        this.isItalic = !this.isItalic;
        this.textService.setItalic(this.isItalic);
    }

    onFontChange(event: MatRadioChange): void {
        for (const value in TextFont) {
            if (TextFont[value as keyof typeof TextFont] === event.value) {
                this.font = event.value;
                this.textService.setFontText(event.value);
                if (this.textService.isTextInProgress()) this.textPropertyChange.emit();
                break;
            }
        }
    }

    onSizeChange(event: MatSliderChange): void {
        if (event.value !== null && event.value >= MINIMUM_TEXT_SIZE && event.value <= MAXIMUM_TEXT_SIZE) {
            this.size = event.value;
            this.textService.setSizeText(event.value);
            if (this.textService.isTextInProgress()) this.textPropertyChange.emit();
        }
    }

    onTextAlignmentChange(event: MatRadioChange): void {
        for (const value in TextAlignment) {
            if (TextAlignment[value as keyof typeof TextAlignment] === event.value) {
                this.textAlignment = event.value;
                this.textService.setTextAlignment(event.value);
                break;
            }
        }
    }

    isCurrentAlignment(textAlignment: string): boolean {
        return textAlignment === this.textAlignment;
    }

    get minimumTextSize(): number {
        return MINIMUM_TEXT_SIZE;
    }

    get maximumTextSize(): number {
        return MAXIMUM_TEXT_SIZE;
    }
}
