import { TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { Tool } from '@app/classes/tool/tool';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { SprayService } from './spray.service';

describe('SprayService', () => {
    let service: SprayService;
    let drawingServiceSpy: jasmine.SpyObj<DrawingService>;

    beforeEach(() => {
        drawingServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas', 'setColor', 'setThickness']);
        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawingServiceSpy }],
        });
        const canvas = canvasTestHelper.canvas;
        drawingServiceSpy.canvas = canvas;
        drawingServiceSpy.previewCtx = canvas.getContext('2d') as CanvasRenderingContext2D;
        drawingServiceSpy.baseCtx = canvas.getContext('2d') as CanvasRenderingContext2D;
        service = TestBed.inject(SprayService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('onMouseDown should clear path and spray, set currentMouseCoord, mouseDownCoord and sprayIntervalRef if mouse left', () => {
        const mouseEvent: MouseEvent = {
            clientX: 25,
            clientY: 25,
            button: 0,
        } as MouseEvent;
        spyOn(service, 'clearPath').and.callThrough();
        spyOn(service, 'clearSpray').and.callThrough();

        service.onMouseDown(mouseEvent);
        expect(service.clearPath).toHaveBeenCalled();
        expect(service.clearSpray).toHaveBeenCalled();
        expect(service.currentMouseCoord).toEqual({ x: 25, y: 25 } as Vec2);
        expect(service.mouseDownCoord).toEqual({ x: 25, y: 25 } as Vec2);
        expect(service.sprayIntervalRef).toBeDefined();
    });

    it('onMouseDown should not clear path and spray, not set currentMouseCoord, mouseDownCoord and sprayIntervalRef if mouse right', () => {
        const mouseEvent: MouseEvent = {
            clientX: 25,
            clientY: 25,
            button: 1,
        } as MouseEvent;
        spyOn(service, 'clearPath').and.callThrough();
        spyOn(service, 'clearSpray').and.callThrough();

        service.onMouseDown(mouseEvent);
        expect(service.clearPath).not.toHaveBeenCalled();
        expect(service.clearSpray).not.toHaveBeenCalled();
        expect(service.currentMouseCoord).not.toEqual({ x: 25, y: 25 } as Vec2);
        expect(service.mouseDownCoord).not.toEqual({ x: 25, y: 25 } as Vec2);
        expect(service.sprayIntervalRef).not.toBeDefined();
    });

    it('onMouseUp should drawImage in base canvas, emit executedCommand, clear Canvas if mouse is down and set mousedown to false and clear', () => {
        const mouseEvent: MouseEvent = {
            clientX: 25,
            clientY: 25,
            button: 0,
        } as MouseEvent;
        spyOn(service, 'clearPath').and.callThrough();
        spyOn(service, 'clearSpray').and.callThrough();
        spyOn(drawingServiceSpy.baseCtx, 'drawImage').and.callThrough();
        spyOn(service.executedCommand, 'emit').and.callFake(() => {
            return;
        });
        service.mouseDown = true;
        service.onMouseUp(mouseEvent);
        expect(drawingServiceSpy.baseCtx.drawImage).toHaveBeenCalled();
        expect(service.executedCommand.emit).toHaveBeenCalled();
        expect(drawingServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(service.clearPath).toHaveBeenCalled();
        expect(service.clearSpray).toHaveBeenCalled();
        expect(service.mouseDown).toBeFalse();
    });

    it('onMouseUp should set mousedown to false and clear if mouse isnt down', () => {
        const mouseEvent: MouseEvent = {
            clientX: 25,
            clientY: 25,
            button: 0,
        } as MouseEvent;
        spyOn(service, 'clearPath').and.callThrough();
        spyOn(service, 'clearSpray').and.callThrough();
        spyOn(drawingServiceSpy.baseCtx, 'drawImage').and.callThrough();
        spyOn(service.executedCommand, 'emit').and.callFake(() => {
            return;
        });
        service.mouseDown = false;
        service.onMouseUp(mouseEvent);
        expect(drawingServiceSpy.baseCtx.drawImage).not.toHaveBeenCalled();
        expect(service.executedCommand.emit).not.toHaveBeenCalled();
        expect(drawingServiceSpy.clearCanvas).not.toHaveBeenCalled();
        expect(service.clearPath).toHaveBeenCalled();
        expect(service.clearSpray).toHaveBeenCalled();
        expect(service.mouseDown).toBeFalse();
    });

    it('onMouseMove should set currentMouseCoord to mouse position if mouseDown', () => {
        const mouseEvent: MouseEvent = {
            clientX: 25,
            clientY: 25,
            button: 0,
        } as MouseEvent;

        service.mouseDown = true;
        service.currentMouseCoord = { x: 0, y: 0 } as Vec2;
        service.onMouseMove(mouseEvent);
        expect(service.currentMouseCoord).toEqual({ x: 25, y: 25 } as Vec2);
    });

    it('onMouseMove not should set currentMouseCoord to mouse position if mouseDown', () => {
        const mouseEvent: MouseEvent = {
            clientX: 25,
            clientY: 25,
            button: 0,
        } as MouseEvent;

        service.mouseDown = false;
        service.currentMouseCoord = { x: 0, y: 0 } as Vec2;
        service.onMouseMove(mouseEvent);
        expect(service.currentMouseCoord).toEqual({ x: 0, y: 0 } as Vec2);
    });

    it('draw should clear canvas, draw previous points and draw new points', () => {
        service.currentMouseCoord = { x: 0, y: 0 } as Vec2;
        service.sprayCoords.push({ x: 0, y: 0 } as Vec2);
        service.draw(drawingServiceSpy.previewCtx);
        expect(drawingServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(service.sprayCoords.length).toBeGreaterThan(0);
    });

    it('clearSpray should clearInterval if its defined', () => {
        service.sprayIntervalRef = 1;
        spyOn(window, 'clearInterval').and.callFake(() => {
            return;
        });
        service.clearSpray();
        expect(window.clearInterval).toHaveBeenCalled();
    });

    it('clearSpray should not clearInterval if its not defined', () => {
        spyOn(window, 'clearInterval').and.callFake(() => {
            return;
        });
        service.clearSpray();
        expect(window.clearInterval).not.toHaveBeenCalled();
    });

    it('clearPath should clear sprayCoords array', () => {
        service.sprayCoords = [{} as Vec2, {} as Vec2];
        service.clearPath();
        expect(service.sprayCoords).toEqual([]);
    });

    it('resetContext call resetContext of tool and clears', () => {
        spyOn(service, 'clearPath').and.callThrough();
        spyOn(service, 'clearSpray').and.callThrough();
        spyOn(Tool.prototype, 'resetContext').and.callThrough();
        service.resetContext();
        expect(Tool.prototype.resetContext).toHaveBeenCalled();
        expect(service.clearPath).toHaveBeenCalled();
        expect(service.clearSpray).toHaveBeenCalled();
    });

    it('getPositionFromMouse should return a calculated Vec2', () => {
        const mouseEvent: MouseEvent = {
            clientX: 25,
            clientY: 25,
            button: 0,
        } as MouseEvent;
        expect(service.getPositionFromMouse(mouseEvent)).toEqual({ x: 25, y: 25 } as Vec2);
    });

    it('clone should return a deep copy of the service', () => {
        spyOn(Tool.prototype, 'copyTool').and.callThrough();
        const clone = service.clone();
        expect(Tool.prototype.copyTool).toHaveBeenCalled();
        expect(service).toEqual(clone);
    });
});
