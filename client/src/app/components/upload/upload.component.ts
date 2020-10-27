import { Component, OnInit } from '@angular/core';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { Observable } from 'rxjs';
// import { Drawing } from '@common/communication/drawing';

@Component({
    selector: 'app-upload',
    templateUrl: './upload.component.html',
    styleUrls: ['./upload.component.scss'],
})
export class UploadComponent implements OnInit {
    filePath: string = '';
    ref: AngularFireStorageReference;
    task: AngularFireUploadTask;
    urlImage: string = '';
    dataImage: string = '';
    constructor(public drawingService: DrawingService, private afStorage: AngularFireStorage) {}

    uploadImage(): void {
        // met l'image dans la fireBase
        const id = 'test2';
        const baseImage = new Image();
        baseImage.src = this.drawingService.canvas.toDataURL('image/png');
        console.log(baseImage);
        const blob = new Blob([baseImage.src]);
        console.log('blob envoye');
        console.log(blob);
        this.ref = this.afStorage.ref(id);
        this.task = this.ref.put(blob);
        this.downloadImageURL(); // stock l'url de retour dans urlImage

        /************************************************************************************************************************** */
        const b: Blob[] = [];
        // recupere le  blob de la fireBase
        const xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';
        xhr.onload = () => {
            const blob1 = xhr.response; // image sous forme de blob ici
            console.log('blob recuperer');
            console.log(blob1);
            b.push(new Blob([blob1]));
        };
        xhr.open('GET', this.urlImage);
        xhr.send();
        console.log(b[0]);

        // transforme le blob en image
        const image = new Image();
        const reader = new window.FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
            image.src = reader.result as string;
        };
        console.log(image);
    }

    downloadImageURL(): void {
        const obs: Observable<Blob[]> = this.ref.getDownloadURL();
        obs.subscribe((data) => {
            for (const letter of data) {
                this.urlImage = this.urlImage + letter;
            }
        });
    }

    ngOnInit(): void {
        // TODO
    }
}
