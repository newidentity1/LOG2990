import { TestBed } from '@angular/core/testing';
import { Color } from '@app/classes/color/color';
import { KeyShortcut } from '@app/enums/key-shortcuts.enum';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { BrushService } from '@app/services/tools/brush/brush.service';
import { BucketService } from '@app/services/tools/bucket/bucket.service';
import { EllipseService } from '@app/services/tools/ellipse/ellipse.service';
import { EraseService } from '@app/services/tools/erase/erase.service';
import { EyedropperService } from '@app/services/tools/eyedropper/eyedropper.service';
import { LineService } from '@app/services/tools/line/line.service';
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
    let eraseServiceSpy: jasmine.SpyObj<EraseService>;
    let eyedropperService: jasmine.SpyObj<EyedropperService>;
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
        rectangleServiceSpy = jasmine.createSpyObj('RectangleService', ['onKeyDown']);
        ellipseServiceSpy = jasmine.createSpyObj('EllipseService', ['onKeyDown']);
        lineServiceSpy = jasmine.createSpyObj('LineService', ['onKeyDown']);
        eraseServiceSpy = jasmine.createSpyObj('LineService', ['onKeyDown']);
        eyedropperService = jasmine.createSpyObj('EyedropperService', ['onKeyDown']);
        bucketServiceSpy = jasmine.createSpyObj('BucketService', ['onMouseDown']);
        drawingServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);

        TestBed.configureTestingModule({
            providers: [
                { provide: PencilService, useValue: pencilServiceSpy },
                { provide: BrushService, useValue: brushServiceSpy },
                { provide: RectangleService, useValue: rectangleServiceSpy },
                { provide: EllipseService, useValue: ellipseServiceSpy },
                { provide: LineService, useValue: lineServiceSpy },
                { provide: EraseService, useValue: eraseServiceSpy },
                { provide: EyedropperService, useValue: eyedropperService },
                { provide: BucketService, useValue: bucketServiceSpy },
                { provide: DrawingService, useValue: drawingServiceSpy },
            ],
        });
        service = TestBed.inject(ToolbarService);
        pencilServiceSpy = TestBed.inject(PencilService) as jasmine.SpyObj<PencilService>;
        brushServiceSpy = TestBed.inject(BrushService) as jasmine.SpyObj<BrushService>;
        rectangleServiceSpy = TestBed.inject(RectangleService) as jasmine.SpyObj<RectangleService>;
        ellipseServiceSpy = TestBed.inject(EllipseService) as jasmine.SpyObj<EllipseService>;
        lineServiceSpy = TestBed.inject(LineService) as jasmine.SpyObj<LineService>;
        eraseServiceSpy = TestBed.inject(EraseService) as jasmine.SpyObj<EraseService>;
        eyedropperService = TestBed.inject(EyedropperService) as jasmine.SpyObj<EyedropperService>;
        drawingServiceSpy = TestBed.inject(DrawingService) as jasmine.SpyObj<DrawingService>;
        bucketServiceSpy = TestBed.inject(BucketService) as jasmine.SpyObj<BucketService>;
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
            rectangleServiceSpy,
            ellipseServiceSpy,
            lineServiceSpy,
            eraseServiceSpy,
            eyedropperService,
            bucketServiceSpy,
        ]);
    });

    it('setColors should set the colors and call applyCurrentToolColor', () => {
        const color = new Color();
        // tslint:disable-next-line: no-any / reason: spying on function
        const applyColorSpy = spyOn<any>(service, 'applyCurrentToolColor').and.callFake(() => {
            return;
        });
        service.setColors(color, color);
        expect(service.primaryColor).toEqual(color);
        expect(service.secondaryColor).toEqual(color);
        expect(applyColorSpy).toHaveBeenCalled();
    });

    it('applCurrentTool should call applyCurrentToolColor and call resetContext on currentTool', () => {
        // tslint:disable-next-line: no-any / reason: spying on function
        const applyColorSpy = spyOn<any>(service, 'applyCurrentToolColor').and.callFake(() => {
            return;
        });
        service.applyCurrentTool();
        expect(applyColorSpy).toHaveBeenCalled();
    });

    it('changeTool should change currentTool if tool is different and call applyCurrentTool', () => {
        // tslint:disable-next-line: no-any / reason: spying on function
        const applyCurrentToolSpy = spyOn<any>(service, 'applyCurrentTool').and.callFake(() => {
            return;
        });
        service.currentTool = pencilServiceSpy;
        service.changeTool(brushServiceSpy);
        expect(service.currentTool).toEqual(brushServiceSpy);
        expect(applyCurrentToolSpy).toHaveBeenCalled();
    });

    it('changeTool should should not call applyCurrentTool if tool is the same ', () => {
        // tslint:disable-next-line: no-any / reason: spying on function
        const applyCurrentToolSpy = spyOn<any>(service, 'applyCurrentTool').and.callFake(() => {
            return;
        });
        service.currentTool = pencilServiceSpy;
        service.changeTool(pencilServiceSpy);
        expect(service.currentTool).toEqual(pencilServiceSpy);
        expect(applyCurrentToolSpy).not.toHaveBeenCalled();
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
