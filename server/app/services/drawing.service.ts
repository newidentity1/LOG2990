import * as CONSTANTS from 'app/contants';
import { injectable } from 'inversify';
import { MongoClient } from 'mongodb';
import 'reflect-metadata';

@injectable()
export class DrawingService {
    constructor() {
        console.log(CONSTANTS.DATABASE_URL);
        MongoClient.connect(CONSTANTS.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
            .then((client: MongoClient) => {
                // TODO
            })
            .catch((error) => {
                console.log(error);
                console.error('Erreur de connection avec la base de donnee!');
                process.exit(1);
            });
    }

    test(): string {
        return 'hello';
    }
}
