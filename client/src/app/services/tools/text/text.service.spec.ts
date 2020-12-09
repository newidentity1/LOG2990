import { TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { Color } from '@app/classes/color/color';
import { Tool } from '@app/classes/tool/tool';
import { TextProperties } from '@app/classes/tools-properties/text-properties';
import { Vec2 } from '@app/classes/vec2';
import { TextAlignment } from '@app/enums/text-alignment.enum';
import { TextFont } from '@app/enums/text-font.enum';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ShortcutService } from '@app/services/shortcut/shortcut.service';
import { TextActionKeysService } from './text-action-keys/text-action-keys.service';
import { TextService } from './text.service';

describe('TextService', () => {
    let service: TextService;
    let drawingServiceSpy: jasmine.SpyObj<DrawingService>;
    let shortcutServiceSpy: jasmine.SpyObj<ShortcutService>;
    let textActionKeysServiceStub: TextActionKeysService;

    // tslint:disable: no-string-literal / reason: private function
    beforeEach(() => {
        drawingServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas', 'setThickness', 'setTextStyle', 'setTextAlignment']);
        shortcutServiceSpy = jasmine.createSpyObj('ShortcutService', ['addShortcut']);
        textActionKeysServiceStub = new TextActionKeysService(drawingServiceSpy);
        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawingServiceSpy },
                { provide: ShortcutService, useValue: shortcutServiceSpy },
                { provide: TextActionKeysService, useValue: textActionKeysServiceStub },
            ],
        });

        drawingServiceSpy = TestBed.inject(DrawingService) as jasmine.SpyObj<DrawingService>;
        drawingServiceSpy.canvas = canvasTestHelper.canvas;
        drawingServiceSpy.previewCtx = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        const baseCanvas = document.createElement('canvas');
        drawingServiceSpy.baseCtx = baseCanvas.getContext('2d') as CanvasRenderingContext2D;

        shortcutServiceSpy = TestBed.inject(ShortcutService) as jasmine.SpyObj<ShortcutService>;
        service = TestBed.inject(TextService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('onEscape should clear the current text and reset state of service', () => {
        spyOn(window, 'clearInterval');
        expect(service.onEscape()).toEqual([0, 0, ['']]);
        expect(service.mouseDown).toEqual(false);
        expect(shortcutServiceSpy.disableShortcuts).toEqual(false);
        expect(drawingServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(window.clearInterval).toHaveBeenCalled();

        expect(service['isInitialText']).toEqual(true);
        expect(service['cursorColumnIndex']).toEqual(0);
        expect(service['cursorRowIndex']).toEqual(0);
        expect(service['currentTexts']).toEqual(['']);
    });

    it('onKeyDown should not do anything if mouse down is false', () => {
        spyOn(textActionKeysServiceStub, 'onEnter').and.callThrough();
        spyOn(service, 'writeText');
        service.mouseDown = false;
        const enterEvent = { key: 'Enter' } as KeyboardEvent;
        service.onKeyDown(enterEvent);
        expect(textActionKeysServiceStub.onEnter).not.toHaveBeenCalled();
        expect(service.writeText).not.toHaveBeenCalled();
    });

    it('onKeyDown should execute an action if the key is a action and mouse down is true', () => {
        spyOn(textActionKeysServiceStub, 'onEnter').and.callFake(() => {
            return [0, 0, ['']];
        });
        spyOn(service, 'writeText');
        service.mouseDown = true;
        const enterEvent = { key: 'Enter' } as KeyboardEvent;
        textActionKeysServiceStub.actionKeys.set('Enter', textActionKeysServiceStub.onEnter.bind(textActionKeysServiceStub));
        service.onKeyDown(enterEvent);
        expect(textActionKeysServiceStub.onEnter).toHaveBeenCalled();
        expect(service.writeText).toHaveBeenCalled();
    });

    it('onKeyDown should not execute an action if the key is a action and mouse down is true', () => {
        spyOn(textActionKeysServiceStub, 'onEnter').and.callThrough();
        spyOn(service, 'writeText');
        service.mouseDown = true;
        const enterEvent = { key: 'Enter123' } as KeyboardEvent;
        service.onKeyDown(enterEvent);
        expect(textActionKeysServiceStub.onEnter).not.toHaveBeenCalled();
        expect(service.writeText).not.toHaveBeenCalled();
    });

    it('onKeyDown should add the key if its a letter, increment column index and call writeText', () => {
        spyOn(service, 'writeText');
        service.mouseDown = true;
        const enterEvent = { key: 'a' } as KeyboardEvent;
        service.onKeyDown(enterEvent);
        expect(service['cursorColumnIndex']).toEqual(1);
        expect(service['currentTexts']).toEqual(['a']);
        expect(service.writeText).toHaveBeenCalled();
    });

    it('onClick should confirmText if text is in progress and the click isnt inside textarea', () => {
        spyOn(service, 'confirmText').and.callFake(() => {
            return;
        });
        spyOn(service, 'isTextInProgress').and.callFake(() => {
            return true;
        });
        spyOn(service, 'isClickInsideTextArea').and.callFake(() => {
            return false;
        });
        const mouseEvent = { button: 0 } as MouseEvent;
        service.onClick(mouseEvent);
        expect(service.confirmText).toHaveBeenCalled();
    });

    it('onClick should reset text if text isnt in progress', () => {
        spyOn(Tool.prototype, 'getPositionFromMouse');
        spyOn(service, 'writeText').and.callFake(() => {
            return false;
        });
        spyOn(service, 'isClickInsideTextArea').and.callFake(() => {
            return false;
        });
        const mouseEvent = { offsetX: 0, offsetY: 0, button: 0 } as MouseEvent;
        service.onClick(mouseEvent);
        expect(Tool.prototype.getPositionFromMouse).toHaveBeenCalled();
        expect(service['textConfirmed']).toEqual(false);
        expect(service.writeText).toHaveBeenCalled();
    });

    it('onClick should not do anything text not in progress and mouse not down', () => {
        spyOn(Tool.prototype, 'getPositionFromMouse');
        spyOn(service, 'writeText').and.callFake(() => {
            return false;
        });
        spyOn(service, 'isClickInsideTextArea').and.callFake(() => {
            return false;
        });
        spyOn(service, 'isTextInProgress').and.callFake(() => {
            return false;
        });
        const mouseEvent = { offsetX: 0, offsetY: 0, button: 1 } as MouseEvent;
        service['textConfirmed'] = true;
        service.onClick(mouseEvent);
        expect(Tool.prototype.getPositionFromMouse).not.toHaveBeenCalled();
        expect(service['textConfirmed']).toBeTrue();
        expect(service.writeText).not.toHaveBeenCalled();
    });

    it('onClick should not clear text when click is inside area and should not change value of initialText if its false', () => {
        spyOn(Tool.prototype, 'getPositionFromMouse');
        spyOn(service, 'writeText').and.callFake(() => {
            return false;
        });
        spyOn(service, 'isClickInsideTextArea').and.callFake(() => {
            return true;
        });
        spyOn(service, 'isTextInProgress').and.callFake(() => {
            return false;
        });
        const mouseEvent = { offsetX: 0, offsetY: 0, button: 0 } as MouseEvent;
        service['textConfirmed'] = true;
        service['isInitialText'] = false;
        service.onClick(mouseEvent);
        expect(Tool.prototype.getPositionFromMouse).not.toHaveBeenCalled();
        expect(service['textConfirmed']).toBeFalse();
        expect(service['isInitialText']).toBeFalse();
        expect(service.writeText).toHaveBeenCalled();
    });

    it('writeText should do nothing if mouse down is false', () => {
        spyOn(service, 'createStyle').and.callFake(() => {
            return;
        });
        spyOn(service, 'writeTexts').and.callFake(() => {
            return;
        });
        spyOn(service, 'setCursor').and.callFake(() => {
            return;
        });
        spyOn(service, 'drawTextArea').and.callFake(() => {
            return;
        });
        service.mouseDown = false;
        service.writeText(drawingServiceSpy.previewCtx);
        expect(service.createStyle).not.toHaveBeenCalled();
        expect(drawingServiceSpy.clearCanvas).not.toHaveBeenCalled();
        expect(service.writeTexts).not.toHaveBeenCalled();
        expect(service.setCursor).not.toHaveBeenCalled();
        expect(service.drawTextArea).not.toHaveBeenCalled();
    });

    it('writeText should createStyle, clearCanvas and writeTexts. It should call setCursor if callCursor is true and drawTextArea on preview', () => {
        spyOn(service, 'createStyle').and.callFake(() => {
            return;
        });
        spyOn(service, 'writeTexts').and.callFake(() => {
            return;
        });
        spyOn(service, 'setCursor').and.callFake(() => {
            return;
        });
        spyOn(service, 'drawTextArea').and.callFake(() => {
            return;
        });
        service.mouseDown = true;
        service.writeText(drawingServiceSpy.previewCtx);
        expect(service.createStyle).toHaveBeenCalled();
        expect(drawingServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(service.writeTexts).toHaveBeenCalled();
        expect(service.setCursor).toHaveBeenCalled();
        expect(service.drawTextArea).toHaveBeenCalled();
    });

    it('writeText should createStyle, clearCanvas and writeTexts.shouldnt call setCursor if callCursor is false and drawTextArea on preview', () => {
        spyOn(service, 'createStyle').and.callFake(() => {
            return;
        });
        spyOn(service, 'writeTexts').and.callFake(() => {
            return;
        });
        spyOn(service, 'setCursor').and.callFake(() => {
            return;
        });
        spyOn(service, 'drawTextArea').and.callFake(() => {
            return;
        });
        service.mouseDown = true;
        service.writeText(drawingServiceSpy.previewCtx, false);
        expect(service.createStyle).toHaveBeenCalled();
        expect(drawingServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(service.writeTexts).toHaveBeenCalled();
        expect(service.setCursor).not.toHaveBeenCalled();
        expect(service.drawTextArea).toHaveBeenCalled();
    });

    it('writeText should not createStyle, clearCanvas and writeTexts. it shouldnt call drawTextArea and set cursor', () => {
        spyOn(service, 'createStyle').and.callFake(() => {
            return;
        });
        spyOn(service, 'writeTexts').and.callFake(() => {
            return;
        });
        spyOn(service, 'setCursor').and.callFake(() => {
            return;
        });
        spyOn(service, 'drawTextArea').and.callFake(() => {
            return;
        });
        service.mouseDown = true;
        service.writeText(drawingServiceSpy.baseCtx);
        expect(service.createStyle).toHaveBeenCalled();
        expect(drawingServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(service.writeTexts).toHaveBeenCalled();
        expect(service.setCursor).not.toHaveBeenCalled();
        expect(service.drawTextArea).not.toHaveBeenCalled();
    });

    it('isTextInProgress should return false is mouse isnt down', () => {
        service.mouseDown = false;
        expect(service.isTextInProgress()).toBeFalse();
    });

    it('writeTexts should write the text at the correct position', () => {
        service['currentTexts'] = ['test'];
        spyOn(service, 'calculateXCoordText').and.callFake(() => {
            return 0;
        });
        service.writeTexts(drawingServiceSpy.previewCtx);
        expect(service.calculateXCoordText).toHaveBeenCalledTimes(service['currentTexts'].length);
    });

    it('confirmText should write text in base context and reset the state of the service', () => {
        spyOn(service, 'writeText').and.callFake(() => {
            return;
        });
        spyOn(window, 'clearInterval').and.callFake(() => {
            return;
        });
        spyOn(service.executedCommand, 'emit').and.callFake(() => {
            return;
        });
        service.confirmText();
        expect(service.writeText).toHaveBeenCalledWith(drawingServiceSpy.baseCtx);
        expect(window.clearInterval).toHaveBeenCalled();
        expect(service.executedCommand.emit).toHaveBeenCalled();
        expect(service['textConfirmed']).toBeTrue();
        expect(service.mouseDown).toBeFalse();
        expect(shortcutServiceSpy.disableShortcuts).toBeFalse();
        expect(service['currentTexts']).toEqual(['']);
        expect(service['cursorRowIndex']).toEqual(0);
        expect(service['cursorColumnIndex']).toEqual(0);
    });

    it('drawTextArea should draw a text area around the text', () => {
        spyOn(service, 'calculateLongestWidth').and.callFake(() => {
            return 0;
        });
        service['currentTexts'] = [''];
        service.mouseDownCoord = { x: 2, y: 5 } as Vec2;
        service.drawTextArea();
        expect(service.calculateLongestWidth).toHaveBeenCalled();
        const HEIGHT_FACTOR = 5;
        const SPACE = 10;
        const properties = service.toolProperties as TextProperties;
        expect(service['textAreaDimensions'].x).toEqual(SPACE);
        expect(service['textAreaDimensions'].y).toEqual(-properties.size + 2);
        expect(service['textAreaStartingPoint']).toEqual({
            x: service.mouseDownCoord.x - 2,
            y: service.mouseDownCoord.y + properties.size / HEIGHT_FACTOR,
        } as Vec2);
    });

    it('setCursor should clearInterval if it exist and call setInterval', () => {
        spyOn(window, 'clearInterval').and.callFake(() => {
            return;
        });

        spyOn(window, 'setInterval').and.callThrough();
        service['cursorIntervalRef'] = 1;
        service.setCursor();
        expect(window.clearInterval).toHaveBeenCalled();
        expect(window.setInterval).toHaveBeenCalled();
    });

    it('setCursor shouldnt clearInterval if it doesn exist and call setInterval', () => {
        spyOn(window, 'clearInterval').and.callFake(() => {
            return;
        });

        spyOn(window, 'setInterval').and.callThrough();
        service.setCursor();
        expect(window.clearInterval).not.toHaveBeenCalled();
        expect(window.setInterval).toHaveBeenCalled();
    });

    it('drawCursor should clearInterval if it exist and call setInterval', () => {
        spyOn(service, 'calculateXCoordCursor').and.callFake(() => {
            return 1;
        });

        spyOn(service, 'writeText').and.callFake(() => {
            return;
        });

        const delay = 1000;
        jasmine.clock().install();
        service.drawCursor();
        jasmine.clock().tick(delay);
        expect(service.calculateXCoordCursor).toHaveBeenCalled();
        expect(service.writeText).toHaveBeenCalled();
        jasmine.clock().uninstall();
    });

    it('calculateXCoordText should return x based on text alignment left', () => {
        service.mouseDownCoord.x = 0;
        const properties = service.toolProperties as TextProperties;
        properties.textAlignment = TextAlignment.Left;
        spyOn(service, 'calculateLongestWidth').and.callFake(() => {
            return 1;
        });

        expect(service.calculateXCoordText()).toEqual(service.mouseDownCoord.x);
        expect(service.calculateLongestWidth).not.toHaveBeenCalled();
    });

    it('calculateXCoordText should return x based on text alignment middle', () => {
        service.mouseDownCoord.x = 0;
        const properties = service.toolProperties as TextProperties;
        properties.textAlignment = TextAlignment.Middle;
        spyOn(service, 'calculateLongestWidth').and.callFake(() => {
            return 1;
        });

        expect(service.calculateXCoordText()).toEqual(service.mouseDownCoord.x + 1 / 2);
        expect(service.calculateLongestWidth).toHaveBeenCalled();
    });

    it('calculateXCoordText should return x based on text alignment right', () => {
        service.mouseDownCoord.x = 0;
        const properties = service.toolProperties as TextProperties;
        properties.textAlignment = TextAlignment.Right;
        spyOn(service, 'calculateLongestWidth').and.callFake(() => {
            return 1;
        });

        expect(service.calculateXCoordText()).toEqual(service.mouseDownCoord.x + 1);
        expect(service.calculateLongestWidth).toHaveBeenCalled();
    });

    it('calculateXCoordCursor should return x of cursor based on text alignment left', () => {
        service.mouseDownCoord.x = 0;
        const properties = service.toolProperties as TextProperties;
        properties.textAlignment = TextAlignment.Left;
        spyOn(drawingServiceSpy.previewCtx, 'measureText').and.callFake(() => {
            return { width: 1 } as TextMetrics;
        });

        expect(service.calculateXCoordCursor()).toEqual(service.mouseDownCoord.x + 1);
    });

    it('calculateXCoordCursor should return x of cursor based on text alignment middle', () => {
        service.mouseDownCoord.x = 0;
        const properties = service.toolProperties as TextProperties;
        properties.textAlignment = TextAlignment.Middle;
        spyOn(drawingServiceSpy.previewCtx, 'measureText').and.callFake(() => {
            return { width: 1 } as TextMetrics;
        });

        spyOn(service, 'calculateXCoordText').and.callFake(() => {
            return 1;
        });

        expect(service.calculateXCoordCursor()).toEqual(1 - 1 / 2 + 1);
        expect(service.calculateXCoordText).toHaveBeenCalled();
    });

    it('calculateXCoordCursor should return x of cursor based on text alignment right', () => {
        service.mouseDownCoord.x = 0;
        const properties = service.toolProperties as TextProperties;
        properties.textAlignment = TextAlignment.Right;
        spyOn(drawingServiceSpy.previewCtx, 'measureText').and.callFake(() => {
            return { width: 1 } as TextMetrics;
        });

        spyOn(service, 'calculateLongestWidth').and.callFake(() => {
            return 1;
        });

        expect(service.calculateXCoordCursor()).toEqual(service.mouseDownCoord.x + 1 - 1);
        expect(service.calculateLongestWidth).toHaveBeenCalled();
    });

    it('calculateLongestWidth should the width of the longest text row', () => {
        service['currentTexts'] = ['1', '12'];
        const longestWidth = drawingServiceSpy.previewCtx.measureText('12').width;
        spyOn(drawingServiceSpy.previewCtx, 'measureText').and.callThrough();
        expect(service.calculateLongestWidth()).toEqual(longestWidth);
        expect(drawingServiceSpy.previewCtx.measureText).toHaveBeenCalledTimes(service['currentTexts'].length + 1);
    });

    it('isClickInsideTextArea should return true if X and Y are inside the text area', () => {
        const mouseEvent = { offsetX: 1, offsetY: 3 } as MouseEvent;
        service['textAreaStartingPoint'] = { x: 0, y: 2 } as Vec2;
        service['textAreaDimensions'] = { x: 2, y: -2 } as Vec2;
        expect(service.isClickInsideTextArea(mouseEvent)).toBeTrue();
    });

    it('isClickInsideTextArea should return false if X is true and Y false are inside the text area', () => {
        const mouseEvent = { offsetX: 1, offsetY: 1 } as MouseEvent;
        service['textAreaStartingPoint'] = { x: 0, y: 0 } as Vec2;
        service['textAreaDimensions'] = { x: 2, y: 2 } as Vec2;
        expect(service.isClickInsideTextArea(mouseEvent)).toBeFalse();
    });

    it('isClickInsideTextArea should return false if X is false and Y true are inside the text area', () => {
        const mouseEvent = { offsetX: 20, offsetY: 3 } as MouseEvent;
        service['textAreaStartingPoint'] = { x: 0, y: 0 } as Vec2;
        service['textAreaDimensions'] = { x: 2, y: 2 } as Vec2;
        expect(service.isClickInsideTextArea(mouseEvent)).toBeFalse();
    });

    it('rewriteText should call writeText isTextInProgress is true', () => {
        spyOn(service, 'isTextInProgress').and.returnValue(true);
        spyOn(service, 'writeText');
        // tslint:disable-next-line: no-string-literal reason: private function
        service['rewriteText']();
        expect(service.writeText).toHaveBeenCalledWith(drawingServiceSpy.previewCtx);
    });

    it('rewriteText should not call writeText isTextInProgress is false', () => {
        spyOn(service, 'isTextInProgress').and.returnValue(false);
        spyOn(service, 'writeText');
        // tslint:disable-next-line: no-string-literal reason: private function
        service['rewriteText']();
        expect(service.writeText).not.toHaveBeenCalled();
    });

    it('setFontText should update font if its a valid value and call rewriteText', () => {
        // tslint:disable-next-line: no-any / reason: spy on private method
        spyOn<any>(service, 'rewriteText');
        const properties = service.toolProperties as TextProperties;
        properties.font = TextFont.TimesNewRoman;
        // tslint:disable-next-line: no-string-literal reason:call private method
        service.setFontText(TextFont.Arial);
        // tslint:disable-next-line: no-string-literal / reason:call private method
        expect(service['rewriteText']).toHaveBeenCalled();
        expect(properties.font).toEqual(TextFont.Arial);
    });

    it('setFontText should not update font if its an invalid value and call rewriteText', () => {
        // tslint:disable-next-line: no-any / reason: spy on private method
        spyOn<any>(service, 'rewriteText');
        const properties = service.toolProperties as TextProperties;
        properties.font = TextFont.TimesNewRoman;
        // tslint:disable-next-line: no-string-literal reason:call private method
        service.setFontText('');
        // tslint:disable-next-line: no-string-literal / reason:call private method
        expect(service['rewriteText']).toHaveBeenCalled();
        expect(properties.font).toEqual(TextFont.TimesNewRoman);
    });

    it('setTextAlignment should update textAlignment if its a valid value and call rewriteText', () => {
        // tslint:disable-next-line: no-any / reason: spy on private method
        spyOn<any>(service, 'rewriteText');
        const properties = service.toolProperties as TextProperties;
        properties.textAlignment = TextAlignment.Left;
        // tslint:disable-next-line: no-string-literal reason:call private method
        service.setTextAlignment(TextAlignment.Middle);
        // tslint:disable-next-line: no-string-literal / reason:call private method
        expect(service['rewriteText']).toHaveBeenCalled();
        expect(properties.textAlignment).toEqual(TextAlignment.Middle);
    });

    it('setTextAlignment should not update textAlignment if its an invalid value and call rewriteText', () => {
        // tslint:disable-next-line: no-any / reason: spy on private method
        spyOn<any>(service, 'rewriteText');
        const properties = service.toolProperties as TextProperties;
        properties.textAlignment = TextAlignment.Left;
        // tslint:disable-next-line: no-string-literal reason:call private method
        service.setTextAlignment('');
        // tslint:disable-next-line: no-string-literal / reason:call private method
        expect(service['rewriteText']).toHaveBeenCalled();
        expect(properties.textAlignment).toEqual(TextAlignment.Left);
    });

    it('setSizeText should update size if its a valid value and call rewriteText', () => {
        // tslint:disable-next-line: no-any / reason: spy on private method
        spyOn<any>(service, 'rewriteText');
        const properties = service.toolProperties as TextProperties;
        properties.size = 1;
        // tslint:disable-next-line: no-string-literal reason:call private method
        const newValue = 20;
        service.setSizeText(newValue);
        // tslint:disable-next-line: no-string-literal / reason:call private method
        expect(service['rewriteText']).toHaveBeenCalled();
        expect(properties.size).toEqual(newValue);
    });

    it('setSizeText should not update size if its an invalid value and call rewriteText', () => {
        // tslint:disable-next-line: no-any / reason: spy on private method
        spyOn<any>(service, 'rewriteText');
        const properties = service.toolProperties as TextProperties;
        properties.size = 1;
        // tslint:disable-next-line: no-string-literal reason:call private method
        service.setSizeText(null);
        // tslint:disable-next-line: no-string-literal / reason:call private method
        expect(service['rewriteText']).toHaveBeenCalled();
        expect(properties.size).toEqual(1);
        expect(drawingServiceSpy.setThickness).toHaveBeenCalled();
    });

    it('setBold should set the property bold to value and call rewriteText', () => {
        // tslint:disable-next-line: no-any / reason: spy on private method
        spyOn<any>(service, 'rewriteText');
        const properties = service.toolProperties as TextProperties;
        properties.isBold = false;
        service.setBold(true);
        // tslint:disable-next-line: no-string-literal / reason:call private method
        expect(service['rewriteText']).toHaveBeenCalled();
        expect(properties.isBold).toBeTrue();
    });

    it('setItalic should set the property italic to value and call rewriteText', () => {
        // tslint:disable-next-line: no-any / reason: spy on private method
        spyOn<any>(service, 'rewriteText');
        const properties = service.toolProperties as TextProperties;
        properties.isItalic = true;
        service.setItalic(false);
        // tslint:disable-next-line: no-string-literal / reason:call private method
        expect(service['rewriteText']).toHaveBeenCalled();
        expect(properties.isBold).toBeFalse();
    });

    it('createStyle should create the current style with text properties with bold and italic true', () => {
        const properties = service.toolProperties as TextProperties;
        properties.isItalic = true;
        properties.isBold = true;
        properties.size = 1;
        properties.font = TextFont.Arial;
        service.createStyle(properties);
        expect(service['currentStyle']).toEqual('italic bold 1px Arial');
        expect(drawingServiceSpy.setTextStyle).toHaveBeenCalled();
        expect(drawingServiceSpy.setTextAlignment).toHaveBeenCalled();
    });

    it('createStyle should create the current style with text properties with bold and italic false', () => {
        const properties = service.toolProperties as TextProperties;
        properties.isItalic = false;
        properties.isBold = false;
        properties.size = 1;
        properties.font = TextFont.Arial;
        service.createStyle(properties);
        expect(service['currentStyle']).toEqual('  1px Arial');
        expect(drawingServiceSpy.setTextStyle).toHaveBeenCalled();
        expect(drawingServiceSpy.setTextAlignment).toHaveBeenCalled();
    });

    it('setColors should call setColors of Tool and rewriteText', () => {
        // tslint:disable-next-line: no-any / reason: spy on private method
        spyOn<any>(service, 'rewriteText');
        spyOn(Tool.prototype, 'setColors');
        service.setColors(new Color(), new Color());
        // tslint:disable-next-line: no-string-literal / reason: access private method
        expect(service['rewriteText']).toHaveBeenCalled();
        expect(Tool.prototype.setColors).toHaveBeenCalled();
    });

    it('applyCurrentSettings should apply all properties', () => {
        spyOn(Tool.prototype, 'applyCurrentSettings');
        spyOn(service, 'setFontText');
        spyOn(service, 'setItalic');
        spyOn(service, 'setBold');
        spyOn(service, 'setSizeText');
        spyOn(service, 'setTextAlignment');
        service.applyCurrentSettings();
        expect(Tool.prototype.applyCurrentSettings).toHaveBeenCalled();
        expect(service.setFontText).toHaveBeenCalled();
        expect(service.setItalic).toHaveBeenCalled();
        expect(service.setBold).toHaveBeenCalled();
        expect(service.setSizeText).toHaveBeenCalled();
        expect(service.setTextAlignment).toHaveBeenCalled();
        expect(drawingServiceSpy.clearCanvas).toHaveBeenCalled();
    });

    it('execute should call write text with base context', () => {
        spyOn(service, 'writeText').and.callFake(() => {
            return;
        });
        service.execute();
        expect(service.writeText).toHaveBeenCalledWith(drawingServiceSpy.baseCtx);
    });

    it('copyClone should copy properties of the service', () => {
        spyOn(Tool.prototype, 'copyTool');
        const tool = new TextService(drawingServiceSpy, shortcutServiceSpy, textActionKeysServiceStub);
        service.copyTool(tool);
        expect(Tool.prototype.copyTool).toHaveBeenCalled();
        expect(tool).toEqual(service);
    });

    it('clone should clone the service', () => {
        spyOn(service, 'copyTool');
        const clone = service.clone();
        expect(clone.toolProperties).toEqual(service.toolProperties);
        expect(service.copyTool).toHaveBeenCalled();
    });
});
// tslint:disable-next-line: max-file-line-count / reason: test file
