import { TestBed } from '@angular/core/testing';
import { Color } from '@app/classes/color/color';
import { KeyShortcut } from '@app/enums/key-shortcuts.enum';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { BrushService } from '@app/services/tools/brush/brush.service';
import { EllipseService } from '@app/services/tools/ellipse/ellipse.service';
import { LineService } from '@app/services/tools/Line/line.service';
import { PencilService } from '@app/services/tools/pencil/pencil-service';
import { RectangleService } from '@app/services/tools/rectangle/rectangle.service';
import { ToolbarService } from './toolbar.service';

describe('ToolbarService', () => {
    let service: ToolbarService;
    let pencilServiceSpy: jasmine.SpyObj<PencilService>;
    let brushServiceSpy: jasmine.SpyObj<BrushService>;
    let rectangleServiceSpy: jasmine.SpyObj<RectangleService>;
    let ellipseServiceSpy: jasmine.SpyObj<EllipseService>;
    let lineServiceSpy: jasmine.SpyObj<LineService>;
    let drawingServiceSpy: jasmine.SpyObj<DrawingService>;

    beforeEach(() => {
        pencilServiceSpy = jasmine.createSpyObj('PencilService', ['onKeyDown', 'setColors', 'onKeyPress', 'onKeyUp']);
        brushServiceSpy = jasmine.createSpyObj('BrushService', ['onKeyDown']);
        rectangleServiceSpy = jasmine.createSpyObj('RectangleService', ['onKeyDown']);
        ellipseServiceSpy = jasmine.createSpyObj('EllipseService', ['onKeyDown']);
        lineServiceSpy = jasmine.createSpyObj('LineService', ['onKeyDown']);
        drawingServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);

        TestBed.configureTestingModule({
            providers: [
                { provide: PencilService, useValue: pencilServiceSpy },
                { provide: BrushService, useValue: brushServiceSpy },
                { provide: RectangleService, useValue: rectangleServiceSpy },
                { provide: EllipseService, useValue: ellipseServiceSpy },
                { provide: LineService, useValue: lineServiceSpy },
                { provide: DrawingService, useValue: drawingServiceSpy },
            ],
        });
        service = TestBed.inject(ToolbarService);
        pencilServiceSpy = TestBed.inject(PencilService) as jasmine.SpyObj<PencilService>;
        brushServiceSpy = TestBed.inject(BrushService) as jasmine.SpyObj<BrushService>;
        rectangleServiceSpy = TestBed.inject(RectangleService) as jasmine.SpyObj<RectangleService>;
        ellipseServiceSpy = TestBed.inject(EllipseService) as jasmine.SpyObj<EllipseService>;
        lineServiceSpy = TestBed.inject(LineService) as jasmine.SpyObj<LineService>;
        drawingServiceSpy = TestBed.inject(DrawingService) as jasmine.SpyObj<DrawingService>;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('getTools should return an array of tool services ', () => {
        const tools = service.getTools();
        expect(tools).toEqual([pencilServiceSpy, brushServiceSpy, rectangleServiceSpy, ellipseServiceSpy, lineServiceSpy]);
    });

    it('getTool should return a Tool if the key exists ', () => {
        const tool = service.getTool(KeyShortcut.Pencil);
        expect(tool).toEqual(pencilServiceSpy);
    });

    it('getTool should return a undefined if the key dont exist ', () => {
        const tool = service.getTool('Shift');
        expect(tool).toEqual(undefined);
    });

    it('setColors should set the colors and call applyCurrentToolColor', () => {
        const color = new Color();
        const applyColorSpy = spyOn(service, 'applyCurrentToolColor').and.callFake(() => {
            return;
        });
        service.setColors(color, color);
        expect(service.primaryColor).toEqual(color);
        expect(service.secondaryColor).toEqual(color);
        expect(applyColorSpy).toHaveBeenCalled();
    });

    it('applyCurrentToolColor should call setColors of the currentTool', () => {
        service.currentTool = pencilServiceSpy;
        const color = new Color();
        service.primaryColor = color;
        service.secondaryColor = color;
        service.applyCurrentToolColor();
        expect(service.currentTool.setColors).toHaveBeenCalled();
    });

    it('onKeyDown should call the onKeyDown of the currentTool, getTool, not change the currentTool and call clearCanvas when key wrong', () => {
        service.currentTool = pencilServiceSpy;
        const keyboardEvent = { key: '' } as KeyboardEvent;
        const spyGetTool = spyOn(service, 'getTool').and.callThrough();
        service.onKeyDown(keyboardEvent);
        expect(service.currentTool).toEqual(pencilServiceSpy);
        expect(service.currentTool.onKeyDown).toHaveBeenCalledWith(keyboardEvent);
        expect(spyGetTool).toHaveBeenCalledWith(keyboardEvent.key);
        expect(drawingServiceSpy.clearCanvas).toHaveBeenCalledWith(drawingServiceSpy.previewCtx);
    });

    it('onKeyDown should call the onKeyDown of the currentTool, getTool, change the currentTool and call clearCanvas when key exist', () => {
        service.currentTool = brushServiceSpy;
        const keyboardEvent = { key: KeyShortcut.Pencil } as KeyboardEvent;
        const spyGetTool = spyOn(service, 'getTool').and.callThrough();
        service.onKeyDown(keyboardEvent);

        expect(brushServiceSpy.onKeyDown).toHaveBeenCalledWith(keyboardEvent);
        expect(spyGetTool).toHaveBeenCalledWith(keyboardEvent.key);
        expect(service.currentTool).toEqual(pencilServiceSpy);
        expect(drawingServiceSpy.clearCanvas).toHaveBeenCalledWith(drawingServiceSpy.previewCtx);
    });

    it('onKeyPress should call the onKeyPress of the currentTool', () => {
        service.currentTool = pencilServiceSpy;
        const keyboardEvent = { key: KeyShortcut.Pencil } as KeyboardEvent;
        service.onKeyPress(keyboardEvent);

        expect(service.currentTool.onKeyPress).toHaveBeenCalledWith(keyboardEvent);
    });

    it('onKeyUp should call the onKeyPress of the currentTool', () => {
        service.currentTool = pencilServiceSpy;
        const keyboardEvent = { key: KeyShortcut.Pencil } as KeyboardEvent;
        service.onKeyUp(keyboardEvent);

        expect(service.currentTool.onKeyUp).toHaveBeenCalledWith(keyboardEvent);
    });
});
