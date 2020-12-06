// import { DATABASE_URL, HTTP_STATUS_BAD_REQUEST, HTTP_STATUS_CREATED, HTTP_STATUS_NOT_FOUND, HTTP_STATUS_NO_CONTENT } from '@app/constants';
import { EmailService } from '@app/services/email.service';
// import { Email } from '@common/communication/email';
import { NextFunction, Request, Response, Router } from 'express';
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
            // prevent error
            this.emailService.sendEmail();

            // check body
            console.log(req.body);
            //     this.emailService
            //         .sendEmail()
            //         .then(() => {
            //             res.sendStatus(HTTP_STATUS_CREATED);
            //         })
            //         .catch((error) => {
            //             res.status(HTTP_STATUS_BAD_REQUEST).send(error.message);
            //         });
        });
    }
}
