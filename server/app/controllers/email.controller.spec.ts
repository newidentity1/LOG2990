import { Application } from '@app/app';
import { DrawingService } from '@app/services/drawing.service';
import { TYPES } from '@app/types';
import { HTTP_STATUS_BAD_REQUEST, HTTP_STATUS_CREATED, HTTP_STATUS_NOT_FOUND, HTTP_STATUS_NO_CONTENT, HTTP_STATUS_OK } from 'app/constants';
import { expect } from 'chai';
import { describe } from 'mocha';
import * as supertest from 'supertest';
import { Drawing } from '../../../common/communication/drawing';
import { Stubbed, testingContainer } from '../../test/test-utils';

describe('DrawingController', () => {
    let emailService: Stubbed<EmailService>;
    let app: Express.Application;
    let drawing: Drawing;
    beforeEach(async () => {});
});
