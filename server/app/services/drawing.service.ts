import { Drawing } from '@common/communication/drawing.ts';
import * as CONSTANTS from 'app/contants';
import { injectable } from 'inversify';
import { Collection, MongoClient, ObjectId } from 'mongodb';
import 'reflect-metadata';

@injectable()
export class DrawingService {
    collection: Collection<Drawing>;

    constructor() {
        console.log(CONSTANTS.DATABASE_URL);
        MongoClient.connect(CONSTANTS.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
            .then((client: MongoClient) => {
                // TODO
                this.collection = client.db(CONSTANTS.DATABASE_NAME).collection(CONSTANTS.DATABASE_COLLECTION);
            })
            .catch((error) => {
                console.log(error);
                console.error('Erreur de connection avec la base de donnee!');
                process.exit(1);
            });
    }

    async getDrawing(id: string): Promise<Drawing> {
        return this.collection
            .findOne({ _id: new ObjectId(id) })
            .then((drawing: Drawing) => {
                console.log(drawing);
                return drawing;
            })
            .catch((error) => {
                // TODO voir comment gérer les erreurs
                console.log('erreur de getDrawing' + error);
                return error;
            });
    }

    async getDrawings(): Promise<Drawing> {
        return this.collection
            .find({})
            .toArray()
            .then((drawings: Drawing[]) => {
                return drawings;
            })
            .catch((error) => {
                // TODO voir comment gérer les erreurs
                console.log('erreur de getDrawings' + error);
                return error;
            });
    }

    async addDrawing(drawing: Drawing): Promise<void> {
        this.collection.insertOne(drawing).catch((error) => {
            // TODO voir comment gérer les erreurs
            console.log('erreur de addDrawing' + error);
            return error;
        });
    }

    async removeDrawing(id: string): Promise<void> {
        console.log(new ObjectId(id));
        this.collection
            .findOneAndDelete({ _id: new ObjectId(id) })
            .then(() => {
                // do nothing
            })
            .catch((error) => {
                // TODO voir comment gérer les erreurs
                console.log('erreur de removeDrawing' + error);
                return error;
            });
    }
}
