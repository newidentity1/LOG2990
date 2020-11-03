import { TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { Color } from '@app/classes/color/color';
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
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas', 'setColor', 'setThickness']);

        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawServiceSpy }],
        });
        service = TestBed.inject(BucketService);
        // Configuration du spy du service
        // tslint:disable:no-string-literal
        const drawingCanvas = document.createElement('canvas');
        drawingCanvas.width = canvasTestHelper.canvas.width;
        drawingCanvas.height = canvasTestHelper.canvas.height;
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        service['drawingService'].baseCtx = baseCtxStub; // Jasmine doesnt copy properties with underlying data
        service['drawingService'].previewCtx = previewCtxStub;
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
        service['width'] = CONSTANTS.TEST_IMAGE_SIZE;
        service['height'] = CONSTANTS.TEST_IMAGE_SIZE;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should be created', () => {
        const couleur: Color = new Color('RED');
        service.setColors(couleur, couleur);
        expect(drawServiceSpy.setColor).toHaveBeenCalled();
    });

    it('onMouseUp should set mouse Down to false)', () => {
        service.onMouseUp(mouseEventclickLeft);
        expect(service.mouseDown).toBeFalse();
    });

    it('onMouseUp should set mouse Down to false)', () => {
        service.mouseDown = true;
        service.onMouseUp(mouseEventclickLeft);
        expect(service.mouseDown).toBeFalse();
    });

    it('checkColor should return false if pixel is out ', () => {
        service.onMouseDown(mouseEventclickLeft);
        service['startPixelColor'] = service['drawingService'].baseCtx.getImageData(2, 2, 1, 1).data;
        service['generateMatrice']();
        const p1: Pixel = { x: -1, y: -1, status: 0 };
        expect(service['checkColor'](p1)).toEqual(false);
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

    it('onMouseDown with a right click should call floodFillRight algorithme', () => {
        service['startPixelColor'] = service['drawingService'].baseCtx.getImageData(2, 2, 1, 1).data;
        service['generateMatrice']();
        const floodFillRightSpy = spyOn<any>(service, 'floodFillRight').and.callThrough();
        service.onMouseDown(mouseEventclickRight);
        expect(floodFillRightSpy).toHaveBeenCalled();
    });

    it('onMouseDown with a right click should call floodFillRight algorithme', () => {
        const floodFillRightSpy = spyOn<any>(service, 'floodFillRight').and.callThrough();
        service.onMouseDown(mouseEventclickRight);
        service['image'].data[0] = 1;
        service['image'].data[1] = 1;
        service['image'].data[2] = 1;
        // tslint:disable-next-line:no-magic-numbers
        service['image'].data[3] = 1;
        service['drawingService'].baseCtx.putImageData(service['image'], 0, 0);
        service.onMouseDown(mouseEventclickRight);
        expect(floodFillRightSpy).toHaveBeenCalled();
    });

    it('setTolerance should change toleranceValue', () => {
        service.setTolerance(CONSTANTS.TEST_TOLERENCE);
        expect(service['tolerance']).toEqual(CONSTANTS.MAX_COLOR_VALUE * (CONSTANTS.TEST_TOLERENCE / CONSTANTS.POURCENTAGE));
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

    it('AddNeighboors should add the 2 neighboors pixels if the pixel is on left top corner', () => {
        const checkPixelSpy = spyOn<any>(service, 'checkPixel').and.callThrough();
        service.onMouseDown(mouseEventclickRight);
        service['startPixelColor'] = service['drawingService'].baseCtx.getImageData(2, 2, 1, 1).data;
        service['generateMatrice']();
        const p1: Pixel = { x: 0, y: 0, status: 0 };
        service['openList'].push(p1);
        service['addNeighbours'](service['openList']);
        expect(checkPixelSpy).toHaveBeenCalled();
    });

    it('AddNeighboors should add the 4 neighboors pixels if status = 0', () => {
        const checkPixelSpy = spyOn<any>(service, 'checkPixel').and.callThrough();
        service.onMouseDown(mouseEventclickRight);
        service['startPixelColor'] = service['drawingService'].baseCtx.getImageData(
            CONSTANTS.MAX_RECENT_COLORS_SIZE,
            CONSTANTS.MAX_RECENT_COLORS_SIZE,
            1,
            1,
        ).data;
        service['generateMatrice']();
        const p1: Pixel = { x: 10, y: 10, status: 0 };
        service['openList'].push(p1);
        service['addNeighbours'](service['openList']);
        expect(checkPixelSpy).toHaveBeenCalled();
    });

    it('AddNeighboors should add the 0 neighboors pixels if status = 1 ', () => {
        const checkPixelSpy = spyOn<any>(service, 'checkPixel').and.callThrough();
        service.onMouseDown(mouseEventclickRight);
        service['startPixelColor'] = service['drawingService'].baseCtx.getImageData(2, 2, 1, 1).data;
        service['generateMatrice']();
        const p1: Pixel = { x: 2, y: 2, status: 1 };
        service['matrice'][2][2].status = 1;
        service['matrice'][1][2].status = 1;
        service['matrice'][CONSTANTS.IMAGE_DATA_OPACITY_INDEX][2].status = 1;
        service['matrice'][2][1].status = 1;
        service['matrice'][2][CONSTANTS.IMAGE_DATA_OPACITY_INDEX].status = 1;
        service['openList'].push(p1);
        service['addNeighbours'](service['openList']);
        expect(checkPixelSpy).toHaveBeenCalled();
    });

    it('AddNeighboors should add 1 neighboors pixels if status = 1 ', () => {
        service.onMouseDown(mouseEventclickRight);
        service['startPixelColor'] = service['drawingService'].baseCtx.getImageData(2, 2, 1, 1).data;
        service['generateMatrice']();
        const checkPixelSpy = spyOn<any>(service, 'checkPixel').and.callThrough();
        const p1: Pixel = { x: 2, y: 2, status: 0 };
        service['matrice'][2][2].status = 0;
        service['matrice'][1][2].status = 0;
        service['matrice'][CONSTANTS.IMAGE_DATA_OPACITY_INDEX][2].status = 1;
        service['matrice'][2][1].status = 1;
        service['matrice'][2][CONSTANTS.IMAGE_DATA_OPACITY_INDEX].status = 1;
        service['openList'].push(p1);
        service['addNeighbours'](service['openList']);
        expect(checkPixelSpy).toHaveBeenCalled();
    });

    it('checkPosition should return true if the pixel is in the canvas', () => {
        const p1: Pixel = { x: 0, y: 0, status: 1 };
        expect(service['checkPosition'](p1)).toEqual(true);
    });

    it('checkPosition should return false if the pixel is out of the canvas', () => {
        const p1: Pixel = { x: -1, y: -1, status: 1 };
        expect(service['checkPosition'](p1)).toEqual(false);
    });

    it('checkPixel should do nothing if there is no pixel', () => {
        service.onMouseDown(mouseEventclickRight);
        const colorPixelSpy = spyOn<any>(service, 'colorPixel').and.callThrough();
        service['checkPixel'](null);
        expect(colorPixelSpy).not.toHaveBeenCalled();
    });

    it('checkPixel should not call colorPixel if the pixel status = 1', () => {
        service.onMouseDown(mouseEventclickRight);
        const colorPixelSpy = spyOn<any>(service, 'colorPixel').and.callThrough();
        service['startPixelColor'] = service['drawingService'].baseCtx.getImageData(2, 2, 1, 1).data;
        service['generateMatrice']();
        const p1: Pixel = { x: 2, y: 2, status: 0 };
        service['checkPixel'](p1);
        expect(colorPixelSpy).toHaveBeenCalled();
    });

    it('checkPixel should call colorPixel if the pixel status = 0', () => {
        const colorPixelSpy = spyOn<any>(service, 'colorPixel').and.callThrough();
        service.onMouseDown(mouseEventclickRight);
        const p1: Pixel = { x: 2, y: 2, status: 0 };
        service['checkPixel'](p1);
        expect(colorPixelSpy).toHaveBeenCalled();
    });

    it('checkPixel should call colorPixel if the pixel status = 0', () => {
        service.onMouseDown(mouseEventclickRight);
        service['image'] = service['drawingService'].baseCtx.getImageData(0, 0, service['width'], service['height']);
        const colorPixelSpy = spyOn<any>(service, 'colorPixel').and.callThrough();
        service['startPixelColor'] = service['drawingService'].baseCtx.getImageData(2, 2, 1, 1).data;
        service['generateMatrice']();
        const p1: Pixel = { x: 2, y: 2, status: 1 };
        service['checkPixel'](p1);
        expect(colorPixelSpy).not.toHaveBeenCalled();
    });

    it('checkColor should verify if the color have to change', () => {
        service.onMouseDown(mouseEventclickRight);
        service['startPixelColor'] = service['drawingService'].baseCtx.getImageData(2, 2, 1, 1).data;
        service['generateMatrice']();
        const p1: Pixel = { x: 2, y: 2, status: 1 };
        expect(service['checkColor'](p1)).toBeTrue();
    });
});
