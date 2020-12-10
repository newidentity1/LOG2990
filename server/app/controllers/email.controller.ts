import {
    HTTP_STATUS_ACCEPTED,
    HTTP_STATUS_BAD_REQUEST,
    HTTP_STATUS_FORBIDDEN,
    HTTP_STATUS_INTERNAL_SERVER_ERROR,
    HTTP_STATUS_OK,
    HTTP_STATUS_TOO_MANY_REQUESTS,
    HTTP_STATUS_UNPROCESSABLE_ENTITY,
} from '@app/constants';
import { EmailService } from '@app/services/email.service';
import { NextFunction, Request, Response, Router } from 'express';
import * as fs from 'fs';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';

// required for accessing files from req
export interface MulterFile {
    fieldname: string;
    path: string;
    mimetype: string;
    originalname: string;
    size: number;
}

@injectable()
export class EmailController {
    router: Router;

    constructor(@inject(TYPES.EmailService) private emailService: EmailService) {
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();

        this.router.post('/', (req: Request & { files: MulterFile[] }, res: Response, next: NextFunction) => {
            this.emailService
                .sendEmail(req.body.to, fs.createReadStream(req.files[0].path))
                .then((response) => {
                    switch (response) {
                        case HTTP_STATUS_OK:
                            res.status(response).send('Votre courriel a été envoyé');
                            break;
                        case HTTP_STATUS_ACCEPTED:
                            res.status(response).send('Votre demande de courriel passe la validation (quick_return)');
                            break;
                        case HTTP_STATUS_BAD_REQUEST:
                            res.status(response).send("L'adresse courriel n'est pas valide");
                            break;
                        case HTTP_STATUS_FORBIDDEN:
                            res.status(response).send("L'entête de la requête ne contient pas de clé (X-Teamkey)");
                            break;
                        case HTTP_STATUS_UNPROCESSABLE_ENTITY:
                            res.status(response).send('Requête ne passe pas la validation de base');
                            break;
                        case HTTP_STATUS_TOO_MANY_REQUESTS:
                            res.status(response).send('Le nombre maximal de courriel par heure envoyé a été dépassé');
                            break;
                        case HTTP_STATUS_INTERNAL_SERVER_ERROR:
                            res.status(response).send('Le mail API éprouve des difficultés à envoyé votre courriel pour le moment');
                            break;
                    }
                })
                .catch((error) => {
                    res.status(HTTP_STATUS_BAD_REQUEST).send(error.message);
                });
        });
    }
}
