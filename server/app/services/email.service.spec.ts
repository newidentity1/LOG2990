import { HTTP_STATUS_BAD_REQUEST, HTTP_STATUS_OK } from '@app/constants';
import { expect } from 'chai';
import * as fs from 'fs';
import { describe } from 'mocha';
import { testingContainer } from '../../test/test-utils';
import { TYPES } from '../types';
import { EmailService } from './email.service';

describe('Email service', () => {
    let emailService: EmailService;

    beforeEach(async () => {
        const [container] = await testingContainer();
        emailService = container.get<EmailService>(TYPES.EmailService);
    });

    after(async () => {});

    it('sendEmail should return an error if email is invalid', async () => {
        const email = 'invalide.email';
        const path = '././test/image-test/menu.png';
        const image = fs.createReadStream(path);
        try {
            await emailService.sendEmail(email, image);
        } catch (error) {
            expect(error.message).to.equal("L'adresse courriel entrée est invalide");
        }
    });

    it('sendEmail should return ok if email is valid', async () => {
        const email = 'yanis.toubal@polymtl.ca';
        const path = '././test/image-test/menu.png';
        const image = fs.createReadStream(path);
        expect(await emailService.sendEmail(email, image)).to.equal(HTTP_STATUS_OK);
    });

    it('sendEmail should return bad request if email is valid but doesnt exist', async () => {
        const email = 'yanis.toubal123@polymtl.ca';
        const path = '././test/image-test/menu.png';
        const image = fs.createReadStream(path);
        expect(await emailService.sendEmail(email, image)).to.equal(HTTP_STATUS_BAD_REQUEST);
    });

    it('validateEmail should return true when email is valid', () => {
        const email = 'valid@email.com';
        // tslint:disable-next-line: no-string-literal / reason: private method
        expect(emailService['validateRequestEmail'](email)).to.equal(true);
    });

    it('validateEmail should return false when email is invalid', () => {
        const email = 'invalide.email';
        // tslint:disable-next-line: no-string-literal / reason: private method
        expect(emailService['validateRequestEmail'](email)).to.equal(false);
    });
});
