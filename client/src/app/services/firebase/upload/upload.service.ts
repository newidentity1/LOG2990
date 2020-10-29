import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { Drawing } from '@common/communication/drawing';
// import { Drawing } from '@common/communication/drawing';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class UploadService {
    ref: AngularFireStorageReference;
    task: AngularFireUploadTask;
    url: string = '';
    id: string = '';
    private drawingUrl: string = 'http://localhost:3000/api/drawings/';
    constructor(public drawingService: DrawingService, private afStorage: AngularFireStorage, private http: HttpClient) {}

    // met le canvas sous forme d'image dans la fireBase
    uploadCanvas(): void {
        this.id = Math.random() + 'test';
        const baseImage = new Image();
        baseImage.src = this.drawingService.canvas.toDataURL('image/png');
        this.drawingService.canvas.toBlob((blob) => {
            this.ref = this.afStorage.ref(this.id);
            this.task = this.ref.put(blob);
            this.task.snapshotChanges().subscribe((event) => {
                // ajouter ici le telechargement des donnees si besoin
                if (event?.state === 'success') {
                    this.downloadCanvasURL();
                }
            });
        });
    }

    // permet de recuperer l'URL de retour envoye par fireBase
    downloadCanvasURL(): void {
        const obs: Observable<Blob[]> = this.ref.getDownloadURL();
        obs.subscribe((data) => {
            for (const letter of data) {
                this.url = this.url + letter;
            }
            console.log(this.url);
            this.postDraw();
            this.reset();
        });
    }

    // envois un objet de type dessin avec l'url de fireBase au serveur
    postDraw(): void {
        const draw: Drawing = { _id: this.id, name: this.id, tags: [], url: this.url };
        this.http.post(this.drawingUrl, draw, { responseType: 'text' }).subscribe({
            // tslint:disable-next-line: no-any
            next: (data: any) => {
                console.log(data);
            },
            // tslint:disable-next-line: no-any
            error: (error: any) => {
                console.log(error);
            },
        });
    }

    reset(): void {
        this.id = '';
        this.url = '';
    }
}
