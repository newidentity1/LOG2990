import { Component } from '@angular/core';
import { UploadService } from '@app/services/upload.service';
@Component({
    selector: 'app-upload',
    templateUrl: './upload.component.html',
    styleUrls: ['./upload.component.scss'],
})
export class UploadComponent {
    constructor(private uploadService: UploadService) {}

    uploadImage(): void {
        this.uploadService.uploadCanvas();
    }
}
