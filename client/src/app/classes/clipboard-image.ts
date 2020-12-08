import { SelectionType } from '@app/enums/selection-type.enum';

export interface ClipboardImage {
    image: ImageData;
    selectionType: SelectionType;
}
