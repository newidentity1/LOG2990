import { EMAIL_API_KEY, EMAIL_API_URL } from '@app/constants';
import axios from 'axios';
import * as FormData from 'form-data';
import { ReadStream } from 'fs';
import { injectable } from 'inversify';
import 'reflect-metadata';

@injectable()
export class EmailService {
    async sendEmail(to: string, payload: ReadStream): Promise<number> {
        if (!this.validateRequestEmail(to)) throw new Error("L'adresse courriel entrée est invalide");
        const bodyFormData = new FormData();
        bodyFormData.append('to', to);
        bodyFormData.append('payload', payload);

        return await axios({
            method: 'post',
            url: EMAIL_API_URL,
            data: bodyFormData,
            params: { address_validation: true, quick_return: false, dry_run: false },
            headers: { 'Content-Type': 'multipart/form-data', 'X-Team-Key': EMAIL_API_KEY, ...bodyFormData.getHeaders() },
        })
            .then((response) => {
                return response.status;
            })
            .catch((error) => {
                return error.response.status;
            });
    }

    private validateRequestEmail(title: string): boolean {
        const regexEmail = new RegExp(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i);
        return regexEmail.test(title);
    }
}
