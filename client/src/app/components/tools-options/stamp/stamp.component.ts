import { Component, OnInit } from '@angular/core';
import { Sticker } from '@app/classes/sticker';
import { StampService } from '@app/services/tools/stamp/stamp.service';

@Component({
    selector: 'app-stamp-options',
    templateUrl: './stamp.component.html',
    styleUrls: ['./stamp.component.scss'],
})
export class StampComponent implements OnInit {
    stickersList: Sticker[] = [
        { id: 0, src: '../../../../assets/stamp/1.png', srcPriview: '../../../assets/stamp/1.png' },
        { id: 1, src: '../../../../assets/stamp/2.png', srcPriview: '../../../assets/stamp/2.png' },
        { id: 2, src: '../../../../assets/stamp/3.png', srcPriview: '../../../assets/stamp/3.png' },
        { id: 3, src: '../../../../assets/stamp/4.png', srcPriview: '../../../assets/stamp/4.png' },
        { id: 4, src: '../../../../assets/stamp/5.png', srcPriview: '../../../assets/stamp/5.png' },
        { id: 5, src: '../../../../assets/stamp/6.png', srcPriview: '../../../assets/stamp/6.png' },
        { id: 6, src: '../../../../assets/stamp/7.png', srcPriview: '../../../assets/stamp/7.png' },
        { id: 7, src: '../../../../assets/stamp/8.png', srcPriview: '../../../assets/stamp/8.png' },
    ];
    constructor(private stampService: StampService) {}

    ngOnInit(): void {
        //
    }

    onClick(src: string): void {
        console.log(src);
        this.stampService.src = src;
    }
}
