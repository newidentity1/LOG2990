import { EmailService } from '';
import { expect } from 'chai';
import { ReadStream } from 'fs';
import { describe } from 'mocha';
import { testingContainer } from '../../test/test-utils';
import { TYPES } from '../types';

describe('Email service', () => {
    let emailService: EmailService;

    beforeEach(async () => {
        const [container] = await testingContainer();
        emailService = container.get<EmailService>(TYPES.EmailService);
    });

    after(async () => {});

    it('sendEmail should return an error if email is invalid', async () => {
        const email = 'invalide.email';
        const image = new ReadStream();
        image.path = '../../../client/src/assets/';
        try {
            await emailService.sendEmail(email, image);
        } catch (error) {
            expect(error.message).to.equal("L'adresse courriel entrée est invalide");
        }
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
