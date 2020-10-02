import { DrawingService } from '@app/services/drawing.service';
import { Drawing } from '@common/communication/drawing';
import { HTTP_STATUS_BAD_REQUEST, HTTP_STATUS_CREATED, HTTP_STATUS_NOT_FOUND } from 'app/contants';
import { NextFunction, Request, Response, Router } from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';

@injectable()
export class DrawingController {
    router: Router;

    constructor(@inject(TYPES.DrawingService) private drawingService: DrawingService) {
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();

        this.router.get('/:drawingId', async (req: Request, res: Response, next: NextFunction) => {
            this.drawingService
                .getDrawing(req.params.drawingId)
                .then((drawing: Drawing) => {
                    res.json(drawing);
                })
                .catch((error: Error) => {
                    res.status(HTTP_STATUS_NOT_FOUND).send(error.message);
                });
        });

        this.router.get('/', async (req: Request, res: Response, next: NextFunction) => {
            this.drawingService
                .getDrawings()
                .then((drawing: Drawing[]) => {
                    res.json(drawing);
                })
                .catch((error: Error) => {
                    res.status(HTTP_STATUS_NOT_FOUND).send(error.message);
                });
        });

        this.router.post('/', async (req: Request, res: Response, next: NextFunction) => {
            this.drawingService
                .addDrawing(req.body)
                .then(() => {
                    res.sendStatus(HTTP_STATUS_CREATED).send();
                })
                .catch((error) => {
                    res.sendStatus(HTTP_STATUS_BAD_REQUEST).send(error.message);
                });
        });

        this.router.delete('/:drawingId', async (req: Request, res: Response, next: NextFunction) => {
            this.drawingService
                .removeDrawing(req.params.drawingId)
                .then(() => {
                    res.sendStatus(HTTP_STATUS_NOT_FOUND).send();
                })
                .catch((error) => {
                    res.status(HTTP_STATUS_NOT_FOUND).send(error.message);
                });
        });
    }
}
