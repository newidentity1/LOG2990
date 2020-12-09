import { Sticker } from '@app/classes/sticker';
import { BasicToolProperties } from './basic-tool-properties';

export class StampProperties extends BasicToolProperties {
    stickersList: Sticker[] = [
        { id: 0, src: '../../../../assets/stamp/1.png', srcPreview: '../../../assets/stamp/1.png' },
        { id: 1, src: '../../../../assets/stamp/2.png', srcPreview: '../../../assets/stamp/2.png' },
        { id: 2, src: '../../../../assets/stamp/3.png', srcPreview: '../../../assets/stamp/3.png' },
        { id: 3, src: '../../../../assets/stamp/4.png', srcPreview: '../../../assets/stamp/4.png' },
        { id: 4, src: '../../../../assets/stamp/5.png', srcPreview: '../../../assets/stamp/5.png' },
        { id: 5, src: '../../../../assets/stamp/6.png', srcPreview: '../../../assets/stamp/6.png' },
        { id: 6, src: '../../../../assets/stamp/7.png', srcPreview: '../../../assets/stamp/7.png' },
        { id: 7, src: '../../../../assets/stamp/8.png', srcPreview: '../../../assets/stamp/8.png' },
    ];
    angle: number = 0;
    size: number = 100;
    currentSticker: Sticker = this.stickersList[0];
}
