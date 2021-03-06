import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import * as express from 'express';
import { inject, injectable } from 'inversify';
import * as logger from 'morgan';
import * as multer from 'multer';
import { DateController } from './controllers/date.controller';
import { DrawingController } from './controllers/drawing.controller';
import { EmailController } from './controllers/email.controller';
import { IndexController } from './controllers/index.controller';
import { TYPES } from './types';

@injectable()
export class Application {
    private readonly internalError: number = 500;
    app: express.Application;
    upload: multer.Multer;

    constructor(
        @inject(TYPES.IndexController) private indexController: IndexController,
        @inject(TYPES.DateController) private dateController: DateController,
        @inject(TYPES.DrawingController) private drawingController: DrawingController,
        @inject(TYPES.EmailController) private emailController: EmailController,
    ) {
        this.app = express();

        const storage = multer.diskStorage({
            filename: (req, file, cb) => {
                cb(null, file.originalname);
            },
        });

        this.upload = multer({ storage });

        this.config();

        this.bindRoutes();
    }

    private config(): void {
        // Middlewares configuration
        this.app.use(logger('dev'));
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(cookieParser());
        this.app.use(cors());
        this.app.use(this.upload.any());
    }

    bindRoutes(): void {
        // Notre application utilise le routeur de notre API `Index`
        this.app.use('/api/index', this.indexController.router);
        this.app.use('/api/date', this.dateController.router);
        this.app.use('/api/drawings', this.drawingController.router);
        this.app.use('/api/email', this.emailController.router);
        this.errorHandling();
    }

    private errorHandling(): void {
        // When previous handlers have not served a request: path wasn't found
        this.app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
            const err: Error = new Error('Not Found');
            next(err);
        });

        // development error handler
        // will print stacktrace
        if (this.app.get('env') === 'development') {
            // tslint:disable-next-line:no-any
            this.app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
                res.status(err.status || this.internalError);
                res.send({
                    message: err.message,
                    error: err,
                });
            });
        }

        // production error handler
        // no stacktraces leaked to user (in production env only)
        // tslint:disable-next-line:no-any
        this.app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
            res.status(err.status || this.internalError);
            res.send({
                message: err.message,
                error: {},
            });
        });
    }
}
