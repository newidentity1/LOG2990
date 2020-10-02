import { DrawingService } from '@app/services/drawing.service';
import { HTTP_STATUS_BAD_REQUEST, HTTP_STATUS_CREATED, HTTP_STATUS_OK } from 'app/contants';
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

        this.router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
            const drawing = await this.drawingService.getDrawing(req.params.id);
            res.json(drawing);
        });

        this.router.get('/', async (req: Request, res: Response, next: NextFunction) => {
            const drawing = await this.drawingService.getDrawings();
            res.json(drawing);
        });

        this.router.post('/', async (req: Request, res: Response, next: NextFunction) => {
            const drawing = await this.drawingService
                .addDrawing(req.body)
                .then(() => {
                    res.sendStatus(HTTP_STATUS_CREATED);
                })
                .catch((error) => {
                    res.sendStatus(HTTP_STATUS_BAD_REQUEST).send(error);
                });

            res.json(drawing);
        });

        this.router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
            console.log(req.params.id);
            const drawing = await this.drawingService
                .removeDrawing(req.params.id)
                .then(() => {
                    res.sendStatus(HTTP_STATUS_OK);
                })
                .catch((error) => {
                    res.send(error);
                });

            res.json(drawing);
        });
    }
}
