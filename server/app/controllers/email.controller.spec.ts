import { Application } from '@app/app';
import { HTTP_STATUS_OK } from '@app/constants';
import { TYPES } from '@app/types';
import * as FormData from 'form-data';
import * as fs from 'fs';
import { describe } from 'mocha';
import * as path from 'path';
import * as supertest from 'supertest';
import { Stubbed, testingContainer } from '../../test/test-utils';
import { EmailService } from '../services/email.service';

describe('EmailController', () => {
    let emailService: Stubbed<EmailService>;
    let app: Express.Application;
    const validEmail = {
        to: 'test@polymtl.ca',
        payload: '.././test/image-test/menu.png',
    };
    // const invalidEmail = {
    //     to: '2112,dsa',
    //     payload: 'ssdas',
    // };
    beforeEach(async () => {
        const [container, sandbox] = await testingContainer();
        container.rebind(TYPES.EmailService).toConstantValue({
            sendEmail: sandbox.stub().resolves(),
        });
        emailService = container.get(TYPES.EmailService);
        app = container.get<Application>(TYPES.Application).app;
    });

    it('should send a email to axios', async () => {
        const formData: FormData = new FormData();
        const stream = fs.createReadStream(validEmail.payload);
        formData.append('to', validEmail.to);
        formData.append('payload', stream);
        emailService.sendEmail.resolves(HTTP_STATUS_OK);
        return supertest(app)
            .post('/api/email/')
            .field('to', validEmail.to)
            .attach('test', path.resolve(__dirname, validEmail.payload))
            .expect(HTTP_STATUS_OK);
    });

    // it('should rejects if email format is invalid', async () => {
    //     const formData: FormData = new FormData();
    //     formData.append('to', invalidEmail.to);
    //     formData.append('payload', invalidEmail.payload);
    //     emailService.sendEmail.rejects();
    //     return supertest(app).post('/api/email/').send(invalidEmail).set('Accept', 'application/json').expect(HTTP_STATUS_OK);
    // });
});
