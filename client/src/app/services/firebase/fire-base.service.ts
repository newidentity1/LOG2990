import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';
import { ResponseResult } from '@app/classes/response-result';
import { CommunicationService } from '@app/services/communication/communication.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { Drawing } from '@common/communication/drawing';
import { Observable, Subject } from 'rxjs';

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
    saveDrawingSubject: Subject<ResponseResult> = new Subject<ResponseResult>();

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
            } else if (event && (event.state === 'canceled' || event.state === 'error')) {
                this.emitSaveDrawingSubjectEvent(new ResponseResult(false, 'Erreur dans de sauvegarde du dessin dans la base de donnée!'));
                this.isDrawingSaving = false;
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
        this.ref.getDownloadURL().subscribe({
            next: (drawingUrl: string) => {
                this.postDrawing(drawingUrl);
                this.reset();
            },
            error: () => {
                const message = "Votre dessin n'a pas pu être transformé en image!";
                this.emitSaveDrawingSubjectEvent(new ResponseResult(false, message));
                this.reset();
                this.isDrawingSaving = false;
            },
        });
    }
    postDrawing(drawingURL: string): void {
        const drawing: Drawing = { _id: this.id, name: this.name, tags: this.drawingTags, url: drawingURL };
        this.communicationService.postDrawing(drawing).subscribe({
            next: (response: string) => {
                this.isDrawingSaving = false;
                this.emitSaveDrawingSubjectEvent(new ResponseResult(true, 'Votre dessin a été enregistré avec succès'));
            },
            error: (error: HttpErrorResponse) => {
                const message = error.status === 0 ? 'Le serveur est indisponible!' : error.error;

                this.emitSaveDrawingSubjectEvent(new ResponseResult(false, message));
                this.isDrawingSaving = false;
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

    emitSaveDrawingSubjectEvent(response: ResponseResult): void {
        this.saveDrawingSubject.next(response);
    }

    saveDrawingEventListener(): Observable<ResponseResult> {
        return this.saveDrawingSubject.asObservable();
    }
}
