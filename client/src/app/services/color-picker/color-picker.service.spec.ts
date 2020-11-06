import { TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { Color } from '@app/classes/color/color';
import { Vec2 } from '@app/classes/vec2';
import { BLACK, COLOR_PICKER_CURSOR_RADIUS, MAX_COLOR_VALUE, MAX_RECENT_COLORS_SIZE, WHITE } from '@app/constants/constants';
import { MouseButton } from '@app/enums/mouse-button.enum';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ToolbarService } from '@app/services/toolbar/toolbar.service';
import { ColorPickerService } from './color-picker.service';

describe('ColorPickerService', () => {
    let service: ColorPickerService;
    let leftMouseEvent: MouseEvent;
    let rightMouseClick: MouseEvent;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let toolbarServiceSpy: jasmine.SpyObj<ToolbarService>;
    // tslint:disable: no-any / reason : needed for jasmine spy
    let updateSelectedColorSpy: jasmine.Spy<any>;

    beforeEach(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas', 'setColor']);
        toolbarServiceSpy = jasmine.createSpyObj('ToolbarService', ['setColors', 'initializeColors']);

        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawServiceSpy },
                { provide: ToolbarService, useValue: toolbarServiceSpy },
            ],
        });
        service = TestBed.inject(ColorPickerService);

        updateSelectedColorSpy = spyOn<any>(service, 'updateSelectedColor').and.callThrough();

        service.canvas = document.createElement('canvas');
        service.canvas.width = canvasTestHelper.canvas.width;
        service.canvas.height = canvasTestHelper.canvas.height;
        service.colorCanvasCtx = service.canvas.getContext('2d') as CanvasRenderingContext2D;
        service.cursorCanvasCtx = service.canvas.getContext('2d') as CanvasRenderingContext2D;
        leftMouseEvent = {
            offsetX: 25,
            offsetY: 25,
            button: MouseButton.Left,
        } as MouseEvent;
        rightMouseClick = {
            offsetX: 25,
            offsetY: 25,
            button: MouseButton.Right,
        } as MouseEvent;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it(' mouseDown should set mouseDown property to true on left click', () => {
        service.onMouseDown(leftMouseEvent);
        expect(service.mouseDown).toEqual(true);
    });

    it(' mouseDown should set mouseDown property to false on right click', () => {
        service.onMouseDown(rightMouseClick);
        expect(service.mouseDown).toEqual(false);
    });

    it(' mouseDown should call updateSelectedColor on left click', () => {
        service.onMouseDown(leftMouseEvent);
        expect(updateSelectedColorSpy).toHaveBeenCalledWith(leftMouseEvent);
    });

    it(' mouseDown should not call updateSelectedColor on right click', () => {
        service.onMouseDown(rightMouseClick);
        expect(updateSelectedColorSpy).not.toHaveBeenCalled();
    });

    it(' onMouseDown should draw cursor', () => {
        // color of cursor is inverse of selected colo
        service.selectedColor = new Color(WHITE);
        service.onMouseDown(leftMouseEvent);

        const imageData: ImageData = service.cursorCanvasCtx.getImageData(
            leftMouseEvent.offsetX,
            leftMouseEvent.offsetY + COLOR_PICKER_CURSOR_RADIUS,
            1,
            1,
        );
        expect(imageData.data[0]).toEqual(0); // R
        expect(imageData.data[1]).toEqual(0); // G
        expect(imageData.data[2]).toEqual(0); // B
        // tslint:disable-next-line:no-magic-numbers
        expect(imageData.data[3]).not.toEqual(0); // A
    });

    it(' mouseMove should call updateSelectedColor if mouse was already down', () => {
        service.mouseDown = true;
        service.onMouseMove(leftMouseEvent);
        expect(updateSelectedColorSpy).toHaveBeenCalledWith(leftMouseEvent);
    });

    it(' mouseMove should not call updateSelectedColor if mouse was already down', () => {
        service.mouseDown = false;
        service.onMouseMove(leftMouseEvent);
        expect(updateSelectedColorSpy).not.toHaveBeenCalledWith();
    });

    it(' mouseUp should set mouseDown property to false', () => {
        service.mouseDown = true;
        service.onMouseUp(leftMouseEvent);
        expect(service.mouseDown).toEqual(false);
    });

    it(' mouseUp should set mouseDown property to false', () => {
        service.mouseDown = true;
        service.onMouseUp(leftMouseEvent);
        expect(service.mouseDown).toEqual(false);
    });

    it(' setRedHex should change selectedColor', () => {
        service.selectedColor = new Color(BLACK);
        service.setRedHex('ff');
        expect(service.selectedColor.hex).toEqual('FF0000');
        // tslint:disable:no-string-literal
        expect(service.selectedColor['redValue']).toEqual(MAX_COLOR_VALUE);
    });

    it(' setRedHex should change selectedColor', () => {
        service.selectedColor = new Color(BLACK);
        service.setGreenHex('ff');
        expect(service.selectedColor.hex).toEqual('00FF00');
        expect(service.selectedColor['greenValue']).toEqual(MAX_COLOR_VALUE);
    });

    it(' setRedHex should change selectedColor', () => {
        service.selectedColor = new Color(BLACK);
        service.setBlueHex('ff');
        expect(service.selectedColor.hex).toEqual('0000FF');
        expect(service.selectedColor['blueValue']).toEqual(MAX_COLOR_VALUE);
    });

    it(' confirmSelectedColor should set primary to selectedColor if isSecondaryColorPicker is false', () => {
        service.selectedColor = new Color(BLACK);
        service.primaryColor.next(new Color(WHITE));
        service.confirmSelectedColor(false);
        expect(service.primaryColor.getValue()).toEqual(service.selectedColor);
    });

    it(' confirmSelectedColor should set secondary to selectedColor if isSecondaryColorPicker is true', () => {
        service.selectedColor = new Color(BLACK);
        service.primaryColor.next(new Color(WHITE));
        service.confirmSelectedColor(true);
        expect(service.secondaryColor.getValue()).toEqual(service.selectedColor);
    });

    it(' confirmSelectedColor should call addToRecentColors', () => {
        const addToRecentColorsSpy = spyOn<any>(service, 'addToRecentColors').and.callThrough();
        service.confirmSelectedColor(true);
        expect(addToRecentColorsSpy).toHaveBeenCalledWith(new Color(service.selectedColor.hex));
    });

    it(' resetSelectedColor should set selected color to primary if isSecondaryColorPicker false', () => {
        service.primaryColor.next(new Color(BLACK));
        service.selectedColor = new Color(WHITE);
        service.resetSelectedColor(false);
        expect(service.selectedColor).toEqual(service.primaryColor.getValue());
    });

    it(' resetSelectedColor should set selected color to secondary if isSecondaryColorPicker true', () => {
        service.secondaryColor.next(new Color(BLACK));
        service.selectedColor = new Color(WHITE);
        service.resetSelectedColor(true);
        expect(service.selectedColor).toEqual(service.secondaryColor.getValue());
    });

    it(' swapColors should switch primary and secondary colors', () => {
        service.primaryColor.next(new Color(BLACK));
        service.secondaryColor.next(new Color(WHITE));

        service.swapColors();
        expect(service.primaryColor.getValue()).toEqual(new Color(WHITE));
        expect(service.secondaryColor.getValue()).toEqual(new Color(BLACK));
    });

    it(' applyRecentColor should change primary if isSecondaryColor false', () => {
        service.primaryColor.next(new Color(BLACK));
        service.applyRecentColor(new Color(WHITE), false);
        expect(service.primaryColor.getValue()).toEqual(new Color(WHITE));
    });

    it(' applyRecentColor should change secondaryColor if isSecondaryColor true', () => {
        service.secondaryColor.next(new Color(BLACK));
        service.applyRecentColor(new Color(WHITE), true);
        expect(service.secondaryColor.getValue()).toEqual(new Color(WHITE));
    });

    it(' applyRecentColor should not change color opacity', () => {
        const expectedOpacity = 0.5;
        service.primaryColor.next(new Color(BLACK, expectedOpacity));
        const tempColor = new Color(WHITE, 1);

        service.applyRecentColor(new Color(WHITE), false);
        expect(service.primaryColor.getValue().hex).toEqual(tempColor.hex);
        expect(service.primaryColor.getValue().opacity).toEqual(expectedOpacity);
    });

    it(' setPrimaryColor should change primary color', () => {
        service.primaryColor.next(new Color(BLACK));
        const expectedColor = new Color(WHITE);

        service.setPrimaryColor(expectedColor);
        expect(service.primaryColor.getValue()).toEqual(expectedColor);
    });

    it(' setSecondaryColor should change secondary color', () => {
        service.secondaryColor.next(new Color(BLACK));
        const expectedColor = new Color(WHITE);

        service.setSecondaryColor(expectedColor);
        expect(service.secondaryColor.getValue()).toEqual(expectedColor);
    });

    it(' updateSelectedColor should change selectedColor', () => {
        const expectedColor: Color = new Color('FF0000');
        service.colorCanvasCtx.fillStyle = 'red';
        service.colorCanvasCtx.fillRect(0, 0, service.canvas.width, service.canvas.height);
        service.selectedColor = new Color(BLACK);

        service['updateSelectedColor'](leftMouseEvent);
        expect(service.selectedColor).toEqual(expectedColor);
    });

    it(' updateSelectedColor should not change opacity of selectedColor', () => {
        const expectedOpacity = 0.5;
        service.colorCanvasCtx.fillStyle = 'red';
        service.colorCanvasCtx.fillRect(0, 0, service.canvas.width, service.canvas.height);
        service.selectedColor = new Color(BLACK, expectedOpacity);
        service['updateSelectedColor'](leftMouseEvent);

        expect(service.selectedColor.opacity).toEqual(expectedOpacity);
    });

    it(' updateSelectedColor should call drawCursor', () => {
        const drawCursorSpy = spyOn<any>(service, 'drawCursor').and.callThrough();
        service['updateSelectedColor'](leftMouseEvent);
        expect(drawCursorSpy).toHaveBeenCalled();
    });

    it(' getColorFromPosition should return correct color', () => {
        const expectedColor: Color = new Color('FF0000');
        service.colorCanvasCtx.fillStyle = 'red';
        service.colorCanvasCtx.fillRect(0, 0, service.canvas.width, service.canvas.height);

        const returnedColor = service['getColorFromPosition']({ x: 25, y: 25 } as Vec2);
        expect(returnedColor).toBeTruthy();
        expect(returnedColor).toEqual(expectedColor);
    });

    it(' getColorFromPosition returned color opacity should equal selected color opacity ', () => {
        const expectedOpacity = 0.5;
        service.selectedColor = new Color(BLACK, expectedOpacity);
        service.colorCanvasCtx.fillStyle = 'red';
        service.colorCanvasCtx.fillRect(0, 0, service.canvas.width, service.canvas.height);

        const returnedColor = service['getColorFromPosition']({ x: 25, y: 25 } as Vec2);
        expect(returnedColor).toBeTruthy();
        expect(returnedColor.opacity).toEqual(expectedOpacity);
    });

    it(' addToRecentColors should remove last color from recentColors array if length is MAX_RECENT_COLORS_SIZE', () => {
        service.recentColors = [];
        for (let i = 0; i < MAX_RECENT_COLORS_SIZE; i++) {
            service.recentColors.push(new Color(BLACK));
        }
        service['addToRecentColors'](new Color());
        expect(service.recentColors.length).toEqual(MAX_RECENT_COLORS_SIZE);
    });

    it(' addToRecentColors should add color to top of recentColors array', () => {
        const expectedColor = new Color(WHITE);
        service['addToRecentColors'](expectedColor);
        expect(service.recentColors[0]).toEqual(expectedColor);
    });

    it(' addToRecentColors should not add same color more than once ', () => {
        service.recentColors = [];
        service['addToRecentColors'](new Color(BLACK));
        service['addToRecentColors'](new Color(BLACK));
        expect(service.recentColors.length).toEqual(1);
    });
});
