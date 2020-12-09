import { Component } from '@angular/core';
import { Sticker } from '@app/classes/sticker';
import { StampProperties } from '@app/classes/tools-properties/stamp-properties';
import { StampService } from '@app/services/tools/stamp/stamp.service';

@Component({
    selector: 'app-stamp-options',
    templateUrl: './stamp.component.html',
    styleUrls: ['./stamp.component.scss'],
})
export class StampComponent {
    stickersList: Sticker[] = [
        { id: 0, src: '../../../../assets/stamp/1.png', srcPreview: '../../../assets/stamp/1.png' },
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

    constructor(private stampService: StampService) {
        const stampProperties = this.stampService.toolProperties as StampProperties;
        this.angle = stampProperties.angle;
        this.size = stampProperties.size;
        this.currentSticker = stampProperties.currentSticker;
    }

    onStickerChange(sticker: Sticker): void {
        const stampProperties = this.stampService.toolProperties as StampProperties;
        stampProperties.currentSticker = sticker;
        this.currentSticker = sticker;
        this.stampService.updateImagePreviewURL();
    }
    onSizeChange(size: number): void {
        const stampProperties = this.stampService.toolProperties as StampProperties;
        stampProperties.size = size;
        this.stampService.updateImagePreviewURL();
    }

    isCurrentSticker(sticker: Sticker): boolean {
        return sticker === this.currentSticker;
    }
}
