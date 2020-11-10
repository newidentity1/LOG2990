import { Component } from '@angular/core';
import { MatRadioChange } from '@angular/material/radio';
import { MatSliderChange } from '@angular/material/slider';
import { TextProperties } from '@app/classes/tools-properties/text-properties';
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
    size: number = 10;
    textAlignments: TextAlignment[] = [TextAlignment.Left, TextAlignment.Middle, TextAlignment.Right];
    textAlignment: string = TextAlignment.Left;

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
        this.font = event.value;
        this.textService.setThickness(event.value);
    }

    onSizeChange(event: MatSliderChange): void {
        this.size = event.value ? event.value : this.size;
        this.textService.setSizeText(event.value);
    }

    onTextAlignment(event: MatRadioChange): void {
        this.textAlignment = event.value;
        this.textService.setTextAlignment(event.value);
    }

    isCurrentAlignment(textAlignment: string): boolean {
        return textAlignment === this.textAlignment;
    }
}
