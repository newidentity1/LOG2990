import { Injectable } from '@angular/core';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';
import { CommunicationService } from '@app/services/communication/communication.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { Drawing } from '@common/communication/drawing';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class FireBaseService {
    ref: AngularFireStorageReference;
    task: AngularFireUploadTask;
    id: string = '';
    name: string = '';
    constructor(public drawingService: DrawingService, private afStorage: AngularFireStorage, private communicationService: CommunicationService) {}

    uploadCanvas(): void {
        this.id = Math.random() + this.name;
        this.drawingService.canvas.toBlob(this.uploadBlob);
    }

    uploadBlob(blob: Blob | null): void {
        this.ref = this.afStorage.ref(this.id);
        this.task = this.ref.put(blob);
        this.task.snapshotChanges().subscribe((event) => {
            if (event && event.state === 'success') {
                this.downloadCanvasURL();
            }
        });
    }

    downloadCanvasURL(): void {
        const downloadURLObservable: Observable<string> = this.ref.getDownloadURL();
        downloadURLObservable.subscribe((imageURL) => {
            this.postDrawing(imageURL);
            this.reset();
        });
    }
    postDrawing(drawingURL: string): void {
        const drawing: Drawing = { _id: this.id, name: this.name, tags: [], url: drawingURL };
        this.communicationService.postDrawing(drawing);
    }

    deleteImage(id: string): void {
        this.ref = this.afStorage.ref(id);
        this.ref.delete();
        this.reset();
    }
    reset(): void {
        this.id = '';
    }
}
