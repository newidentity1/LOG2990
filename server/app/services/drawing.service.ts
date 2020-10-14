import { DATABASE_COLLECTION, DATABASE_NAME, DATABASE_URL } from '@app/constants';
import { Drawing } from '@common/communication/drawing.ts';
import { injectable } from 'inversify';
import { Collection, MongoClient, MongoClientOptions } from 'mongodb';
import 'reflect-metadata';

@injectable()
export class DrawingService {
    collection: Collection<Drawing>;

    private options: MongoClientOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    };

    constructor() {
        MongoClient.connect(DATABASE_URL, this.options)
            .then((client: MongoClient) => {
                this.collection = client.db(DATABASE_NAME).collection(DATABASE_COLLECTION);
            })
            .catch(() => {
                console.error('Erreur de connection avec la base de donnee!');
                process.exit(1);
            });
    }

    async getDrawing(id: string): Promise<Drawing> {
        return this.collection
            .findOne({ _id: id })
            .then((drawing: Drawing) => {
                if (drawing === null) {
                    Promise.reject('Dessin non trouve!');
                }
                return drawing;
            })
            .catch(() => {
                throw new Error("Le dessin n'a pas pu être récupéré!");
            });
    }

    async getDrawings(): Promise<Drawing[]> {
        return this.collection
            .find({})
            .toArray()
            .then((drawings: Drawing[]) => {
                return drawings;
            })
            .catch(() => {
                throw new Error("Les dessins n'ont pas pu être récupérés!");
            });
    }

    async addDrawing(drawing: Drawing): Promise<void> {
        // TODO ajouter de la validation
        this.collection.insertOne(drawing).catch(() => {
            throw new Error("Le dessin n'a pas pu être ajouté!");
        });
    }

    async removeDrawing(id: string): Promise<void> {
        this.collection.findOneAndDelete({ _id: id }).catch(() => {
            throw new Error("Le dessin n'a pas pu être supprimé!");
        });
    }
}
