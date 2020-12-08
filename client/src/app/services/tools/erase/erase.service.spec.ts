import { TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { IMAGE_DATA_OPACITY_INDEX, MAX_COLOR_VALUE } from '@app/constants/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { EraseService } from './erase.service';
// tslint:disable:no-any / reason: creating a mock dialog ref
describe('EraseService', () => {
    let service: EraseService;
    let mouseEvent: MouseEvent;
    let mouseEventclick: MouseEvent;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;

    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;

    beforeEach(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas', 'setColor', 'setFillColor', 'setStrokeColor']);

        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawServiceSpy }],
        });
        service = TestBed.inject(EraseService);

        // Configuration du spy du service
        // tslint:disable:no-string-literal
        const canvas = document.createElement('canvas');
        service['drawingService'].canvas = canvas;
        canvas.width = canvasTestHelper.canvas.width;
        canvas.height = canvasTestHelper.canvas.height;
        baseCtxStub = canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvas.getContext('2d') as CanvasRenderingContext2D;
        service['drawingService'].baseCtx = baseCtxStub; // Jasmine doesnt copy properties with underlying data
        service['drawingService'].previewCtx = previewCtxStub;

        mouseEvent = {
            clientX: 25,
            clientY: 25,
            button: 0,
        } as MouseEvent;

        mouseEventclick = {
            clientX: 0,
            clientY: 0,
            button: 0,
        } as MouseEvent;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('onMouseMove should draw cursor and connect point if mouse down', () => {
        const drawSpy = spyOn<any>(service, 'draw').and.callThrough();
        const drawCursorSpy = spyOn<any>(service, 'drawCursor').and.callThrough();
        service.onMouseDown(mouseEventclick);
        service.onMouseMove(mouseEvent);
        service.mouseDown = true;
        expect(drawSpy).toHaveBeenCalled();
        expect(drawCursorSpy).toHaveBeenCalled();
    });

    it('onMouseMove should draw cursor and connect point if mouse down', () => {
        const drawSpy = spyOn<any>(service, 'draw').and.callThrough();
        const drawCursorSpy = spyOn<any>(service, 'drawCursor').and.callThrough();
        service.onMouseMove(mouseEvent);
        expect(drawSpy).not.toHaveBeenCalled();
        expect(drawCursorSpy).toHaveBeenCalled();
    });

    it('clone should return a clone of the tool', () => {
        const spyCopyShape = spyOn(EraseService.prototype, 'copyTool');
        const clone = service.clone();
        expect(spyCopyShape).toHaveBeenCalled();
        expect(clone).toEqual(service);
    });

    it('onMouseUp should call draw if pathData lenght is different than 1 and mouse down is true', () => {
        const drawSpy = spyOn<any>(service, 'draw').and.callThrough();
        service.mouseDown = true;
        service.pathData = [
            { x: 0, y: 0 },
            { x: 10, y: 10 },
        ];
        service.onMouseUp(mouseEvent);
        expect(drawSpy).toHaveBeenCalled();
    });

    it('Draw should call clearRect if pathData lenght is 1, mouse was not moved and mouse down is true', () => {
        const clearRectSpy = spyOn<any>(baseCtxStub, 'clearRect');
        service.mouseDown = true;
        service.mouseDownCoord = { x: mouseEvent.clientX, y: mouseEvent.clientY };
        service.pathData = [{ x: mouseEvent.clientX, y: mouseEvent.clientY }];
        service.draw(drawServiceSpy.baseCtx);
        expect(clearRectSpy).toHaveBeenCalled();
    });

    it('onMouseUp should not call emit of executedCommand if mouse was not down', () => {
        const executedCommandEmitSpy = spyOn<any>(service.executedCommand, 'emit');
        service.mouseDown = false;
        service.onMouseUp(mouseEvent);
        expect(executedCommandEmitSpy).not.toHaveBeenCalled();
    });

    it('draw should erase pixels on drawn path', () => {
        service.pathData = [
            { x: 0, y: 0 },
            { x: 10, y: 10 },
        ];
        baseCtxStub.fillStyle = 'black';
        baseCtxStub.fillRect(0, 0, baseCtxStub.canvas.width, baseCtxStub.canvas.height);
        drawServiceSpy.setStrokeColor.and.callFake((color: string) => {
            baseCtxStub.strokeStyle = color;
        });
        service.draw(baseCtxStub);

        // tslint:disable:no-magic-numbers / reason :using random values
        const imageData = baseCtxStub.getImageData(5, 5, 1, 1);
        expect(imageData.data[0]).toEqual(MAX_COLOR_VALUE); // R
        expect(imageData.data[1]).toEqual(MAX_COLOR_VALUE); // G
        expect(imageData.data[2]).toEqual(MAX_COLOR_VALUE); // B
        expect(imageData.data[IMAGE_DATA_OPACITY_INDEX]).toEqual(MAX_COLOR_VALUE); // A
    });

    it('drawCursor should draw a white rectangle with a black border on previewCtx', () => {
        previewCtxStub.fillStyle = 'black';
        previewCtxStub.fillRect(0, 0, previewCtxStub.canvas.width, previewCtxStub.canvas.height);
        drawServiceSpy.setStrokeColor.and.callFake((color: string) => {
            previewCtxStub.strokeStyle = color;
        });
        drawServiceSpy.setFillColor.and.callFake((color: string) => {
            previewCtxStub.fillStyle = color;
        });
        service.toolProperties.thickness = 10;
        service.currentMousePosition = { x: 10, y: 10 };
        service['drawCursor']();

        const imageData = previewCtxStub.getImageData(10, 10, 1, 1);
        expect(imageData.data[0]).toEqual(MAX_COLOR_VALUE); // R
        expect(imageData.data[1]).toEqual(MAX_COLOR_VALUE); // G
        expect(imageData.data[2]).toEqual(MAX_COLOR_VALUE); // B
        expect(imageData.data[IMAGE_DATA_OPACITY_INDEX]).toEqual(MAX_COLOR_VALUE); // A

        const cursorBorderData = previewCtxStub.getImageData(4, 10, 1, 1);
        expect(cursorBorderData.data[0]).toEqual(0); // R
        expect(cursorBorderData.data[1]).toEqual(0); // G
        expect(cursorBorderData.data[2]).toEqual(0); // B
        expect(cursorBorderData.data[IMAGE_DATA_OPACITY_INDEX]).toEqual(MAX_COLOR_VALUE); // A
    });
});
