import { TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { Pixel } from '@app/classes/pixel';
import * as CONSTANTS from '@app/constants/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { BucketService } from './bucket.service';
// tslint:disable:no-any : reason spying on functions
describe('BucketService', () => {
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let service: BucketService;
    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let mouseEventclickLeft: MouseEvent;
    let mouseEventclickRight: MouseEvent;

    beforeEach(() => {
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas', 'setColor', 'setThickness']);

        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawServiceSpy }],
        });
        service = TestBed.inject(BucketService);
        // Configuration du spy du service
        // tslint:disable:no-string-literal
        service['drawingService'].baseCtx = baseCtxStub; // Jasmine doesnt copy properties with underlying data
        service['drawingService'].previewCtx = previewCtxStub;
        const drawingCanvas = document.createElement('canvas');
        drawingCanvas.width = canvasTestHelper.canvas.width;
        drawingCanvas.height = canvasTestHelper.canvas.height;
        service['drawingService'].canvas = drawingCanvas;

        mouseEventclickLeft = {
            offsetX: 25,
            offsetY: 25,
            button: 0,
        } as MouseEvent;

        mouseEventclickRight = {
            offsetX: 25,
            offsetY: 25,
            button: 2,
        } as MouseEvent;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('GenerateMatrice should generate a matrice of Pixel with a status of 0', () => {
        service['generateMatrice']();
        const expectedResult: Pixel = { x: 0, y: 0, status: 0 };
        expect(service['matrice'][0][0].status).toEqual(expectedResult.status);
        expect(service['matrice'][0][0].y).toEqual(expectedResult.y);
        expect(service['matrice'][0][0].x).toEqual(expectedResult.x);
    });

    it('onMouseDown with a left click should call floodFillLeft algorithme', () => {
        const floodFillLeftSpy = spyOn<any>(service, 'floodFillLeft').and.callThrough();
        service.onMouseDown(mouseEventclickLeft);
        expect(floodFillLeftSpy).toHaveBeenCalled();
    });

    it('onMouseDown with a right click should call floodFillLeft algorithme', () => {
        const floodFillRightSpy = spyOn<any>(service, 'floodFillRight').and.callThrough();
        service.onMouseDown(mouseEventclickRight);
        expect(floodFillRightSpy).toHaveBeenCalled();
    });

    it('onMouseDown with a right click should call floodFillLeft algorithme', () => {
        service['startPixelColor'] = service['drawingService'].baseCtx.getImageData(2, 2, 1, 1).data;
        service['generateMatrice']();
        const p1: Pixel = { x: 0, y: 0, status: 0 };
        service['colorPixel'](p1);
        const floodFillRightSpy = spyOn<any>(service, 'floodFillRight').and.callThrough();
        service.onMouseDown(mouseEventclickRight);
        expect(floodFillRightSpy).toHaveBeenCalled();
    });

    it('setTolerance should change toleranceValue', () => {
        // tslint:disable-next-line:no-magic-numbers
        service.setTolerance(20);
        // tslint:disable-next-line:no-magic-numbers
        expect(service['tolerance']).toEqual(CONSTANTS.MAX_COLOR_VALUE * (20 / CONSTANTS.POURCENTAGE));
    });

    it('setTolerance should change toleranceValue', () => {
        service.setTolerance(null);
        expect(service['tolerance']).toEqual(CONSTANTS.MAX_COLOR_VALUE * (1 / CONSTANTS.POURCENTAGE));
    });

    it('resetContext should reset all the current changes that the tool made', () => {
        service.resetContext();
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
    });

    it('clearList should clearCurentList', () => {
        const p1: Pixel = { x: 0, y: 0, status: 0 };
        const p2: Pixel = { x: 1, y: 1, status: 0 };
        const list: Pixel[] = [];
        list.push(p1);
        list.push(p2);
        service['clearList'](list);
        expect(list.length).toEqual(0);
    });

    it('ResetMatrice should reset all pixel Status to 0', () => {
        service.onMouseDown(mouseEventclickLeft);
        service['resetMatrice']();
        expect(service['matrice'][0][0].status).toEqual(0);
    });

    it('copyList should copy a list', () => {
        const p1: Pixel = { x: 0, y: 0, status: 0 };
        const p2: Pixel = { x: 1, y: 1, status: 0 };
        const list: Pixel[] = [];
        list.push(p1);
        list.push(p2);
        const newList: Pixel[] = service['copyList'](list);
        expect(newList.length).toEqual(2);
    });

    it('AddNeighboors should add the 4 neighboors pixels if status = 0', () => {
        service['startPixelColor'] = service['drawingService'].baseCtx.getImageData(2, 2, 1, 1).data;
        service['generateMatrice']();
        const checkPixelSpy = spyOn<any>(service, 'checkPixel').and.callThrough();
        const p1: Pixel = { x: 2, y: 2, status: 0 };
        service['openList'].push(p1);
        service['addNeighbours'](service['openList']);
        expect(checkPixelSpy).toHaveBeenCalled();
        // tslint:disable-next-line:no-magic-numbers
        expect(service['openList'].length).toEqual(4);
    });

    it('AddNeighboors should add the 0 neighboors pixels if status = 1 ', () => {
        service['startPixelColor'] = service['drawingService'].baseCtx.getImageData(2, 2, 1, 1).data;
        service['generateMatrice']();
        const checkPixelSpy = spyOn<any>(service, 'checkPixel').and.callThrough();
        const p1: Pixel = { x: 2, y: 2, status: 1 };
        service['matrice'][2][2].status = 1;
        service['matrice'][0][2].status = 1;
        // tslint:disable-next-line: no-magic-numbers
        service['matrice'][4][2].status = 1;
        service['matrice'][2][0].status = 1;
        // tslint:disable-next-line: no-magic-numbers
        service['matrice'][2][4].status = 1;
        service['openList'].push(p1);
        service['addNeighbours'](service['openList']);
        expect(checkPixelSpy).toHaveBeenCalled();
        expect(service['openList'].length).toEqual(0);
    });

    it('AddNeighboors should add the 0 neighboors pixels if status = 1 ', () => {
        service['startPixelColor'] = service['drawingService'].baseCtx.getImageData(2, 2, 1, 1).data;
        service['generateMatrice']();
        const checkPixelSpy = spyOn<any>(service, 'checkPixel').and.callThrough();
        const p1: Pixel = { x: 2, y: 2, status: 1 };
        service['matrice'][2][2].status = 1;
        service['matrice'][0][2].status = 0;
        // tslint:disable-next-line: no-magic-numbers
        service['matrice'][4][2].status = 1;
        service['matrice'][2][0].status = 1;
        // tslint:disable-next-line: no-magic-numbers
        service['matrice'][2][4].status = 1;
        service['openList'].push(p1);
        service['addNeighbours'](service['openList']);
        expect(checkPixelSpy).toHaveBeenCalled();
        expect(service['openList'].length).toEqual(1);
    });

    it('checkPosition should return true if the pixel is in the canvas', () => {
        const p1: Pixel = { x: 2, y: 2, status: 1 };
        expect(service['checkPosition'](p1)).toEqual(true);
    });

    it('checkPosition should return false if the pixel is out of the canvas', () => {
        const p1: Pixel = { x: -1, y: -1, status: 1 };
        expect(service['checkPosition'](p1)).toEqual(false);
    });

    it('checkPixel should do nothing if there is no pixel', () => {
        const colorPixelSpy = spyOn<any>(service, 'colorPixel').and.callThrough();
        service['checkPixel'](null);
        expect(colorPixelSpy).not.toHaveBeenCalled();
    });

    it('checkPixel should not call colorPixel if the pixel status = 1', () => {
        const colorPixelSpy = spyOn<any>(service, 'colorPixel').and.callThrough();
        service['startPixelColor'] = service['drawingService'].baseCtx.getImageData(2, 2, 1, 1).data;
        service['generateMatrice']();
        const p1: Pixel = { x: 2, y: 2, status: 0 };
        service['checkPixel'](p1);
        expect(colorPixelSpy).toHaveBeenCalled();
    });

    it('checkPixel should call colorPixel if the pixel status = 0', () => {
        const colorPixelSpy = spyOn<any>(service, 'colorPixel').and.callThrough();
        service['startPixelColor'] = service['drawingService'].baseCtx.getImageData(2, 2, 1, 1).data;
        service['generateMatrice']();
        const p1: Pixel = { x: 2, y: 2, status: 1 };
        service['checkPixel'](p1);
        expect(colorPixelSpy).not.toHaveBeenCalled();
    });

    it('checkColor should verify if the color have to change', () => {
        service['startPixelColor'] = service['drawingService'].baseCtx.getImageData(2, 2, 1, 1).data;
        service['generateMatrice']();
        const p1: Pixel = { x: 2, y: 2, status: 1 };
        expect(service['checkColor'](p1)).toBeTrue();
    });
});
