import { TextAlignment } from '@app/enums/text-alignment.enum';
import { TextFont } from '@app/enums/text-font.enum';
import { BasicToolProperties } from './basic-tool-properties';
export class TextProperties extends BasicToolProperties {
    isBold: boolean = false;
    isItalic: boolean = false;
    fonts: string[] = [TextFont.Arial, TextFont.CourierNew, TextFont.SansSerif, TextFont.Serif, TextFont.TimesNewRoman, TextFont.Verdana];
    font: string = TextFont.Arial;
    size: number = 10;
    textAlignments: string[] = [TextAlignment.Left, TextAlignment.Middle, TextAlignment.Right];
    textAlignment: string = TextAlignment.Left;
}
