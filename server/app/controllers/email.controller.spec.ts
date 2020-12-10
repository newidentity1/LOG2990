import { Application } from '@app/app';
import {
    HTTP_STATUS_ACCEPTED,
    HTTP_STATUS_BAD_REQUEST,
    HTTP_STATUS_FORBIDDEN,
    HTTP_STATUS_INTERNAL_SERVER_ERROR,
    HTTP_STATUS_OK,
    HTTP_STATUS_TOO_MANY_REQUESTS,
    HTTP_STATUS_UNPROCESSABLE_ENTITY,
} from '@app/constants';
import { TYPES } from '@app/types';
import { expect } from 'chai';
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
        payload: '../../test/image-test/menu.png',
    };

    beforeEach(async () => {
        const [container, sandbox] = await testingContainer();
        container.rebind(TYPES.EmailService).toConstantValue({
            sendEmail: sandbox.stub().resolves(),
        });
        emailService = container.get(TYPES.EmailService);
        app = container.get<Application>(TYPES.Application).app;
    });

    it('should send a email to axios with ok response', async () => {
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

    it('should send a email to axios with accepted response', async () => {
        const formData: FormData = new FormData();
        const stream = fs.createReadStream(validEmail.payload);
        formData.append('to', validEmail.to);
        formData.append('payload', stream);
        emailService.sendEmail.resolves(HTTP_STATUS_ACCEPTED);
        return supertest(app)
            .post('/api/email/')
            .field('to', validEmail.to)
            .attach('test', path.resolve(__dirname, validEmail.payload))
            .expect(HTTP_STATUS_ACCEPTED);
    });

    it('should send a email to axios with bad request response', async () => {
        const formData: FormData = new FormData();
        const stream = fs.createReadStream(validEmail.payload);
        formData.append('to', validEmail.to);
        formData.append('payload', stream);
        emailService.sendEmail.resolves(HTTP_STATUS_BAD_REQUEST);
        return supertest(app)
            .post('/api/email/')
            .field('to', validEmail.to)
            .attach('test', path.resolve(__dirname, validEmail.payload))
            .expect(HTTP_STATUS_BAD_REQUEST);
    });

    it('should send a email to axios with status forbidden', async () => {
        const formData: FormData = new FormData();
        const stream = fs.createReadStream(validEmail.payload);
        formData.append('to', validEmail.to);
        formData.append('payload', stream);
        emailService.sendEmail.resolves(HTTP_STATUS_FORBIDDEN);
        return supertest(app)
            .post('/api/email/')
            .field('to', validEmail.to)
            .attach('test', path.resolve(__dirname, validEmail.payload))
            .expect(HTTP_STATUS_FORBIDDEN);
    });

    it('should send a email to axios with unprocessable entity', async () => {
        const formData: FormData = new FormData();
        const stream = fs.createReadStream(validEmail.payload);
        formData.append('to', validEmail.to);
        formData.append('payload', stream);
        emailService.sendEmail.resolves(HTTP_STATUS_UNPROCESSABLE_ENTITY);
        return supertest(app)
            .post('/api/email/')
            .field('to', validEmail.to)
            .attach('test', path.resolve(__dirname, validEmail.payload))
            .expect(HTTP_STATUS_UNPROCESSABLE_ENTITY);
    });

    it('should send a email to axios with too many requests', async () => {
        const formData: FormData = new FormData();
        const stream = fs.createReadStream(validEmail.payload);
        formData.append('to', validEmail.to);
        formData.append('payload', stream);
        emailService.sendEmail.resolves(HTTP_STATUS_TOO_MANY_REQUESTS);
        return supertest(app)
            .post('/api/email/')
            .field('to', validEmail.to)
            .attach('test', path.resolve(__dirname, validEmail.payload))
            .expect(HTTP_STATUS_TOO_MANY_REQUESTS);
    });

    it('should send a email to axios with internal server error', async () => {
        const formData: FormData = new FormData();
        const stream = fs.createReadStream(validEmail.payload);
        formData.append('to', validEmail.to);
        formData.append('payload', stream);
        emailService.sendEmail.resolves(HTTP_STATUS_INTERNAL_SERVER_ERROR);
        return supertest(app)
            .post('/api/email/')
            .field('to', validEmail.to)
            .attach('test', path.resolve(__dirname, validEmail.payload))
            .expect(HTTP_STATUS_INTERNAL_SERVER_ERROR);
    });

    it('should return an error from axios', async () => {
        const formData: FormData = new FormData();
        const stream = fs.createReadStream(validEmail.payload);
        formData.append('to', validEmail.to);
        formData.append('payload', stream);
        emailService.sendEmail.rejects();
        return (
            supertest(app)
                .post('/api/email/')
                .field('to', validEmail.to)
                .attach('test', path.resolve(__dirname, validEmail.payload))
                // tslint:disable-next-line: no-any // reason:response
                .catch((error: any) => {
                    expect(error);
                })
        );
    });
});
