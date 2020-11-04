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
    canvasData: ImageData;
    drawingTags: string[] = [];
    isDrawingSaving: boolean = false;

    constructor(public drawingService: DrawingService, private afStorage: AngularFireStorage, private communicationService: CommunicationService) {}

    uploadCanvas(): void {
        this.id = Math.random() + this.name;
        this.isDrawingSaving = true;

        const context = this.drawingService.baseCtx;
        const width = context.canvas.width;
        const height = context.canvas.height;

        this.canvasData = context.getImageData(0, 0, width, height);

        const compositeOperation = context.globalCompositeOperation;
        context.globalCompositeOperation = 'destination-over';
        context.fillStyle = '#FFFFFF';
        context.fillRect(0, 0, width, height);
        context.globalCompositeOperation = compositeOperation;

        this.drawingService.canvas.toBlob(this.uploadBlob.bind(this));
    }

    uploadBlob(blob: Blob | null): void {
        this.ref = this.afStorage.ref(this.id);
        this.task = this.ref.put(blob);
        this.restoreCanvas();
        this.task.snapshotChanges().subscribe((event) => {
            if (event && event.state === 'success') {
                this.downloadCanvasURL();
            }
        });
    }

    restoreCanvas(): void {
        const context = this.drawingService.baseCtx;
        const width = context.canvas.width;
        const height = context.canvas.height;
        this.drawingService.baseCtx.clearRect(0, 0, width, height);
        this.drawingService.baseCtx.putImageData(this.canvasData, 0, 0);
    }

    downloadCanvasURL(): void {
        const downloadURLObservable: Observable<string> = this.ref.getDownloadURL();
        downloadURLObservable.subscribe((imageURL) => {
            this.postDrawing(imageURL);
            this.reset();
        });
    }
    postDrawing(drawingURL: string): void {
        console.log(drawingURL);
        const drawing: Drawing = { _id: this.id, name: this.name, tags: this.drawingTags, url: drawingURL };
        this.communicationService.postDrawing(drawing).subscribe({
            next: (response: string) => {
                console.log(response);
                this.isDrawingSaving = false;
            },
            error: (error: string) => {
                console.log(error);
            },
        });
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
