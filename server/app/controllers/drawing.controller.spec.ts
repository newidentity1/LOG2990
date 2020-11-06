import { Application } from '@app/app';
import { DrawingService } from '@app/services/drawing.service';
import { TYPES } from '@app/types';
import { HTTP_STATUS_BAD_REQUEST, HTTP_STATUS_CREATED, HTTP_STATUS_NOT_FOUND, HTTP_STATUS_NO_CONTENT, HTTP_STATUS_OK } from 'app/constants';
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
        drawing = { _id: '123', name: 'test', tags: ['test', 'first'], url: '/' };
        const [container, sandbox] = await testingContainer();
        container.rebind(TYPES.DrawingService).toConstantValue({
            start: sandbox.stub().resolves(),
            getDrawing: sandbox.stub().resolves(drawing),
            getDrawings: sandbox.stub().resolves([drawing]),
            addDrawing: sandbox.stub().resolves(),
            removeDrawing: sandbox.stub().resolves(),
        });
        drawingService = container.get(TYPES.DrawingService);
        app = container.get<Application>(TYPES.Application).app;
    });

    it('should return drawing from drawing service on valid get request with id ', async () => {
        return (
            supertest(app)
                .get('/api/drawings/' + drawing._id)
                .expect(HTTP_STATUS_OK)
                // tslint:disable-next-line: no-any // reason:response
                .then((response: any) => {
                    expect(response.body).to.deep.equal(drawing);
                })
        );
    });

    it('should return an error from drawing service on invalid get request with id', async () => {
        drawingService.getDrawing.rejects();
        return (
            supertest(app)
                .get('/api/drawings/1234')
                // tslint:disable-next-line: no-any // reason:response
                .then((response: any) => {
                    expect(response.statusCode).to.equal(HTTP_STATUS_NOT_FOUND);
                })
                // tslint:disable-next-line: no-any // reason:response
                .catch((error: any) => {
                    expect(error);
                })
        );
    });

    it('should return all drawings from drawing service on valid get request to root', async () => {
        return (
            supertest(app)
                .get('/api/drawings')
                // tslint:disable-next-line: no-any // reason:response
                .then((response: any) => {
                    expect(response.statusCode).to.equal(HTTP_STATUS_OK);
                    expect(response.body).to.deep.equal([drawing]);
                })
        );
    });

    it('should return an error from drawing service on invalid get request ', async () => {
        drawingService.getDrawings.rejects();
        return (
            supertest(app)
                .get('/api/drawings/')
                // tslint:disable-next-line: no-any // reason:response
                .then((response: any) => {
                    expect(response.statusCode).to.equal(HTTP_STATUS_NOT_FOUND);
                })
                // tslint:disable-next-line: no-any // reason:response
                .catch((error: any) => {
                    expect(error);
                })
        );
    });

    it('should add a drawing in the database on valid post request to root with a drawing', async () => {
        const newDrawing: Drawing = drawing;
        newDrawing._id = '124';
        return supertest(app).post('/api/drawings/').send(newDrawing).set('Accept', 'application/json').expect(HTTP_STATUS_CREATED);
    });

    it('should return an error on invalid post request to root with a drawing', async () => {
        const newDrawing: Drawing = {} as Drawing;
        drawingService.addDrawing.rejects();
        return (
            supertest(app)
                .post('/api/drawings/')
                .send(newDrawing)
                // tslint:disable-next-line: no-any // reason:response
                .then((response: any) => {
                    expect(response.statusCode).to.equal(HTTP_STATUS_BAD_REQUEST);
                })
                // tslint:disable-next-line: no-any // reason:response
                .catch((error: any) => {
                    expect(error);
                })
        );
    });

    it('should remove a drawing in the database on valid delete request to root with id', async () => {
        return supertest(app)
            .delete('/api/drawings/' + drawing._id)
            .then(() => {
                expect(HTTP_STATUS_NO_CONTENT);
            });
    });

    it('should return an error on invalid post request to root with a drawing', async () => {
        drawingService.removeDrawing.rejects();
        return (
            supertest(app)
                .delete('/api/drawings/124')
                // tslint:disable-next-line: no-any // reason:response
                .then((response: any) => {
                    expect(response.statusCode).to.equal(HTTP_STATUS_BAD_REQUEST);
                })
                // tslint:disable-next-line: no-any // reason:response
                .catch((error: any) => {
                    expect(error);
                })
        );
    });
});
