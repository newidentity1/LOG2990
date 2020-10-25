import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Component({
    selector: 'app-upload',
    templateUrl: './upload.component.html',
    styleUrls: ['./upload.component.scss'],
})
export class UploadComponent implements OnInit {
    filePath: String;
    constructor(public drawingService: DrawingService, private afStorage: AngularFireStorage) {}
    uploadImage(): void {
        this.saveImage();
        // console.log(this.filePath);
        this.afStorage.upload('/images' + Math.random() + this.filePath, this.filePath);
    }

    saveImage(): void {
        const myImage = this.drawingService.canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
        // window.location.href = myImage;
        const link = document.createElement('a');
        link.download = 'image.png';
        link.href = myImage;
        link.click();
    }

    ngOnInit(): void {
        // TODO
    }
}
