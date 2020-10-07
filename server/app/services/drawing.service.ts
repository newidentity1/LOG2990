import { DATABASE_COLLECTION, DATABASE_NAME, DATABASE_URL } from '@app/contants';
import { Drawing } from '@common/communication/drawing.ts';
import { injectable } from 'inversify';
import { Collection, MongoClient, ObjectId } from 'mongodb';
import 'reflect-metadata';

@injectable()
export class DrawingService {
    collection: Collection<Drawing>;

    constructor() {
        MongoClient.connect(DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
            .then((client: MongoClient) => {
                this.collection = client.db(DATABASE_NAME).collection(DATABASE_COLLECTION);
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
                if (drawing === null) throw new Error('Dessin non trouve!');
                return drawing;
            })
            .catch((error) => {
                throw error;
            });
    }

    async getDrawings(): Promise<Drawing[]> {
        return this.collection
            .find({})
            .toArray()
            .then((drawings: Drawing[]) => {
                return drawings;
            })
            .catch((error) => {
                throw error;
            });
    }

    async addDrawing(drawing: Drawing): Promise<void> {
        // TODO ajouter de la validation
        this.collection.insertOne(drawing).catch((error) => {
            throw error;
        });
    }

    async removeDrawing(id: string): Promise<void> {
        this.collection.findOneAndDelete({ _id: new ObjectId(id) }).catch((error) => {
            throw new Error("Le dessin n'a pas pu être supprime!");
        });
    }
}
