import axios from 'axios';
import * as FormData from 'form-data';
import { ReadStream } from 'fs';
import { injectable } from 'inversify';
import 'reflect-metadata';

@injectable()
export class EmailService {
    apiKey: string = 'f6cd41ef-636d-45ae-9e07-47dd97cff25e';
    apiUrl: string = 'http://log2990.step.polymtl.ca/email';

    async sendEmail(to: string, payload: ReadStream): Promise<number> {
        // Will be used for Server to API
        // axios.post('http://httpbin.org/post', data);
        const bodyFormData = new FormData();
        bodyFormData.append('to', to);
        bodyFormData.append('payload', payload);

        return await axios({
            method: 'post',
            url: this.apiUrl,
            data: bodyFormData,
            params: { address_validation: false, quick_return: false, dry_run: false },
            headers: { 'Content-Type': 'multipart/form-data', 'X-Team-Key': this.apiKey, ...bodyFormData.getHeaders() },
        })
            .then((response) => {
                // handle success
                // console.log(response.status);
                return response.status;
            })
            .catch((error) => {
                // handle error
                return error.status;
            });
    }
}
