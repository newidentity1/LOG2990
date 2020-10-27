// import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';
import { DrawingService } from '@app/services/drawing/drawing.service';
// import { Drawing } from '@common/communication/drawing';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class UploadService {
    ref: AngularFireStorageReference;
    task: AngularFireUploadTask;
    url: string = '';
    constructor(public drawingService: DrawingService, private afStorage: AngularFireStorage) {}

    uploadCanvas(): void {
        // met l'image dans la fireBase
        const id = Math.random() + 'test';
        const baseImage = new Image();
        baseImage.src = this.drawingService.canvas.toDataURL('image/png');
        this.drawingService.canvas.toBlob((blob) => {
            this.ref = this.afStorage.ref(id);
            this.task = this.ref.put(blob);
            this.task.snapshotChanges().subscribe((event) => {
                // ajouter ici le telechargement des donnees si besoin
                if (event?.state === 'success') {
                    this.downloadCanvasURL();
                }
            });
        });
    }

    downloadCanvasURL(): void {
        const obs: Observable<Blob[]> = this.ref.getDownloadURL();
        obs.subscribe((data) => {
            for (const letter of data) {
                this.url = this.url + letter;
            }
            console.log(this.url);
            this.reset();
        });
    }

    reset(): void {
        this.url = '';
    }
}
