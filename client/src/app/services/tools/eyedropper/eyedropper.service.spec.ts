import { TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { Color } from '@app/classes/color/color';
import { Vec2 } from '@app/classes/vec2';
import {
    EYEDROPPER_PREVIEW_CANVAS_HEIGHT,
    EYEDROPPER_PREVIEW_CANVAS_WIDTH,
    EYEDROPPER_PREVIEW_CURSOR_SIZE,
    IMAGE_DATA_OPACITY_INDEX,
    MAX_COLOR_VALUE,
    WHITE,
} from '@app/constants/constants';
import { MouseButton } from '@app/enums/mouse-button.enum';
import { ColorPickerService } from '@app/services/color-picker/color-picker.service';
import { EyedropperService } from './eyedropper.service';

describe('EyedropperService', () => {
    let service: EyedropperService;
    let mouseEvent: MouseEvent;

    let baseCtxStub: CanvasRenderingContext2D;

    // tslint:disable:no-any / reason: spying on function
    let drawPreviewSpy: jasmine.Spy<any>;
    let colorPickerServiceSpy: jasmine.SpyObj<any>;

    beforeEach(() => {
        colorPickerServiceSpy = jasmine.createSpyObj('ColorPickerService', ['setPrimaryColor', 'setSecondaryColor']);

        TestBed.configureTestingModule({
            providers: [{ provide: ColorPickerService, useValue: colorPickerServiceSpy }],
        });
        service = TestBed.inject(EyedropperService);
        colorPickerServiceSpy = TestBed.inject(ColorPickerService) as jasmine.SpyObj<ColorPickerService>;

        // tslint:disable-next-line:no-any / reason: spying on function
        drawPreviewSpy = spyOn<any>(service, 'drawPreview').and.callThrough();

        const colorPreviewCanvas = document.createElement('canvas');
        const cursorCanvas = document.createElement('canvas');
        colorPreviewCanvas.width = cursorCanvas.width = EYEDROPPER_PREVIEW_CANVAS_WIDTH;
        colorPreviewCanvas.height = cursorCanvas.height = EYEDROPPER_PREVIEW_CANVAS_HEIGHT;
        service.previewCircleCtx = colorPreviewCanvas.getContext('2d') as CanvasRenderingContext2D;
        service.cursorCtx = cursorCanvas.getContext('2d') as CanvasRenderingContext2D;

        // tslint:disable:no-string-literal / reason: accessing private member
        const drawingCanvas = document.createElement('canvas');
        drawingCanvas.width = canvasTestHelper.canvas.width;
        drawingCanvas.height = canvasTestHelper.canvas.height;
        service['drawingService'].canvas = drawingCanvas;
        baseCtxStub = drawingCanvas.getContext('2d') as CanvasRenderingContext2D;
        service['drawingService'].baseCtx = baseCtxStub;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it(' onMouseMove should call drawPreview if mouse is in canvas', () => {
        mouseEvent = { offsetX: 25, offsetY: 25, button: MouseButton.Left } as MouseEvent;
        service['inCanvas'] = true;
        service.onMouseMove(mouseEvent);
        expect(drawPreviewSpy).toHaveBeenCalled();
    });

    it(' onMouseMove should not call drawPreview if mouse is not in canvas', () => {
        mouseEvent = { offsetX: 25, offsetY: 25, button: MouseButton.Left } as MouseEvent;
        service['inCanvas'] = false;
        service.onMouseMove(mouseEvent);
        expect(drawPreviewSpy).not.toHaveBeenCalled();
    });

    it(' onMouseUp should call setPrimaryColor if left mouse button was released and mouse is in canvas', () => {
        mouseEvent = { offsetX: 25, offsetY: 25, button: MouseButton.Left } as MouseEvent;
        service['inCanvas'] = true;
        service.onMouseUp(mouseEvent);
        expect(colorPickerServiceSpy.setPrimaryColor).toHaveBeenCalled();
    });

    it(' onMouseUp should call setSecondaryColor if right mouse button was released and mouse is in canvas', () => {
        mouseEvent = { offsetX: 25, offsetY: 25, button: MouseButton.Right } as MouseEvent;
        service['inCanvas'] = true;
        service.onMouseUp(mouseEvent);
        expect(colorPickerServiceSpy.setSecondaryColor).toHaveBeenCalled();
    });

    it(' onMouseUp should not call setPrimaryColor and setSecondaryColor if left or right mouse button were not released', () => {
        mouseEvent = { offsetX: 25, offsetY: 25, button: MouseButton.Middle } as MouseEvent;
        service['inCanvas'] = true;
        service.onMouseUp(mouseEvent);
        expect(colorPickerServiceSpy.setPrimaryColor).not.toHaveBeenCalled();
        expect(colorPickerServiceSpy.setSecondaryColor).not.toHaveBeenCalled();
    });

    it(' onMouseUp should not call setPrimaryColor and setSecondaryColor if left or right mouse button were released outside the canvas', () => {
        mouseEvent = { offsetX: 25, offsetY: 25, button: MouseButton.Left } as MouseEvent;
        service['inCanvas'] = false;
        service.onMouseUp(mouseEvent);
        expect(colorPickerServiceSpy.setPrimaryColor).not.toHaveBeenCalled();
        expect(colorPickerServiceSpy.setSecondaryColor).not.toHaveBeenCalled();
    });

    it(' drawPreview should call drawScaledZone and drawCursor', () => {
        const drawScaledZoneSpy = spyOn<any>(service, 'drawScaledZone').and.callThrough();
        const drawCursorSpy = spyOn<any>(service, 'drawCursor').and.callThrough();

        mouseEvent = { offsetX: 25, offsetY: 25, button: MouseButton.Left } as MouseEvent;
        service['drawPreview'](mouseEvent);
        expect(drawScaledZoneSpy).toHaveBeenCalled();
        expect(drawCursorSpy).toHaveBeenCalled();
    });

    it(' drawScaledZone should copy drawing canvas to color preview canvas', () => {
        // Setting canvas to red
        const expectedColor = new Color('FF0000');
        baseCtxStub.fillStyle = expectedColor.toStringRGBA();
        baseCtxStub.fillRect(0, 0, canvasTestHelper.canvas.width, canvasTestHelper.canvas.height);

        const pickedPos = { x: 25, y: 25 } as Vec2;
        service['drawScaledZone'](pickedPos);

        const rgbData = service.previewCircleCtx.getImageData(EYEDROPPER_PREVIEW_CANVAS_WIDTH / 2, EYEDROPPER_PREVIEW_CANVAS_HEIGHT / 2, 1, 1).data;
        expect(rgbData[0]).toEqual(expectedColor['redValue']);
        expect(rgbData[1]).toEqual(expectedColor['greenValue']);
        expect(rgbData[2]).toEqual(expectedColor['blueValue']);
        expect(rgbData[IMAGE_DATA_OPACITY_INDEX] / MAX_COLOR_VALUE).toEqual(expectedColor.opacity);
    });

    it(' drawCursor should draw cursor on color preview canvas', () => {
        // Setting canvas to red
        const expectedColor = new Color('FF0000');

        const pickedPos = { x: 25, y: 25 } as Vec2;
        service.currentColor = expectedColor;
        service['drawCursor'](pickedPos);

        const rgbData = service.cursorCtx.getImageData(
            pickedPos.x - EYEDROPPER_PREVIEW_CURSOR_SIZE / 2,
            pickedPos.y - EYEDROPPER_PREVIEW_CURSOR_SIZE / 2,
            1,
            1,
        ).data;
        expect(rgbData[0]).toEqual(expectedColor['redValue']);
        expect(rgbData[1]).toEqual(expectedColor['greenValue']);
        expect(rgbData[2]).toEqual(expectedColor['blueValue']);
        expect(rgbData[IMAGE_DATA_OPACITY_INDEX] / MAX_COLOR_VALUE).toEqual(expectedColor.opacity);
    });

    it(' getColorFromPosition should return color from canvas', () => {
        // Setting canvas to red
        const expectedColor = new Color('FF0000');
        baseCtxStub.fillStyle = expectedColor.toStringRGBA();
        baseCtxStub.fillRect(0, 0, canvasTestHelper.canvas.width, canvasTestHelper.canvas.height);

        const position = { x: 50, y: 50 } as Vec2;
        const returnedColor: Color = service['getColorFromPosition'](position);
        expect(returnedColor).toEqual(expectedColor);
    });

    it(' getColorFromPosition should return white color if picked color is white', () => {
        const expectedColor = new Color(WHITE);
        baseCtxStub.fillStyle = expectedColor.toStringRGBA();
        baseCtxStub.fillRect(0, 0, canvasTestHelper.canvas.width, canvasTestHelper.canvas.height);

        const position = { x: 50, y: 50 } as Vec2;
        const returnedColor: Color = service['getColorFromPosition'](position);
        expect(returnedColor).toEqual(expectedColor);
    });

    it(' resetContext call clearCanvas', () => {
        const clearCanvasSpy = spyOn(service['drawingService'], 'clearCanvas');
        service.resetContext();
        expect(clearCanvasSpy).toHaveBeenCalled();
    });
});
