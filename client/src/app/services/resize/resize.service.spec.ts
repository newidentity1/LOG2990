import { TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { CANVAS_MARGIN_LEFT, CANVAS_MARGIN_TOP, CANVAS_MIN_HEIGHT, CANVAS_MIN_WIDTH } from '@app/constants/constants';
import { ControlPoint } from '@app/enums/control-point.enum';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ResizeService } from '@app/services/resize/resize.service';

// tslint:disable:no-string-literal / reason : access private members
describe('ResizeService', () => {
    let service: ResizeService;
    let drawingServiceStub: DrawingService;

    beforeEach(() => {
        drawingServiceStub = new DrawingService();
        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawingServiceStub }],
        });
        service = TestBed.inject(ResizeService);
        drawingServiceStub.canvas = canvasTestHelper.canvas;
        drawingServiceStub.previewCtx = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        drawingServiceStub.baseCtx = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('resizeFromImage should resize from image size', () => {
        const executeSpy = spyOn(service, 'execute');
        const drawImageSpy = spyOn(service, 'drawImage');
        const emitSpy = spyOn(service.executedCommand, 'emit');

        const value = 10;
        const image = new Image(value, value);
        service.resizeFromImage(image);

        expect(executeSpy).toHaveBeenCalled();
        expect(drawImageSpy).toHaveBeenCalled();
        expect(emitSpy).toHaveBeenCalled();
        expect(service['newWidth']).toEqual(value);
        expect(service['newHeight']).toEqual(value);
    });

    it('resize should should resize to the correct values', (done) => {
        const executeSpy = spyOn(service, 'execute');
        const drawImageSpy = spyOn(service, 'drawImage');
        const emitSpy = spyOn(service.executedCommand, 'emit');
        const value = 10;
        service.resize(value, value);

        setTimeout(() => {
            expect(executeSpy).toHaveBeenCalled();
            expect(drawImageSpy).toHaveBeenCalled();
            expect(emitSpy).toHaveBeenCalled();
            expect(service['newWidth']).toEqual(value);
            expect(service['newHeight']).toEqual(value);

            done();
            // tslint:disable-next-line: no-magic-numbers / reason: waiting for image to load
        }, 200);
    });

    it('copyShape should copy all attributes needed to draw shapes', () => {
        service['img'].src = '';
        const resizeCopy = service.clone();
        expect(resizeCopy['newWidth']).toEqual(service['newWidth']);
        expect(resizeCopy['newHeight']).toEqual(service['newHeight']);
        expect(resizeCopy['canvasSize']).toEqual(service['canvasSize']);
        expect(resizeCopy['img'].src).toEqual(service['img'].src);
        expect(resizeCopy['img'].crossOrigin).toEqual(service['img'].crossOrigin);
    });

    it('onResizeStart should set the controlPoint and set isResizing to true', () => {
        service.isResizing = false;
        const controlPoint = ControlPoint.BottomCenter;
        service.onResizeStart(controlPoint);
        expect(service.isResizing).toBeTrue();
        expect(service.controlPoint).toEqual(controlPoint);
    });

    it('resetResize should set the controlPoint to null and set isResizing to false', () => {
        service.isResizing = true;
        service.resetResize();
        expect(service.isResizing).toBeFalse();
        expect(service.controlPoint).toEqual(null);
    });

    it('onResizeWidth should do nothing if control point is height only', () => {
        service.controlPoint = ControlPoint.BottomCenter;
        service.isResizing = true;
        drawingServiceStub.previewCtx.canvas.width = 0;
        const limitX = drawingServiceStub.previewCtx.canvas.getBoundingClientRect().x;
        const event = jasmine.createSpyObj('MouseEvent', ['preventDefault']);
        event.clientX = CANVAS_MIN_WIDTH + limitX - 1; // width = CANVAS_MIN_WIDTH -1
        const drawingContainerWidth = 0;
        const expectResult = 0;
        service.onResizeWidth(event, drawingContainerWidth);
        expect(drawingServiceStub.previewCtx.canvas.width).toEqual(expectResult);
    });

    it('onResizeWidth should do nothing if isResizing is false', () => {
        service.controlPoint = ControlPoint.BottomLeft;
        service.isResizing = false;
        drawingServiceStub.previewCtx.canvas.width = 0;
        const limitX = drawingServiceStub.previewCtx.canvas.getBoundingClientRect().x;
        const event = jasmine.createSpyObj('MouseEvent', ['preventDefault']);
        event.clientX = CANVAS_MIN_WIDTH + limitX - 1; // width = CANVAS_MIN_WIDTH -1
        const drawingContainerWidth = 0;
        const expectResult = 0;
        service.onResizeWidth(event, drawingContainerWidth);
        expect(drawingServiceStub.previewCtx.canvas.width).toEqual(expectResult);
    });

    it('onResizeWidth should set the width of preview canvas to width if its between limits', () => {
        service.controlPoint = ControlPoint.CenterRight;
        service.isResizing = true;
        drawingServiceStub.previewCtx.canvas.width = 0;
        const limitX = drawingServiceStub.previewCtx.canvas.getBoundingClientRect().x;
        const event = jasmine.createSpyObj('MouseEvent', ['preventDefault']);
        event.clientX = CANVAS_MIN_WIDTH + limitX + 1; // width = CANVAS_MIN_WIDTH +1
        const drawingContainerWidth = 2 * CANVAS_MIN_WIDTH;
        const expectResult = CANVAS_MIN_WIDTH + 1;
        service.onResizeWidth(event, drawingContainerWidth);
        expect(drawingServiceStub.previewCtx.canvas.width).toEqual(expectResult);
    });

    it('onResizeWidth should set the width of preview canvas to CANVAS_MIN_WIDTH if its below CANVAS_MIN_WIDTH', () => {
        service.controlPoint = ControlPoint.CenterRight;
        service.isResizing = true;
        drawingServiceStub.previewCtx.canvas.width = 0;
        const limitX = drawingServiceStub.previewCtx.canvas.getBoundingClientRect().x;
        const event = jasmine.createSpyObj('MouseEvent', ['preventDefault']);
        event.clientX = CANVAS_MIN_WIDTH + limitX - 1; // width = CANVAS_MIN_WIDTH -1
        const drawingContainerWidth = 0;
        const expectResult = CANVAS_MIN_WIDTH;
        service.onResizeWidth(event, drawingContainerWidth);
        expect(drawingServiceStub.previewCtx.canvas.width).toEqual(expectResult);
    });

    it('onResizeWidth should set the width of preview canvas to widthLimit if its above widthLimit', () => {
        service.controlPoint = ControlPoint.CenterRight;
        service.isResizing = true;
        drawingServiceStub.previewCtx.canvas.width = 0;
        const limitX = drawingServiceStub.previewCtx.canvas.getBoundingClientRect().x;
        const event = jasmine.createSpyObj('MouseEvent', ['preventDefault']);
        event.clientX = CANVAS_MIN_WIDTH + limitX + 2; // width = CANVAS_MIN_WIDTH +2
        const drawingContainerWidth = CANVAS_MIN_WIDTH + CANVAS_MARGIN_LEFT;
        const expectResult = drawingContainerWidth - CANVAS_MARGIN_LEFT;
        service.onResizeWidth(event, drawingContainerWidth);
        expect(drawingServiceStub.previewCtx.canvas.width).toEqual(expectResult);
    });

    it('onResizeHeight should not do anything if its a width only control point', () => {
        service.controlPoint = ControlPoint.CenterRight;
        service.isResizing = true;
        drawingServiceStub.previewCtx.canvas.height = 0;
        const limitY = drawingServiceStub.previewCtx.canvas.getBoundingClientRect().y;
        const event = jasmine.createSpyObj('MouseEvent', ['preventDefault']);
        event.clientY = CANVAS_MIN_HEIGHT + limitY - 1; // height = CANVAS_MIN_HEIGHT -1
        const drawingContainerHeight = 0;
        const expectResult = 0;
        service.onResizeHeight(event, drawingContainerHeight);
        expect(drawingServiceStub.previewCtx.canvas.height).toEqual(expectResult);
    });

    it('onResizeHeight should not do anything if isResizing is false', () => {
        service.controlPoint = ControlPoint.TopCenter;
        service.isResizing = false;
        drawingServiceStub.previewCtx.canvas.height = 0;
        const limitY = drawingServiceStub.previewCtx.canvas.getBoundingClientRect().y;
        const event = jasmine.createSpyObj('MouseEvent', ['preventDefault']);
        event.clientY = CANVAS_MIN_HEIGHT + limitY + 2; // height = CANVAS_MIN_HEIGHT + 2
        const drawingContainerHeight = CANVAS_MIN_HEIGHT + CANVAS_MARGIN_TOP + 1; // height limit = CANVAS_MIN_HEIGHT + 1
        const expectResult = 0;
        service.onResizeHeight(event, drawingContainerHeight);
        expect(drawingServiceStub.previewCtx.canvas.height).toEqual(expectResult);
    });

    it('onResizeHeight should set the height of preview canvas to height if its between limits', () => {
        service.controlPoint = ControlPoint.TopCenter;
        service.isResizing = true;
        drawingServiceStub.previewCtx.canvas.height = 0;
        const limitY = drawingServiceStub.previewCtx.canvas.getBoundingClientRect().y;
        const event = jasmine.createSpyObj('MouseEvent', ['preventDefault']);
        event.clientY = CANVAS_MIN_HEIGHT + limitY + 1; // height = CANVAS_MIN_HEIGHT +1
        const drawingContainerHeight = 2 * CANVAS_MIN_HEIGHT;
        const expectResult = CANVAS_MIN_HEIGHT + 1;
        service.onResizeHeight(event, drawingContainerHeight);
        expect(drawingServiceStub.previewCtx.canvas.height).toEqual(expectResult);
    });

    it('onResizeHeight should set the height of preview canvas to CANVAS_MIN_HEIGHT  if its below CANVAS_MIN_HEIGHT', () => {
        service.controlPoint = ControlPoint.TopCenter;
        service.isResizing = true;
        drawingServiceStub.previewCtx.canvas.height = 0;
        const limitY = drawingServiceStub.previewCtx.canvas.getBoundingClientRect().y;
        const event = jasmine.createSpyObj('MouseEvent', ['preventDefault']);
        event.clientY = CANVAS_MIN_HEIGHT + limitY - 1; // height = CANVAS_MIN_HEIGHT -1
        const drawingContainerHeight = 0;
        const expectResult = CANVAS_MIN_HEIGHT;
        service.onResizeHeight(event, drawingContainerHeight);
        expect(drawingServiceStub.previewCtx.canvas.height).toEqual(expectResult);
    });

    it('onResizeHeight should set the height of preview canvas to heightLimit  if its above heightLimit', () => {
        service.controlPoint = ControlPoint.TopCenter;
        service.isResizing = true;
        drawingServiceStub.previewCtx.canvas.height = 0;
        const limitY = drawingServiceStub.previewCtx.canvas.getBoundingClientRect().y;
        const event = jasmine.createSpyObj('MouseEvent', ['preventDefault']);
        event.clientY = CANVAS_MIN_HEIGHT + limitY + 2; // height = CANVAS_MIN_HEIGHT + 2
        const drawingContainerHeight = CANVAS_MIN_HEIGHT + CANVAS_MARGIN_TOP + 1; // height limit = CANVAS_MIN_HEIGHT + 1
        const expectResult = drawingContainerHeight - CANVAS_MARGIN_TOP;
        service.onResizeHeight(event, drawingContainerHeight);
        expect(drawingServiceStub.previewCtx.canvas.height).toEqual(expectResult);
    });

    it('execute should change the width and height of canvas, previewCtx and baseCtx', () => {
        const newWidth = 10;
        const newHeight = 15;
        service['newWidth'] = newWidth;
        service['newHeight'] = newHeight;
        service.execute();
        expect(drawingServiceStub.canvas.width).toEqual(newWidth);
        expect(drawingServiceStub.previewCtx.canvas.width).toEqual(newWidth);
        expect(drawingServiceStub.baseCtx.canvas.width).toEqual(newWidth);
        expect(drawingServiceStub.canvas.height).toEqual(newHeight);
        expect(drawingServiceStub.previewCtx.canvas.height).toEqual(newHeight);
        expect(drawingServiceStub.baseCtx.canvas.height).toEqual(newHeight);
    });

    it('copy should copy service', () => {
        const newWidth = 10;
        const newHeight = 15;
        service['newWidth'] = newWidth;
        service['newHeight'] = newHeight;
        const clone = new ResizeService(drawingServiceStub);
        service.copy(clone);
        expect(service['newHeight']).toEqual(clone['newHeight']);
        expect(service['newWidth']).toEqual(clone['newWidth']);
        expect(service['canvasSize']).toEqual(clone['canvasSize']);
    });

    it('clone should clone service', () => {
        spyOn(service, 'copy').and.callThrough();
        const clone = service.clone();
        expect(service['newHeight']).toEqual(clone['newHeight']);
        expect(service['newWidth']).toEqual(clone['newWidth']);
        expect(service['canvasSize']).toEqual(clone['canvasSize']);
        expect(service.copy).toHaveBeenCalled();
    });

    it('drawImage should draw image on base canvas', () => {
        spyOn(service.imageDrawn, 'emit').and.callFake(() => {
            return;
        });
        spyOn(drawingServiceStub.baseCtx, 'drawImage').and.callFake(() => {
            return;
        });
        const delay = 1000;
        jasmine.clock().install();
        service.drawImage();
        jasmine.clock().tick(delay);
        expect(service.imageDrawn.emit).toHaveBeenCalled();
        expect(drawingServiceStub.baseCtx.drawImage).toHaveBeenCalled();
        jasmine.clock().uninstall();
    });
});
