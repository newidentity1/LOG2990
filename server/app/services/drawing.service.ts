import { DATABASE_COLLECTION, DATABASE_NAME } from '@app/constants';
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

    start(databaseUrl: string): void {
        MongoClient.connect(databaseUrl, this.options)
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
        if (this.validateDrawing(drawing)) {
            this.collection.insertOne(drawing).catch(() => {
                throw new Error("Le dessin n'a pas pu être ajouté!");
            });
        } else {
            throw new Error('Le dessin est invalide!');
        }
    }

    async removeDrawing(id: string): Promise<void> {
        this.collection.findOneAndDelete({ _id: id }).catch(() => {
            throw new Error("Le dessin n'a pas pu être supprimé!");
        });
    }

    private validateDrawingTitle(title: string): boolean {
        const regexTitle = new RegExp('^[a-zA-ZÀ-ÿ](\\d|[a-zA-ZÀ-ÿ ]){0,20}$');
        return regexTitle.test(title);
    }

    private validateDrawingTags(tags: string[]): boolean {
        let isValid = true;
        const regexTag = new RegExp('^(\\d|[a-zA-ZÀ-ÿ]){0,15}$');
        for (const tag of tags) {
            if (!regexTag.test(tag)) {
                isValid = false;
                break;
            }
        }
        return isValid;
    }

    private validateDrawing(drawing: Drawing): boolean {
        return this.validateDrawingTitle(drawing.name) && this.validateDrawingTags(drawing.tags);
    }
}
