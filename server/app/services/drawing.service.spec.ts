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

    before(async () => {
        drawing = { _id: '123456789123', name: 'test', tags: ['test', 'first'], url: '/' };

        mongoServer = new MongoMemoryServer();
        await mongoServer.start();
        const mongoUri = await mongoServer.getUri();
        client = await MongoClient.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        db = client.db(await mongoServer.getDbName());
        await db.createCollection('test');
        await db.collection('test').insertOne(drawing, (error, drawingInserted) => {
            if (error) {
                return;
            }
        });
    });

    beforeEach(async () => {
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

    it('should return all drawings', (done: Mocha.Done) => {
        const expectedResult = [drawing];
        drawingService.getDrawings().then((result) => {
            expect(result).to.deep.equal(expectedResult);
            done();
        });
    });

    // it('should return an error when sending an invalid id', (done: Mocha.Done) => {
    //     drawingService.collection.find();
    //     drawingService.getDrawings().catch((err) => {
    //         expect(err);
    //         done();
    //     });
    // });

    it('should add a drawing', (done: Mocha.Done) => {
        const newDrawing = drawing;
        newDrawing._id = '124';
        let isSucess = true;
        drawingService.addDrawing(newDrawing).catch(() => {
            isSucess = false;
        });
        expect(isSucess).to.equal(true);
        done();
    });

    it('should delete a drawing', (done: Mocha.Done) => {
        let isSucess = true;
        drawingService.removeDrawing(drawing._id).catch(() => {
            isSucess = false;
        });
        expect(isSucess).to.equal(true);
        done();
    });
});
