// import { HTTP_STATUS_BAD_REQUEST, HTTP_STATUS_CREATED, HTTP_STATUS_NOT_FOUND, HTTP_STATUS_NO_CONTENT } from '@app/constants';
import { EmailService } from '@app/services/email.service';
import { NextFunction, Request, Response, Router } from 'express';
import * as fs from 'fs';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';

@injectable()
export class EmailController {
    router: Router;

    constructor(@inject(TYPES.EmailService) private emailService: EmailService) {
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();

        this.router.post('/', async (req: Request, res: Response, next: NextFunction) => {
            // Request to API
            // console.log(req.body, req.files[0].path);
            this.emailService.sendEmail(req.body.to, fs.createReadStream(req.files[0].path));

            // // Response
            // this.emailService
            //     .sendEmail()
            //     .then((res) => {
            //         res.sendStatus(HTTP_STATUS_CREATED);
            //     })
            //     .catch((error) => {
            //         res.status(HTTP_STATUS_BAD_REQUEST).send(error.message);
            //     });
        });
    }
}
