import { Component } from '@angular/core';
import { FireBaseService } from '@app/services/firebase/fire-base.service';
@Component({
    selector: 'app-upload',
    templateUrl: './upload.component.html',
    styleUrls: ['./upload.component.scss'],
})
export class UploadComponent {
    constructor(private fireBaseService: FireBaseService) {}

    uploadImage(): void {
        this.fireBaseService.uploadCanvas();
    }
}
