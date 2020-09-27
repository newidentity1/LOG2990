import { TestBed } from '@angular/core/testing';
import { Tool } from '@app/classes/tool';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { BrushService } from '@app/services/tools/brush/brush.service';
import { EllipseService } from '@app/services/tools/ellipse/ellipse.service';
import { LineService } from '@app/services/tools/Line/line.service';
import { PencilService } from '@app/services/tools/pencil/pencil-service';
import { RectangleService } from '@app/services/tools/rectangle/rectangle.service';
import { ToolbarService } from './toolbar.service';

describe('ToolbarService', () => {
    let service: ToolbarService;
    let pencilService: PencilService;
    let brushService: BrushService;
    let rectangleService: RectangleService;
    let ellipseService: EllipseService;
    let lineService: LineService;
    let drawingService: DrawingService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [DrawingService, PencilService, BrushService, RectangleService, EllipseService, LineService],
        });
        service = TestBed.inject(ToolbarService);
        pencilService = TestBed.inject(PencilService);
        brushService = TestBed.inject(BrushService);
        rectangleService = TestBed.inject(RectangleService);
        ellipseService = TestBed.inject(EllipseService);
        lineService = TestBed.inject(LineService);
        drawingService = TestBed.inject(DrawingService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('getTools should return an array of tool services ', () => {
        const tools = service.getTools();
        expect(tools).toEqual([pencilService, brushService, rectangleService, ellipseService, lineService]);
    });

    it('onKeyDown should call onKeyDown of the currentTool and not change the currenTool if key is not a shortcut', () => {
        const keyboardEvent = { key: '' } as KeyboardEvent;
        const spycurrentTool = spyOn(service.currentTool, 'onKeyDown');
        service.onKeyDown(keyboardEvent);
        expect(spycurrentTool).toHaveBeenCalled();
        expect(spycurrentTool).toHaveBeenCalledWith(keyboardEvent);
    });

    it("onKeyDown should call onKeyDown of the currentTool and change the currenTool to pencil if key is 'c'", () => {
        const keyboardEvent = { key: 'c' } as KeyboardEvent;
        // Pencil doesn't override onKeyDown method, so he calls the Tool(parent) one
        const spycurrentTool = spyOn(Tool.prototype, 'onKeyDown');
        const spyDrawingClear = spyOn(drawingService, 'clearCanvas');
        service.currentTool = brushService;
        service.onKeyDown(keyboardEvent);

        expect(spycurrentTool).toHaveBeenCalled();
        expect(spycurrentTool).toHaveBeenCalledWith(keyboardEvent);
        expect(spyDrawingClear).toHaveBeenCalled();
        expect(spyDrawingClear).toHaveBeenCalledWith(drawingService.previewCtx);
        expect(service.currentTool).toEqual(pencilService);
    });

    it("onKeyDown should call onKeyDown of the currentTool and change the currenTool to brush if key is 'w'", () => {
        const keyboardEvent = { key: 'w' } as KeyboardEvent;
        const spycurrentTool = spyOn(service.currentTool, 'onKeyDown');
        const spyDrawingClear = spyOn(drawingService, 'clearCanvas');
        service.onKeyDown(keyboardEvent);

        expect(spycurrentTool).toHaveBeenCalled();
        expect(spycurrentTool).toHaveBeenCalledWith(keyboardEvent);
        expect(spyDrawingClear).toHaveBeenCalled();
        expect(spyDrawingClear).toHaveBeenCalledWith(drawingService.previewCtx);
        expect(service.currentTool).toEqual(brushService);
    });

    it("onKeyDown should call onKeyDown of the currentTool and change the currenTool to rectangle if key is '1'", () => {
        const keyboardEvent = { key: '1' } as KeyboardEvent;
        const spycurrentTool = spyOn(service.currentTool, 'onKeyDown');
        const spyDrawingClear = spyOn(drawingService, 'clearCanvas');
        service.onKeyDown(keyboardEvent);

        expect(spycurrentTool).toHaveBeenCalled();
        expect(spycurrentTool).toHaveBeenCalledWith(keyboardEvent);
        expect(spyDrawingClear).toHaveBeenCalled();
        expect(spyDrawingClear).toHaveBeenCalledWith(drawingService.previewCtx);
        expect(service.currentTool).toEqual(rectangleService);
    });

    it("onKeyDown should call onKeyDown of the currentTool and change the currenTool to ellipse if key is '2'", () => {
        const keyboardEvent = { key: '2' } as KeyboardEvent;
        const spycurrentTool = spyOn(service.currentTool, 'onKeyDown');
        const spyDrawingClear = spyOn(drawingService, 'clearCanvas');
        service.onKeyDown(keyboardEvent);

        expect(spycurrentTool).toHaveBeenCalled();
        expect(spycurrentTool).toHaveBeenCalledWith(keyboardEvent);
        expect(spyDrawingClear).toHaveBeenCalled();
        expect(spyDrawingClear).toHaveBeenCalledWith(drawingService.previewCtx);
        expect(service.currentTool).toEqual(ellipseService);
    });

    it("onKeyDown should call onKeyDown of the currentTool and change the currenTool to line if key is 'l'", () => {
        const keyboardEvent = { key: 'l' } as KeyboardEvent;
        const spycurrentTool = spyOn(service.currentTool, 'onKeyDown');
        const spyDrawingClear = spyOn(drawingService, 'clearCanvas');
        service.onKeyDown(keyboardEvent);

        expect(spycurrentTool).toHaveBeenCalled();
        expect(spycurrentTool).toHaveBeenCalledWith(keyboardEvent);
        expect(spyDrawingClear).toHaveBeenCalled();
        expect(spyDrawingClear).toHaveBeenCalledWith(drawingService.previewCtx);
        expect(service.currentTool).toEqual(lineService);
    });
});
