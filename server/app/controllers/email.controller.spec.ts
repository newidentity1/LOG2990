// import { Application } from '@app/app';
// import { HTTP_STATUS_OK } from '@app/constants';
// import { TYPES } from '@app/types';
// import { describe } from 'mocha';
// import * as supertest from 'supertest';
// import { Stubbed, testingContainer } from '../../test/test-utils';
// import { EmailService } from '../services/email.service';

// describe('DrawingController', () => {
//     let emailService: Stubbed<EmailService>;
//     let app: Express.Application;
//     const validEmail = {
//         to: 'test@polymtl.ca',
//         payload: 'C:UsersyanisAppDataLocalTempdsds.jpeg',
//     };
//     const invalidEmail = {
//         to: '2112,dsa',
//         payload: 'ssdas',
//     };
//     beforeEach(async () => {
//         const [container, sandbox] = await testingContainer();
//         container.rebind(TYPES.EmailService).toConstantValue({
//             sendEmail: sandbox.stub().resolves(),
//         });
//         emailService = container.get(TYPES.EmailService);
//         app = container.get<Application>(TYPES.Application).app;
//     });

//     it('should send a email to axios', async () => {
//         return supertest(app).post('/api/email/').send(validEmail).set('Accept', 'application/json').expect(HTTP_STATUS_OK);
//     });

//     it('should rejects if email format is invalid', async () => {
//         emailService.sendEmail.rejects();
//         return supertest(app).post('/api/email/').send(invalidEmail).set('Accept', 'application/json').expect(HTTP_STATUS_OK);
//     });
// });
