import { TextAlignment } from '@app/enums/text-alignment.enum';
import { TextFont } from '@app/enums/text-font.enum';
import { BasicToolProperties } from './basic-tool-properties';
export class TextProperties extends BasicToolProperties {
    isBold: boolean = false;
    isItalic: boolean = false;
    font: TextFont = TextFont.TimesNewRoman;
    size: number = 10;
    textAlignment: TextAlignment = TextAlignment.Left;
}
