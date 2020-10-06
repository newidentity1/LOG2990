import { Application } from '@app/app';
import { DrawingService } from '@app/services/drawing.service';
import { TYPES } from '@app/types';
import { HTTP_STATUS_BAD_REQUEST, HTTP_STATUS_CREATED, HTTP_STATUS_NOT_FOUND, HTTP_STATUS_NO_CONTENT, HTTP_STATUS_OK } from 'app/contants';
import { expect } from 'chai';
import { describe } from 'mocha';
import * as supertest from 'supertest';
import { Drawing } from '../../../common/communication/drawing';
import { Stubbed, testingContainer } from '../../test/test-utils';

describe('DrawingController', () => {
    let drawingService: Stubbed<DrawingService>;
    let app: Express.Application;
    let drawing: Drawing;
    beforeEach(async () => {
        drawing = { id: '123', name: 'test', tags: ['test', 'first'], url: '/' };
        const [container, sandbox] = await testingContainer();
        container.rebind(TYPES.DrawingService).toConstantValue({
            getDrawing: sandbox.stub().resolves(drawing),
            getDrawings: sandbox.stub().resolves([drawing]),
            addDrawing: sandbox.stub().resolves(),
            removeDrawing: sandbox.stub().resolves(),
        });
        drawingService = container.get(TYPES.DrawingService);
        app = container.get<Application>(TYPES.Application).app;
    });

    it('should return drawing from drawing service on valid get request with id ', async () => {
        return supertest(app)
            .get('/api/drawing/' + drawing.id)
            .expect(HTTP_STATUS_OK)
            .then((response: any) => {
                expect(response.body).to.deep.equal(drawing);
            });
    });

    it('should return an error from drawing service on invalid get request with id', async () => {
        drawingService.getDrawing.rejects();
        return supertest(app)
            .get('/api/drawing/1234')
            .then((response: any) => {
                expect(response.statusCode).to.equal(HTTP_STATUS_NOT_FOUND);
            })
            .catch((error: any) => {
                expect(error);
            });
    });

    it('should return all drawings from drawing service on valid get request to root', async () => {
        return supertest(app)
            .get('/api/drawing')
            .then((response: any) => {
                expect(response.statusCode).to.equal(HTTP_STATUS_OK);
                expect(response.body).to.deep.equal([drawing]);
            });
    });

    it('should return an error from drawing service on invalid get request ', async () => {
        drawingService.getDrawings.rejects();
        return supertest(app)
            .get('/api/drawing/')
            .then((response: any) => {
                expect(response.statusCode).to.equal(HTTP_STATUS_NOT_FOUND);
            })
            .catch((error: any) => {
                expect(error);
            });
    });

    it('should add a drawing in the database on valid post request to root with a drawing', async () => {
        const newDrawing: Drawing = drawing;
        newDrawing.id = '124';
        return supertest(app).post('/api/drawing/').send(newDrawing).set('Accept', 'application/json').expect(HTTP_STATUS_CREATED);
    });

    it('should return an error on invalid post request to root with a drawing', async () => {
        const newDrawing: Drawing = {} as Drawing;
        drawingService.addDrawing.rejects();
        return supertest(app)
            .post('/api/drawing/')
            .send(newDrawing)
            .then((response: any) => {
                expect(response.statusCode).to.equal(HTTP_STATUS_BAD_REQUEST);
            })
            .catch((error: any) => {
                expect(error);
            });
    });

    it('should remove a drawing in the database on valid delete request to root with id', async () => {
        return supertest(app)
            .delete('/api/drawing/' + drawing.id)
            .then(() => {
                expect(HTTP_STATUS_NO_CONTENT);
            });
    });

    it('should return an error on invalid post request to root with a drawing', async () => {
        drawingService.removeDrawing.rejects();
        return supertest(app)
            .delete('/api/drawing/124')
            .then((response: any) => {
                expect(response.statusCode).to.equal(HTTP_STATUS_BAD_REQUEST);
            })
            .catch((error: any) => {
                expect(error);
            });
    });
});
