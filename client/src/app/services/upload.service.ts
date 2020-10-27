// import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';
import { DrawingService } from '@app/services/drawing/drawing.service';
// import { Drawing } from '@common/communication/drawing';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class UploadService {
    ref: AngularFireStorageReference;
    task: AngularFireUploadTask;
    urlImage: string = '';
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
            // tslint:disable-next-line:no-unused-expression
            this.task
                .snapshotChanges()
                .pipe(
                    finalize(() => {
                        this.downloadCanvasURL();
                        this.url = this.urlImage;
                        console.log(this.urlImage);
                        this.reset();
                    }),
                )
                .subscribe();
        });
    }

    downloadCanvasURL(): void {
        const obs: Observable<Blob[]> = this.ref.getDownloadURL();
        obs.subscribe((data) => {
            for (const letter of data) {
                this.urlImage = this.urlImage + letter;
            }
        });
    }

    reset(): void {
        this.urlImage = '';
        this.url = '';
    }
}
