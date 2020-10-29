import { Injectable } from '@angular/core';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';
import { DrawingService } from '@app/services/drawing/drawing.service';
@Injectable({
    providedIn: 'root',
})
export class DeleteService {
    ref: AngularFireStorageReference;
    task: AngularFireUploadTask;
    constructor(public drawingService: DrawingService, private afStorage: AngularFireStorage) {}

    deleteImage(id: string): void {
        this.ref = this.afStorage.ref(id);
        this.ref.delete();
    }
}
