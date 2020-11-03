import { expect } from 'chai';
import { describe } from 'mocha';
import { Db, MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Drawing } from '../../../common/communication/drawing';
import { testingContainer } from '../../test/test-utils';
import { TYPES } from '../types';
import { DrawingService } from './drawing.service';

describe('Drawing service', () => {
    let drawingService: DrawingService;
    let drawing: Drawing;
    let client: MongoClient;
    let db: Db;
    let mongoServer: MongoMemoryServer;

    beforeEach(async () => {
        drawing = { _id: '123456789123', name: 'test', tags: ['test', 'first'], url: '/' };

        mongoServer = new MongoMemoryServer({ binary: { version: '4.4.1' } });
        await mongoServer.start();
        const mongoUri = await mongoServer.getUri();
        client = await MongoClient.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        db = client.db(await mongoServer.getDbName());
        await db.createCollection('test');
        await db.collection('test').insertOne(drawing, (error, drawingInserted) => {});
        const [container] = await testingContainer();
        drawingService = container.get<DrawingService>(TYPES.DrawingService);

        drawingService.collection = db.collection('test');
    });

    after(async () => {
        await mongoServer.stop();
        await client.logout();
    });

    it('should return a drawing when sending a valid id', (done: Mocha.Done) => {
        const expectedResult = drawing;
        drawingService.getDrawing(drawing._id).then((result) => {
            expect(result).to.deep.equal(expectedResult);
            done();
        });
    });

    it('should throw an error when sending an invalid id', async () => {
        try {
            await drawingService.getDrawing('');
        } catch (error) {
            expect(error.message).to.equal('Dessin non trouve!');
        }
    });

    it('should throw an error when a error is thrown during getDrawing', async () => {
        await client.close();
        drawingService.getDrawing('123').catch((result) => {
            expect(result.message).to.equal("Le dessin n'a pas pu être récupéré!");
        });
    });

    it('should return all drawings', (done: Mocha.Done) => {
        const expectedResult = [drawing];
        drawingService.getDrawings().then((result) => {
            expect(result).to.deep.equal(expectedResult);
            done();
        });
    });

    it('should throw an error when a error is thrown during getDrawings', async () => {
        await client.close();
        drawingService.getDrawings().catch((result) => {
            expect(result.message).to.equal("Les dessins n'ont pas pu être récupérés");
        });
    });

    it('should add a drawing if its valid', (done: Mocha.Done) => {
        const newDrawing = {} as Drawing;
        newDrawing._id = '123456789124';
        newDrawing.name = 'valid title';
        newDrawing.tags = ['validTag'];
        let isSucess = true;
        drawingService.addDrawing(newDrawing).catch(() => {
            isSucess = false;
        });
        expect(isSucess).to.equal(true);
        done();
    });

    it('should throw an error when a error is thrown during addDrawing', async () => {
        const newDrawing = drawing;
        await client.close();
        drawingService.addDrawing(newDrawing).catch((result) => {
            expect(result.message).to.equal("Le dessin n'a pas pu être ajouté!");
        });
    });

    it('should throw an error when drawing isnt valid', async () => {
        const newDrawing = {} as Drawing;
        newDrawing._id = '123456789123';
        newDrawing.name = '1invalid title';
        newDrawing.tags = ['invalid!Tag'];
        await client.close();
        drawingService.addDrawing(newDrawing).catch((result) => {
            expect(result.message).to.equal('Le dessin est invalide!');
        });
    });

    it('should delete a drawing', (done: Mocha.Done) => {
        let isSucess = true;
        drawingService.removeDrawing(drawing._id).catch(() => {
            isSucess = false;
        });
        expect(isSucess).to.equal(true);
        done();
    });

    it('should throw an error when a error is thrown during deleteDrawing', async () => {
        await client.close();
        drawingService.removeDrawing(drawing._id).catch((result) => {
            expect(result.message).to.equal("Le dessin n'a pas pu être supprimé!");
        });
    });

    it('validateDrawingTitle should return true when name is valid', () => {
        const name = 'valid title';
        // tslint:disable-next-line: no-string-literal / reason: private method
        expect(drawingService['validateDrawingTitle'](name)).to.equal(true);
    });

    it('validateDrawingTitle should return false when name is not valid', () => {
        const name = '1 invalid title';
        // tslint:disable-next-line: no-string-literal / reason: private method
        expect(drawingService['validateDrawingTitle'](name)).to.equal(false);
    });

    it('validateDrawingTitle should return false when name is not valid', () => {
        const emptyName = '';
        // tslint:disable-next-line: no-string-literal / reason: private method
        expect(drawingService['validateDrawingTitle'](emptyName)).to.equal(false);
    });

    it('validateDrawingTitle should return false when name is not valid', () => {
        const longName = '012345678901234567891';
        // tslint:disable-next-line: no-string-literal / reason: private method
        expect(drawingService['validateDrawingTitle'](longName)).to.equal(false);
    });

    it('validateDrawingTags should return true when tag is valid', () => {
        const tags = ['validTag'];
        // tslint:disable-next-line: no-string-literal / reason: private method
        expect(drawingService['validateDrawingTags'](tags)).to.equal(true);
    });

    it('validateDrawingTags should return false when tag isnt valid', () => {
        const tags = ['invalid Tag'];
        // tslint:disable-next-line: no-string-literal / reason: private method
        expect(drawingService['validateDrawingTags'](tags)).to.equal(false);
    });

    it('validateDrawingTags should return false when tag isnt valid', () => {
        const tags = ['invalidTag!'];
        // tslint:disable-next-line: no-string-literal / reason: private method
        expect(drawingService['validateDrawingTags'](tags)).to.equal(false);
    });

    it('validateDrawingTags should return false when tag isnt valid', () => {
        const tags = ['0123456789012345'];
        // tslint:disable-next-line: no-string-literal / reason: private method
        expect(drawingService['validateDrawingTags'](tags)).to.equal(false);
    });

    it('validateDrawing should return true when drawing is valid', () => {
        const validDrawing: Drawing = { name: 'test1', tags: ['tagValid'] } as Drawing;
        // tslint:disable-next-line: no-string-literal / reason: private method
        expect(drawingService['validateDrawing'](validDrawing)).to.equal(true);
    });

    it('validateDrawing should return false when name isnt valid', () => {
        const validDrawing: Drawing = { name: '1test', tags: ['tagValid'] } as Drawing;
        // tslint:disable-next-line: no-string-literal / reason: private method
        expect(drawingService['validateDrawing'](validDrawing)).to.equal(false);
    });

    it('validateDrawing should return false when tags isnt valid', () => {
        const validDrawing: Drawing = { name: 'test1', tags: ['tagValid', '!invalidTag'] } as Drawing;
        // tslint:disable-next-line: no-string-literal / reason: private method
        expect(drawingService['validateDrawing'](validDrawing)).to.equal(false);
    });
});
