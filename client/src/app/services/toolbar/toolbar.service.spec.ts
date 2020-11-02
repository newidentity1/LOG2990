import { TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { Color } from '@app/classes/color/color';
import { KeyShortcut } from '@app/enums/key-shortcuts.enum';
import { SelectionType } from '@app/enums/selection-type.enum';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ToolbarService } from '@app/services/toolbar/toolbar.service';
import { BrushService } from '@app/services/tools/brush/brush.service';
import { BucketService } from '@app/services/tools/bucket/bucket.service';
import { EllipseService } from '@app/services/tools/ellipse/ellipse.service';
import { EraseService } from '@app/services/tools/erase/erase.service';
import { EyedropperService } from '@app/services/tools/eyedropper/eyedropper.service';
import { LineService } from '@app/services/tools/line/line.service';
import { PencilService } from '@app/services/tools/pencil/pencil-service';
import { PolygonService } from '@app/services/tools/polygon/polygon.service';
import { RectangleService } from '@app/services/tools/rectangle/rectangle.service';
import { SelectionService } from '@app/services/tools/selection/selection.service';

describe('ToolbarService', () => {
    let service: ToolbarService;
    let pencilServiceSpy: jasmine.SpyObj<PencilService>;
    let polygonServiceSpy: jasmine.SpyObj<PolygonService>;
    let brushServiceSpy: jasmine.SpyObj<BrushService>;
    let rectangleServiceSpy: jasmine.SpyObj<RectangleService>;
    let ellipseServiceSpy: jasmine.SpyObj<EllipseService>;
    let lineServiceSpy: jasmine.SpyObj<LineService>;
    let eraseServiceSpy: jasmine.SpyObj<EraseService>;
    let eyedropperServiceSpy: jasmine.SpyObj<EyedropperService>;
    let selectionServiceSpy: jasmine.SpyObj<SelectionService>;
    let bucketServiceSpy: jasmine.SpyObj<BucketService>;
    let drawingServiceSpy: jasmine.SpyObj<DrawingService>;

    beforeEach(() => {
        pencilServiceSpy = jasmine.createSpyObj('PencilService', [
            'onKeyDown',
            'setColors',
            'onKeyPress',
            'onKeyUp',
            'onMouseMove',
            'onMouseDown',
            'onMouseUp',
            'onMouseEnter',
            'onMouseLeave',
            'onDoubleClick',
            'onClick',
            'setColors',
            'resetContext',
        ]);

        brushServiceSpy = jasmine.createSpyObj('BrushService', ['onKeyDown', 'resetContext', 'setColors']);
        rectangleServiceSpy = jasmine.createSpyObj('RectangleService', ['setTypeDrawing']);
        ellipseServiceSpy = jasmine.createSpyObj('EllipseService', ['setTypeDrawing']);
        lineServiceSpy = jasmine.createSpyObj('LineService', ['onKeyDown']);
        eraseServiceSpy = jasmine.createSpyObj('LineService', ['onKeyDown']);
        eyedropperServiceSpy = jasmine.createSpyObj('EyedropperService', ['onKeyDown']);
        selectionServiceSpy = jasmine.createSpyObj('SelectionService', ['selectAll', 'resetSelection', 'setSelectionType']);
        drawingServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas', 'setStrokeColor']);
        bucketServiceSpy = jasmine.createSpyObj('BucketService', ['onMouseDown']);
        drawingServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas', 'setStrokeColor']);

        selectionServiceSpy = jasmine.createSpyObj('SelectionService', ['selectAll', 'resetSelection', 'setSelectionType']);
        drawingServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas', 'setStrokeColor']);
        bucketServiceSpy = jasmine.createSpyObj('BucketService', ['onMouseDown']);
        drawingServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas', 'setStrokeColor']);
        polygonServiceSpy = jasmine.createSpyObj('PolygonService', ['onKeyDown']);

        TestBed.configureTestingModule({
            providers: [
                { provide: PencilService, useValue: pencilServiceSpy },
                { provide: BrushService, useValue: brushServiceSpy },
                { provide: RectangleService, useValue: rectangleServiceSpy },
                { provide: EllipseService, useValue: ellipseServiceSpy },
                { provide: LineService, useValue: lineServiceSpy },
                { provide: EraseService, useValue: eraseServiceSpy },
                { provide: PolygonService, useValue: polygonServiceSpy },
                { provide: EyedropperService, useValue: eyedropperServiceSpy },
                { provide: BucketService, useValue: bucketServiceSpy },
                { provide: DrawingService, useValue: drawingServiceSpy },
            ],
        });
        service = TestBed.inject(ToolbarService);
        pencilServiceSpy = TestBed.inject(PencilService) as jasmine.SpyObj<PencilService>;
        polygonServiceSpy = TestBed.inject(PolygonService) as jasmine.SpyObj<PolygonService>;
        brushServiceSpy = TestBed.inject(BrushService) as jasmine.SpyObj<BrushService>;
        rectangleServiceSpy = TestBed.inject(RectangleService) as jasmine.SpyObj<RectangleService>;
        ellipseServiceSpy = TestBed.inject(EllipseService) as jasmine.SpyObj<EllipseService>;
        lineServiceSpy = TestBed.inject(LineService) as jasmine.SpyObj<LineService>;
        eraseServiceSpy = TestBed.inject(EraseService) as jasmine.SpyObj<EraseService>;
        eyedropperServiceSpy = TestBed.inject(EyedropperService) as jasmine.SpyObj<EyedropperService>;
        selectionServiceSpy = TestBed.inject(SelectionService) as jasmine.SpyObj<SelectionService>;
        drawingServiceSpy = TestBed.inject(DrawingService) as jasmine.SpyObj<DrawingService>;
        bucketServiceSpy = TestBed.inject(BucketService) as jasmine.SpyObj<BucketService>;
        drawingServiceSpy.canvas = canvasTestHelper.canvas;
        drawingServiceSpy.baseCtx = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        drawingServiceSpy.previewCtx = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('initializeColors should set primary and secondary colors ', () => {
        // tslint:disable-next-line:no-any / reason: spying on function
        const setColorsSpy = spyOn<any>(service, 'setColors').and.callThrough();
        service.initializeColors();
        expect(setColorsSpy).toHaveBeenCalled();
        expect(service.primaryColor).toBeTruthy();
        expect(service.secondaryColor).toBeTruthy();
    });

    it('getTools should return an array of tool services ', () => {
        const tools = service.getTools();
        expect(tools).toEqual([
            pencilServiceSpy,
            brushServiceSpy,
            eraseServiceSpy,
            polygonServiceSpy,
            rectangleServiceSpy,
            ellipseServiceSpy,
            lineServiceSpy,
            selectionServiceSpy,
            eyedropperServiceSpy,
            bucketServiceSpy,
        ]);
    });

    it('initializeColors should set primary and secondary colors ', () => {
        // tslint:disable-next-line:no-any / reason: spying on function
        const setColorsSpy = spyOn<any>(service, 'setColors').and.callThrough();
        service.initializeColors();
        expect(setColorsSpy).toHaveBeenCalled();
        expect(service.primaryColor).toBeTruthy();
        expect(service.secondaryColor).toBeTruthy();
    });

    it('setColors should set the colors and call applyCurrentToolColor', () => {
        // tslint:disable-next-line: no-any / reason: spying on function
        const applyColorSpy = spyOn<any>(service, 'applyCurrentToolColor').and.callFake(() => {
            return;
        });

        const color = new Color();
        // tslint:disable-next-line: no-any / reason: spying on function

        service.setColors(color, color);
        expect(service.primaryColor).toEqual(color);
        expect(service.secondaryColor).toEqual(color);
        expect(applyColorSpy).toHaveBeenCalled();
    });

    it('applyCurrentTool should call applyCurrentToolColor and call resetContext on currentTool', () => {
        // tslint:disable-next-line: no-any / reason: spying on function
        const applyColorSpy = spyOn<any>(service, 'applyCurrentToolColor').and.callFake(() => {
            return;
        });

        service.applyCurrentTool();
        expect(applyColorSpy).toHaveBeenCalled();
    });

    it('changeTool should change currentTool if tool is different and call applyCurrentTool', () => {
        // tslint:disable-next-line: no-any / reason: spying on function
        const applyColorSpy = spyOn<any>(service, 'applyCurrentToolColor').and.callFake(() => {
            return;
        });

        service.currentTool = pencilServiceSpy;
        service.changeTool(brushServiceSpy);
        expect(service.currentTool).toEqual(brushServiceSpy);
        expect(applyColorSpy).toHaveBeenCalled();
    });

    it('changeTool should should not call applyCurrentTool if tool is the same ', () => {
        // tslint:disable-next-line: no-any / reason: spying on function
        const applyColorSpy = spyOn<any>(service, 'applyCurrentToolColor').and.callFake(() => {
            return;
        });

        service.currentTool = pencilServiceSpy;
        service.changeTool(pencilServiceSpy);
        expect(service.currentTool).toEqual(pencilServiceSpy);
        expect(applyColorSpy).not.toHaveBeenCalled();
    });

    it('onKeyDown should call the onKeyDown of the currentTool', () => {
        service.currentTool = pencilServiceSpy;
        const keyboardEvent = { key: '' } as KeyboardEvent;
        service.onKeyDown(keyboardEvent);
        expect(service.currentTool).toEqual(pencilServiceSpy);
        expect(service.currentTool.onKeyDown).toHaveBeenCalledWith(keyboardEvent);
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

    it('onMouseMove should call the onMouseMove of the currentTool', () => {
        service.currentTool = pencilServiceSpy;
        const mouseEvent = {} as MouseEvent;
        service.onMouseMove(mouseEvent);

        expect(service.currentTool.onMouseMove).toHaveBeenCalledWith(mouseEvent);
    });

    it('onMouseDown should call the onMouseDown of the currentTool', () => {
        service.currentTool = pencilServiceSpy;
        const mouseEvent = {} as MouseEvent;
        service.onMouseDown(mouseEvent);

        expect(service.currentTool.onMouseDown).toHaveBeenCalledWith(mouseEvent);
    });

    it('onMouseUp should call the onMouseUp of the currentTool', () => {
        service.currentTool = pencilServiceSpy;
        const mouseEvent = {} as MouseEvent;
        service.onMouseUp(mouseEvent);

        expect(service.currentTool.onMouseUp).toHaveBeenCalledWith(mouseEvent);
    });

    it('onMouseEnter should call the onMouseEnter of the currentTool', () => {
        service.currentTool = pencilServiceSpy;
        const mouseEvent = {} as MouseEvent;
        service.onMouseEnter(mouseEvent);

        expect(service.currentTool.onMouseEnter).toHaveBeenCalledWith(mouseEvent);
    });

    it('onMouseLeave should call the onMouseLeave of the currentTool', () => {
        service.currentTool = pencilServiceSpy;
        const mouseEvent = {} as MouseEvent;
        service.onMouseLeave(mouseEvent);

        expect(service.currentTool.onMouseLeave).toHaveBeenCalledWith(mouseEvent);
    });

    it('onDoubleClick should call the onDoubleClick of the currentTool', () => {
        service.currentTool = pencilServiceSpy;
        const mouseEvent = {} as MouseEvent;
        service.onDoubleClick(mouseEvent);

        expect(service.currentTool.onDoubleClick).toHaveBeenCalledWith(mouseEvent);
    });

    it('onClick should call the onClick of the currentTool', () => {
        service.currentTool = pencilServiceSpy;
        const mouseEvent = {} as MouseEvent;
        service.onClick(mouseEvent);

        expect(service.currentTool.onClick).toHaveBeenCalledWith(mouseEvent);
    });

    // it('triggerSelectAll should change current tool to selection tool', () => {
    //     // tslint:disable-next-line: no-any / reason: spying on function
    //     const applyColorSpy = spyOn<any>(service, 'applyCurrentToolColor').and.callFake(() => {
    //         return;
    //     });

    //     service.currentTool = pencilServiceSpy;
    //     service.triggerSelectAll();

    //     expect(service.currentTool).toEqual(selectionService);
    //     expect(applyColorSpy).toHaveBeenCalled();
    // });

    // it('triggerSelectAll should call selectAll of selectionService', () => {
    //     // tslint:disable-next-line:no-any / reason : spying on function
    //     const selectAllSpy = spyOn<any>(selectionService, 'selectAll').and.callThrough();
    //     service.currentTool = pencilServiceSpy;
    //     service.triggerSelectAll();
    //     expect(selectAllSpy).toHaveBeenCalled();
    // });

    it('isAreaSelected should return true if an area is selected', () => {
        selectionServiceSpy.isAreaSelected = true;
        const result = service.isAreaSelected();
        expect(result).toBeTrue();
    });

    it('isAreaSelected should return false if an area is not selected', () => {
        selectionServiceSpy.isAreaSelected = false;
        const result = service.isAreaSelected();
        expect(result).toBeFalse();
    });

    // it('resetSelection should call resetSelection of selection service if area is selected', () => {
    //     // tslint:disable-next-line:no-any / reason : spying on function
    //     const resetSelectionSpy = spyOn<any>(selectionService, 'resetSelection').and.callThrough();
    //     selectionService.isAreaSelected = true;
    //     service.resetSelection();
    //     expect(resetSelectionSpy).toHaveBeenCalled();
    // });

    // it('resetSelection should not call resetSelection of selection service if area is not selected', () => {
    //     // tslint:disable-next-line:no-any / reason : spying on function
    //     const resetSelectionSpy = spyOn<any>(selectionService, 'resetSelection').and.callThrough();
    //     selectionService.isAreaSelected = false;
    //     service.resetSelection();
    //     expect(resetSelectionSpy).not.toHaveBeenCalled();
    // });

    it('changeSelectionTool should call the onClick of the currentTool', () => {
        // tslint:disable-next-line:no-any / reason : spying on function
        const setSelectionTypeSpy = spyOn<any>(selectionServiceSpy, 'setSelectionType').and.callThrough();
        const expectedType = SelectionType.EllipseSelection;
        service.changeSelectionTool(expectedType);
        expect(setSelectionTypeSpy).toHaveBeenCalledWith(expectedType);
    });

    it('applyCurrentToolColor should call setColors of the currentTool', () => {
        service.currentTool = pencilServiceSpy;
        const color = new Color();
        service.primaryColor = color;
        service.secondaryColor = color;
        // tslint:disable-next-line:no-string-literal / reason : accessing private member
        service['applyCurrentToolColor']();
        expect(service.currentTool.setColors).toHaveBeenCalled();
    });
});
