// import { DATABASE_COLLECTION, DATABASE_NAME } from '@app/constants';
// import { Email } from '@common/communication/email.ts';
import { injectable } from 'inversify';
import 'reflect-metadata';

@injectable()
export class EmailService {
    //    apiKey: string = 'f6cd41ef-636d-45ae-9e07-47dd97cff25e';
    // address: string = '';
    sendEmail(): void {
        // Will be used for Server to API
        // axios.post('http://httpbin.org/post', data);
        // const httpHeaders = new HttpHeaders({ 'Content-Type': 'multipart/form-data', 'X-Team-Key': this.apiKey });
        // can be passed this way
        // const options = { headers: httpHeaders };
        // this.http.post(this.emailUrl, formData, { headers: httpHeaders });
    }
}
