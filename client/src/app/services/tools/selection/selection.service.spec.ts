import { TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { ShapeTool } from '@app/classes/tool/shape-tool';
import { IMAGE_DATA_OPACITY_INDEX } from '@app/constants/constants';
import { MouseButton } from '@app/enums/mouse-button.enum';
import { SelectionAction } from '@app/enums/selection-action.enum';
import { SelectionType } from '@app/enums/selection-type.enum';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { MagicWandService } from './magic-wand/magic-wand.service';
import { MoveSelectionService } from './move-selection/move-selection.service';
import { ResizeSelectionService } from './resize-selection/resize-selection.service';
import { RotateSelectionService } from './rotate-selection/rotate-selection.service';
import { SelectionService } from './selection.service';

describe('SelectionService', () => {
    let service: SelectionService;
    let drawingServiceSpy: jasmine.SpyObj<DrawingService>;
    let moveSelectionService: jasmine.SpyObj<MoveSelectionService>;
    let resizeSelectionService: jasmine.SpyObj<ResizeSelectionService>;
    let rotateSelectionService: jasmine.SpyObj<RotateSelectionService>;
    let magicWandService: jasmine.SpyObj<MagicWandService>;
    // tslint:disable:no-any / reason: spying on function
    let drawPreviewSpy: jasmine.Spy<any>;
    let drawSelectionSpy: jasmine.Spy<any>;
    let copySelectionSpy: jasmine.Spy<any>;
    let mouseEvent: MouseEvent;

    beforeEach(() => {
        drawingServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas', 'setThickness', 'setStrokeColor']);
        moveSelectionService = jasmine.createSpyObj('MoveSelectionService', ['setFinalPosition']);
        resizeSelectionService = jasmine.createSpyObj('ResizeSelectionService', [
            'applyScaleToImage',
            'scaleImage',
            'scaleImageKeepRatio',
            'isResizing',
            'onResize',
        ]);
        rotateSelectionService = jasmine.createSpyObj('RotateSelectionService', ['initializeRotation', 'scroll']);
        magicWandService = jasmine.createSpyObj('MagicWandService', ['copyMagicSelection']);

        moveSelectionService = new MoveSelectionService(drawingServiceSpy) as jasmine.SpyObj<MoveSelectionService>;
        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawingServiceSpy },
                { provide: MoveSelectionService, useValue: moveSelectionService },
                { provide: ResizeSelectionService, useValue: resizeSelectionService },
                { provide: RotateSelectionService, useValue: rotateSelectionService },
                { provide: MagicWandService, useValue: magicWandService },
            ],
        });
        service = TestBed.inject(SelectionService);
        // tslint:disable:no-string-literal / reason: accessing private member
        service['positiveStartingPos'] = { x: 0, y: 0 };
        service['currentMousePosition'] = { x: 0, y: 0 };

        drawingServiceSpy = TestBed.inject(DrawingService) as jasmine.SpyObj<DrawingService>;
        const canvas = document.createElement('canvas');
        canvas.width = canvasTestHelper.canvas.width;
        canvas.height = canvasTestHelper.canvas.height;
        // tslint:disable: no-string-literal / reason: accessing private member
        service['drawingService'].canvas = canvas;
        service['drawingService'].baseCtx = canvas.getContext('2d') as CanvasRenderingContext2D;
        service['drawingService'].previewCtx = canvas.getContext('2d') as CanvasRenderingContext2D;

        drawPreviewSpy = spyOn<any>(service, 'drawPreview').and.callThrough();
        drawSelectionSpy = spyOn<any>(service, 'drawSelection').and.callThrough();
        service['selectionImageData'] = drawingServiceSpy.baseCtx.getImageData(0, 0, 1, 1);
        moveSelectionService.imgData = drawingServiceSpy.baseCtx.getImageData(0, 0, 1, 1);

        moveSelectionService = TestBed.inject(MoveSelectionService) as jasmine.SpyObj<MoveSelectionService>;
        magicWandService = TestBed.inject(MagicWandService) as jasmine.SpyObj<MagicWandService>;
        resizeSelectionService = TestBed.inject(ResizeSelectionService) as jasmine.SpyObj<ResizeSelectionService>;
        rotateSelectionService = TestBed.inject(RotateSelectionService) as jasmine.SpyObj<RotateSelectionService>;
        rotateSelectionService.rotatedImage = {
            angle: 0,
            image: drawingServiceSpy.previewCtx.getImageData(
                0,
                0,
                drawingServiceSpy.previewCtx.canvas.width,
                drawingServiceSpy.previewCtx.canvas.height,
            ),
        };
        copySelectionSpy = spyOn<any>(moveSelectionService, 'copySelection').and.callThrough();

        mouseEvent = {
            clientX: 25,
            clientY: 25,
            offsetX: 25,
            offsetY: 25,
            button: MouseButton.Left,
        } as MouseEvent;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('setMoveSelectionMagnet should change value of isMagnet of move selection service', () => {
        moveSelectionService['isMagnet'] = false;
        service.setMoveSelectionMagnet(true);
        expect(moveSelectionService['isMagnet']).toBeTrue();
    });

    it('setSelectionType should change selection type to rectangel if rectangle was selected and call resetSelection', () => {
        service.currentType = SelectionType.EllipseSelection;
        service.setSelectionType(SelectionType.RectangleSelection);
        expect(service.currentType).toEqual(SelectionType.RectangleSelection);
        expect(drawSelectionSpy).toHaveBeenCalled();
    });

    it('setSelectionType should change selection type to ellipse if ellipse was selected and call resetSelection', () => {
        service.currentType = SelectionType.RectangleSelection;
        service.setSelectionType(SelectionType.EllipseSelection);
        expect(service.currentType).toEqual(SelectionType.EllipseSelection);
        expect(drawSelectionSpy).toHaveBeenCalled();
    });

    it('setSelectionType should change selection type to ellipse if ellipse was selected and call resetSelection', () => {
        service.currentType = SelectionType.RectangleSelection;
        service.setSelectionType(SelectionType.MagicWandSelection);
        expect(service.currentType).toEqual(SelectionType.MagicWandSelection);
        expect(drawSelectionSpy).toHaveBeenCalled();
    });

    it('onMouseDown should set mouseDown to true if left mouse button was clicked', () => {
        service.mouseDown = false;
        service.onMouseDown(mouseEvent);
        expect(service.mouseDown).toBeTrue();
    });

    it('onMouseDown should not set mouseDown to true if right mouse button was clicked', () => {
        const rightMouseEvent = {
            offsetX: 25,
            offsetY: 25,
            button: MouseButton.Right,
        } as MouseEvent;
        service.mouseDown = false;
        service.onMouseDown(rightMouseEvent);
        expect(service.mouseDown).toBeFalse();
    });

    it('onMouseDown should set moveSelectionPos if left mouse button was clicked and an area is selected', () => {
        service.mouseDown = false;
        service.isAreaSelected = true;
        service['moveSelectionPos'] = { x: 0, y: 0 };
        service.onMouseDown(mouseEvent);
        expect(service.mouseDown).toBeTrue();
        expect(service['moveSelectionPos']).toEqual({ x: mouseEvent.offsetX, y: mouseEvent.offsetY });
    });

    it('onMouseDown should should use scaled image if last action was resize', () => {
        drawingServiceSpy.previewCtx.clearRect(0, 0, drawingServiceSpy.previewCtx.canvas.width, drawingServiceSpy.previewCtx.canvas.height);
        resizeSelectionService.scaledImage = drawingServiceSpy.previewCtx.getImageData(
            0,
            0,
            drawingServiceSpy.previewCtx.canvas.width,
            drawingServiceSpy.previewCtx.canvas.height,
        );
        // tslint:disable-next-line: no-magic-numbers / reason: using random to test
        drawingServiceSpy.previewCtx.fillRect(0, 0, 10, 10);
        rotateSelectionService.rotatedImage.image = drawingServiceSpy.previewCtx.getImageData(
            0,
            0,
            drawingServiceSpy.previewCtx.canvas.width,
            drawingServiceSpy.previewCtx.canvas.height,
        );
        service.mouseDown = false;
        service.isAreaSelected = true;
        service['lastAction'] = SelectionAction.Resize;
        service.onMouseDown(mouseEvent);
        expect(moveSelectionService.imgData).toEqual(resizeSelectionService.scaledImage);
        expect(moveSelectionService.imgData).not.toEqual(rotateSelectionService.rotatedImage.image);
    });

    it('onMouseDown should use rotated image if last action was rotation', () => {
        drawingServiceSpy.previewCtx.clearRect(0, 0, drawingServiceSpy.previewCtx.canvas.width, drawingServiceSpy.previewCtx.canvas.height);
        resizeSelectionService.scaledImage = drawingServiceSpy.previewCtx.getImageData(
            0,
            0,
            drawingServiceSpy.previewCtx.canvas.width,
            drawingServiceSpy.previewCtx.canvas.height,
        );

        // tslint:disable-next-line: no-magic-numbers / reason: using random to test
        drawingServiceSpy.previewCtx.fillRect(0, 0, 10, 10);
        rotateSelectionService.rotatedImage.image = drawingServiceSpy.previewCtx.getImageData(
            0,
            0,
            drawingServiceSpy.previewCtx.canvas.width,
            drawingServiceSpy.previewCtx.canvas.height,
        );
        service.mouseDown = false;
        service.isAreaSelected = true;
        service['lastAction'] = SelectionAction.Rotate;
        service.onMouseDown(mouseEvent);
        expect(moveSelectionService.imgData).not.toEqual(resizeSelectionService.scaledImage);
        expect(moveSelectionService.imgData).toEqual(rotateSelectionService.rotatedImage.image);
    });

    it('onMouseMove should not call drawPreview if mouse was not already down', () => {
        service.mouseDown = false;
        service.isAreaSelected = true;
        service.onMouseMove(mouseEvent);
        expect(drawPreviewSpy).not.toHaveBeenCalled();
    });

    it('onMouseMove should call drawPreview if mouse was already down and an area is not selected', () => {
        service.mouseDown = true;
        service.isAreaSelected = false;
        service['moveSelectionPos'] = { x: 0, y: 0 };
        service.onMouseMove(mouseEvent);
        expect(drawPreviewSpy).toHaveBeenCalled();
    });

    it('onMouseMove should set moveSelectionPos if an area is selected and mouseDown were true', () => {
        const moveSelectionSpy = spyOn<any>(moveSelectionService, 'moveSelection').and.callThrough();
        service.mouseDown = true;
        service.isAreaSelected = true;
        service['moveSelectionPos'] = { x: 0, y: 0 };
        service.onMouseMove(mouseEvent);
        expect(service['moveSelectionPos']).toEqual({ x: mouseEvent.offsetX, y: mouseEvent.offsetY });
        expect(moveSelectionSpy).toHaveBeenCalled();
    });

    it('onMouseMove should call moveSelectionMagnetic if magnetism is active', () => {
        const moveSelectionMagneticSpy = spyOn<any>(moveSelectionService, 'moveSelectionMagnetic').and.callThrough();
        service.mouseDown = true;
        service.isAreaSelected = true;
        service['moveSelectionPos'] = { x: 0, y: 0 };
        service.activeMagnet = true;
        service.onMouseMove(mouseEvent);
        expect(service['moveSelectionPos']).toEqual({ x: mouseEvent.offsetX, y: mouseEvent.offsetY });
        expect(moveSelectionMagneticSpy).toHaveBeenCalled();
    });

    it('onMouseMove should not call drawPreview if current type is magic wand and an area is not selected ', () => {
        service.mouseDown = true;
        service.isAreaSelected = false;
        service.currentType = SelectionType.MagicWandSelection;
        service.onMouseMove(mouseEvent);
        expect(drawPreviewSpy).not.toHaveBeenCalled();
    });

    it('onMouseUp should set mouse down to false if mouse was down', () => {
        service.mouseDown = true;
        service.isAreaSelected = true;
        service.onMouseUp(mouseEvent);
        expect(service.mouseDown).toBeFalse();
    });

    it('onMouseUp should call copySelection and initializeRotation if mouse was down and an area is not selected and mouse was moved', () => {
        service.mouseDown = true;
        service.isAreaSelected = false;
        service.mouseDownCoord = { x: 0, y: 0 };
        service.onMouseMove(mouseEvent);
        service.onMouseUp(mouseEvent);
        expect(copySelectionSpy).toHaveBeenCalled();
        expect(rotateSelectionService.initializeRotation).toHaveBeenCalled();
    });

    it('onMouseUp should not call copySelection if mouse was down and an area is not selected and mouse was not moved', () => {
        service.mouseDown = true;
        service.isAreaSelected = false;
        service.mouseDownCoord = { x: 0, y: 0 };
        const event = {
            clientX: 0,
            clientY: 0,
            offsetX: 0,
            offsetY: 0,
            button: MouseButton.Left,
        } as MouseEvent;
        service.onMouseMove(event);
        service.onMouseUp(event);
        expect(copySelectionSpy).not.toHaveBeenCalled();
    });

    it('onMouseUp should not call copySelection if mouse was not down', () => {
        service.mouseDown = true;
        service.onMouseUp(mouseEvent);
        expect(copySelectionSpy).not.toHaveBeenCalled();
    });

    it('onMouseUp should not call copySelection if mouse was down and an area is selected', () => {
        service.mouseDown = false;
        service.isAreaSelected = true;
        service.mouseDownCoord = { x: 0, y: 0 };
        service.onMouseUp(mouseEvent);
        expect(copySelectionSpy).not.toHaveBeenCalled();
    });

    it('onClick should not call copyMagicSelection selection type is not magic wand', () => {
        service.isAreaSelected = false;
        service.currentType = SelectionType.RectangleSelection;
        service.onClick(mouseEvent);
        expect(magicWandService.copyMagicSelection).not.toHaveBeenCalled();
    });

    it('onClick should call copyMagicSelection if left mouse button was clicked and selection type is magic wand', () => {
        // tslint:disable-next-line: no-empty / reason: spying on fake function call
        spyOn<any>(service, 'initializeMagicWandSelectionProperties').and.callFake(() => {});
        service.isAreaSelected = false;
        service.currentType = SelectionType.MagicWandSelection;
        service.onClick(mouseEvent);
        expect(magicWandService.copyMagicSelection).toHaveBeenCalledWith(service.currentMousePosition, true);
        expect(service['initializeMagicWandSelectionProperties']).toHaveBeenCalled();
    });

    it('onContextMenu should call copyMagicSelection if right mouse button was clicked and selection type is magic wand', () => {
        // tslint:disable-next-line: no-empty / reason: spying on fake function call
        spyOn<any>(service, 'initializeMagicWandSelectionProperties').and.callFake(() => {});
        service.isAreaSelected = false;
        service.currentType = SelectionType.MagicWandSelection;
        service.onContextMenu(mouseEvent);
        expect(magicWandService.copyMagicSelection).toHaveBeenCalledWith(service.currentMousePosition, false);
        expect(service['initializeMagicWandSelectionProperties']).toHaveBeenCalled();
    });

    it('onContextMenu should not call copyMagicSelection selection type is not magic wand', () => {
        service.isAreaSelected = false;
        service.currentType = SelectionType.RectangleSelection;
        service.onContextMenu(mouseEvent);
        expect(magicWandService.copyMagicSelection).not.toHaveBeenCalled();
    });

    it('initializeMagicWandSelectionProperties should set properties for magic wand ', () => {
        const expectedValue = 10;
        drawingServiceSpy.previewCtx.canvas.width = expectedValue;
        drawingServiceSpy.previewCtx.canvas.height = expectedValue;

        // tslint:disable-next-line: no-empty / reason: spying on fake function call
        spyOn<any>(moveSelectionService, 'setFinalPosition').and.callFake(() => {});
        service.isAreaSelected = false;
        service['initializeMagicWandSelectionProperties']();
        expect(rotateSelectionService.initializeRotation).toHaveBeenCalled();
        expect(moveSelectionService.setFinalPosition).toHaveBeenCalled();
        expect(service['positiveStartingPos']).toEqual({ x: 0, y: 0 });
        expect(service['positiveWidth']).toEqual(expectedValue);
        expect(service['positiveHeight']).toEqual(expectedValue);
        expect(service.isAreaSelected).toBeTrue();
    });

    it('onMouseScroll should call scroll of rotate selection service when scroll mouse and an area is selected', () => {
        service.isAreaSelected = true;
        service.onMouseScroll({} as WheelEvent);
        expect(rotateSelectionService.scroll).toHaveBeenCalled();
    });

    it('onMouseScroll should not call scroll of rotate selection service when scroll mouse and an area is not selected', () => {
        service.isAreaSelected = false;
        service.onMouseScroll({} as WheelEvent);
        expect(rotateSelectionService.scroll).not.toHaveBeenCalled();
    });

    it('onMouseScroll should use scaled image if original image was scaled', () => {
        service.isAreaSelected = true;
        resizeSelectionService.scaleX = 2;
        resizeSelectionService.scaleY = 1;
        const wheelEvent = {} as WheelEvent;
        service.onMouseScroll(wheelEvent);
        expect(rotateSelectionService.scroll).toHaveBeenCalledWith(wheelEvent, resizeSelectionService.scaledImage, service['atlDown']);
    });

    it('onMouseScroll should use scaled image if original image was scaled', () => {
        service.isAreaSelected = true;
        resizeSelectionService.scaleX = 1;
        resizeSelectionService.scaleY = 1;
        const wheelEvent = {} as WheelEvent;
        service.onMouseScroll(wheelEvent);
        expect(rotateSelectionService.scroll).toHaveBeenCalledWith(wheelEvent, service['selectionImageData'], service['atlDown']);
    });

    it('resetSelection should be called if escape is pressed and mouse is down or an area is selected ', () => {
        service.isAreaSelected = true;
        service.mouseDown = false;
        const keyboardEvent = new KeyboardEvent('keyDown', { key: 'Escape' });
        service.onKeyDown(keyboardEvent);
        expect(drawSelectionSpy).toHaveBeenCalled();
    });

    it('resetSelection should not be called if escape is pressed and mouse is not down and an area is not selected ', () => {
        service.isAreaSelected = false;
        service.mouseDown = false;
        const keyboardEvent = new KeyboardEvent('keyDown', { key: 'Escape' });
        service.onKeyDown(keyboardEvent);
        expect(drawSelectionSpy).not.toHaveBeenCalled();
    });

    it('onKeyDown should not call resetSelection if mouse is down and escape is not pressed ', () => {
        service.mouseDown = true;
        const keyboardEvent = new KeyboardEvent('keyDown', { key: 'Shift' });
        service.onKeyDown(keyboardEvent);
        expect(drawSelectionSpy).not.toHaveBeenCalled();
    });

    it('onKeyDown should call checkArrowKeysPressed if an area is selected ', () => {
        const checkArrowKeysPressedSpy = spyOn<any>(moveSelectionService, 'checkArrowKeysPressed').and.callThrough();
        service.isAreaSelected = true;
        const event = {} as KeyboardEvent;
        service.onKeyDown(event);
        expect(checkArrowKeysPressedSpy).toHaveBeenCalled();
    });

    it('onKeyDown should call onkeydown of shapetool if an area is not selected ', () => {
        const keyDownSpy = spyOn(ShapeTool.prototype, 'onKeyDown');
        service.isAreaSelected = false;
        const event = {} as KeyboardEvent;
        service.onKeyDown(event);
        expect(keyDownSpy).toHaveBeenCalled();
    });

    it('onKeyDown should call drawSelectionBox if an arrow key is pressed and an area is selected ', () => {
        const drawSelectionBoxSpy = spyOn<any>(service, 'drawSelectionBox').and.callThrough();
        service.isAreaSelected = true;
        const event = new KeyboardEvent('keyDown', { key: 'ArrowLeft' });
        moveSelectionService.canMoveSelection = true;
        service.onKeyDown(event);
        expect(drawSelectionBoxSpy).toHaveBeenCalled();
    });

    it('onKeyDown should call deleteSelection if delete is pressed when an area is selected ', () => {
        const deleteSelectionSpy = spyOn(service, 'deleteSelection');
        service.isAreaSelected = true;
        const event = new KeyboardEvent('keyDown', { key: 'Delete' });
        service.onKeyDown(event);
        expect(deleteSelectionSpy).toHaveBeenCalled();
    });

    it('onKeyDown should call scaleImageKeepRatio if shift is pressed when an area is selected and resizing and use rotated image if orignal selection was rotated', () => {
        resizeSelectionService.isResizing.and.returnValue(true);

        rotateSelectionService.angle = 1;
        service.isAreaSelected = true;
        service['shiftDown'] = false;
        const event = new KeyboardEvent('keyDown', { key: 'Shift' });
        service.onKeyDown(event);
        expect(service['shiftDown']).toBeTrue();
        expect(resizeSelectionService.scaleImageKeepRatio).toHaveBeenCalledWith(rotateSelectionService.rotatedImage.image);
    });

    it('onKeyDown should call scaleImageKeepRatio if shift is pressed when an area is selected and resizing', () => {
        resizeSelectionService.isResizing.and.returnValue(true);

        rotateSelectionService.angle = 0;
        service.isAreaSelected = true;
        service['shiftDown'] = false;
        const event = new KeyboardEvent('keyDown', { key: 'Shift' });
        service.onKeyDown(event);
        expect(service['shiftDown']).toBeTrue();
        expect(resizeSelectionService.scaleImageKeepRatio).toHaveBeenCalledWith(service['selectionImageData']);
    });

    it('onKeyDown should not call scaleImageKeepRatio if not resizing and use rotated image if orignal selection was rotated', () => {
        resizeSelectionService.isResizing.and.returnValue(false);

        rotateSelectionService.angle = 0;
        service.isAreaSelected = true;
        service['shiftDown'] = false;
        const event = new KeyboardEvent('keyDown', { key: 'Shift' });
        service.onKeyDown(event);
        expect(service['shiftDown']).toBeFalse();
        expect(resizeSelectionService.scaleImageKeepRatio).not.toHaveBeenCalled();
    });

    it('onKeyDown should set altDown to true if alt is pressed when an area is selected ', () => {
        service.isAreaSelected = true;
        service['atlDown'] = false;
        const event = new KeyboardEvent('keyDown', { key: 'Alt' });
        service.onKeyDown(event);
        expect(service['atlDown']).toBeTrue();
    });

    it('onKeyUp should call checkArrowKeysReleased if an area is selected ', () => {
        const checkArrowKeysReleasedSpy = spyOn<any>(moveSelectionService, 'checkArrowKeysReleased').and.callThrough();
        service.isAreaSelected = true;
        const event = {} as KeyboardEvent;
        service.onKeyUp(event);
        expect(checkArrowKeysReleasedSpy).toHaveBeenCalled();
    });

    it('onKeyUp should call onkeydown of shapetool if an area is not selected ', () => {
        const keyUpSpy = spyOn(ShapeTool.prototype, 'onKeyUp');
        service.isAreaSelected = false;
        const event = {} as KeyboardEvent;
        service.onKeyUp(event);
        expect(keyUpSpy).toHaveBeenCalled();
    });

    it('onKeyUp should set altDown to false if alt is released when an area is selected ', () => {
        service.isAreaSelected = true;
        service['atlDown'] = true;
        const event = new KeyboardEvent('keyDown', { key: 'Alt' });
        service.onKeyUp(event);
        expect(service['atlDown']).toBeFalse();
    });

    it('onKeyUp should set shiftDown to false if shift is released when an area is selected and resizing', () => {
        resizeSelectionService.isResizing.and.returnValue(true);

        rotateSelectionService.angle = 0;
        service.isAreaSelected = true;
        service['shiftDown'] = true;
        const event = new KeyboardEvent('keyDown', { key: 'Shift' });
        service.onKeyUp(event);
        expect(service['shiftDown']).toBeFalse();
        expect(resizeSelectionService.scaleImage).toHaveBeenCalledWith(service['selectionImageData']);
    });

    it('onKeyUp should set shiftDown to false if shift is released when an area is selected and resizing and use rotated image if original selection was rotated', () => {
        resizeSelectionService.isResizing.and.returnValue(true);

        rotateSelectionService.angle = 1;
        service.isAreaSelected = true;
        service['shiftDown'] = true;
        const event = new KeyboardEvent('keyDown', { key: 'Shift' });
        service.onKeyUp(event);
        expect(service['shiftDown']).toBeFalse();
        expect(resizeSelectionService.scaleImage).toHaveBeenCalledWith(rotateSelectionService.rotatedImage.image);
    });

    it('onKeyUp should not set shiftDown to false if shift is released when not resizing', () => {
        resizeSelectionService.isResizing.and.returnValue(false);

        service.isAreaSelected = true;
        service['shiftDown'] = true;
        const event = new KeyboardEvent('keyDown', { key: 'Shift' });
        service.onKeyUp(event);
        expect(service['shiftDown']).toBeTrue();
        expect(resizeSelectionService.scaleImage).not.toHaveBeenCalled();
    });

    it('selectAll change selection type to rectangle and select whole canvas and should call copySelection', () => {
        service.currentType = SelectionType.EllipseSelection;
        // tslint:disable:no-string-literal / reason: accessing private member
        service.selectAll();

        expect(service.currentType).toEqual(SelectionType.RectangleSelection);
        expect(service['positiveStartingPos']).toEqual({ x: 0, y: 0 });
        expect(service['positiveWidth']).toEqual(drawingServiceSpy.canvas.width);
        expect(service['positiveHeight']).toEqual(drawingServiceSpy.canvas.height);
        expect(copySelectionSpy).toHaveBeenCalled();
    });

    it('drawSelection should call resetSelection if an area is selected', () => {
        const resetSelectionSpy = spyOn(service, 'resetSelection');
        service.isAreaSelected = true;
        service.drawSelection();
        expect(resetSelectionSpy).toHaveBeenCalled();
    });

    it('drawSelection should do nothing if an area is not selected', () => {
        const resetSelectionSpy = spyOn(service, 'resetSelection');
        service.isAreaSelected = false;
        service.drawSelection();
        expect(resetSelectionSpy).not.toHaveBeenCalled();
    });

    it('drawSelection should not change selectionImageData if delete was pressed', () => {
        service.isAreaSelected = true;
        service['deletePressed'] = true;
        service.drawSelection();
        expect(service['selectionImageData']).not.toEqual(rotateSelectionService.rotatedImage.image);
        expect(service['selectionImageData']).not.toEqual(resizeSelectionService.scaledImage);
    });

    it('drawSelection should use resized image if last action was resize', () => {
        // tslint:disable-next-line: no-empty / reason: spying on fake function call
        spyOn(service, 'resetSelection').and.callFake(() => {});
        service.isAreaSelected = true;
        service['deletePressed'] = false;
        service['lastAction'] = SelectionAction.Resize;
        service.drawSelection();
        expect(service['selectionImageData']).not.toEqual(rotateSelectionService.rotatedImage.image);
        expect(service['selectionImageData']).toEqual(resizeSelectionService.scaledImage);
    });

    it('drawSelection should use rotated image if last action was rotation', () => {
        // tslint:disable-next-line: no-empty / reason: spying on fake function call
        spyOn(service, 'resetSelection').and.callFake(() => {});
        service.isAreaSelected = true;
        service['deletePressed'] = false;
        service['lastAction'] = SelectionAction.Rotate;
        service.drawSelection();
        expect(service['selectionImageData']).toEqual(rotateSelectionService.rotatedImage.image);
        expect(service['selectionImageData']).not.toEqual(resizeSelectionService.scaledImage);
    });

    it('resetSelection should change preview canvas position and size back to normal if an area is selected', () => {
        service.isAreaSelected = true;
        // tslint:disable:no-magic-numbers / reason: using random values
        drawingServiceSpy.previewCtx.canvas.width = 20;
        drawingServiceSpy.previewCtx.canvas.height = 20;
        drawingServiceSpy.previewCtx.canvas.style.left = '20px';
        drawingServiceSpy.previewCtx.canvas.style.top = '20px';
        service.drawSelection();

        expect(drawingServiceSpy.previewCtx.canvas.width).toEqual(drawingServiceSpy.canvas.width);
        expect(drawingServiceSpy.previewCtx.canvas.height).toEqual(drawingServiceSpy.canvas.height);
        expect(drawingServiceSpy.previewCtx.canvas.style.left).toEqual('0px');
        expect(drawingServiceSpy.previewCtx.canvas.style.top).toEqual('0px');
        // tslint:enable:no-magic-numbers
    });

    it('resetSelection should not change preview canvas position and size back to normal if an area is not selected', () => {
        service.isAreaSelected = false;
        // tslint:disable:no-magic-numbers / reason: using random values
        drawingServiceSpy.previewCtx.canvas.width = 20;
        drawingServiceSpy.previewCtx.canvas.height = 20;
        drawingServiceSpy.previewCtx.canvas.style.left = '20px';
        drawingServiceSpy.previewCtx.canvas.style.top = '20px';
        service.drawSelection();

        expect(drawingServiceSpy.previewCtx.canvas.width).toEqual(20);
        expect(drawingServiceSpy.previewCtx.canvas.height).toEqual(20);
        expect(drawingServiceSpy.previewCtx.canvas.style.left).toEqual('20px');
        expect(drawingServiceSpy.previewCtx.canvas.style.top).toEqual('20px');
        // tslint:enable:no-magic-numbers
    });

    it('draw should call drawSelectionBox and drawEllipseSelection', () => {
        const drawSelectionBoxSpy = spyOn<any>(service, 'drawSelectionBox').and.callThrough();
        service.draw();
        expect(drawSelectionBoxSpy).toHaveBeenCalled();
    });

    it('drawSelectionBox should draw a rectangle and should not draw ellipse if selection is rectange', () => {
        const rectSpy = spyOn(drawingServiceSpy.previewCtx, 'rect').and.callThrough();
        const ellipseSpy = spyOn(drawingServiceSpy.previewCtx, 'ellipse').and.callThrough();
        service.currentType = SelectionType.RectangleSelection;
        // tslint:disable-next-line: no-magic-numbers / reason: using random to test
        service['drawSelectionBox']({ x: 0, y: 0 }, 10, 10);
        expect(rectSpy).toHaveBeenCalled();
        expect(ellipseSpy).not.toHaveBeenCalled();
    });

    it('drawSelectionBox should draw an ellipse if selection type is ellipse', () => {
        const rectSpy = spyOn(drawingServiceSpy.previewCtx, 'rect').and.callThrough();
        const ellipseSpy = spyOn(drawingServiceSpy.previewCtx, 'ellipse').and.callThrough();
        service.currentType = SelectionType.EllipseSelection;
        // tslint:disable-next-line: no-magic-numbers / reason: using random to test
        service['drawSelectionBox']({ x: 0, y: 0 }, 10, 10);
        expect(rectSpy).toHaveBeenCalled();
        expect(ellipseSpy).toHaveBeenCalled();
    });

    it('computePositiveRectangleValues should always give rectangle dimension in quadrant 1', () => {
        const initialCoord = { x: 50, y: 50 };
        service.mouseDownCoord = initialCoord;
        const size = 20;
        service.width = -size;
        service.height = size;
        service['computePositiveRectangleValues']();

        expect(service['positiveStartingPos']).toEqual({ x: initialCoord.x - size, y: initialCoord.y });
        expect(service['positiveWidth']).toEqual(size);
        expect(service['positiveHeight']).toEqual(size);
    });

    it('computePositiveRectangleValues should always give rectangle dimension in quadrant 1', () => {
        const initialCoord = { x: 50, y: 50 };
        service.mouseDownCoord = initialCoord;
        const size = 20;
        service.width = size;
        service.height = -size;
        service['computePositiveRectangleValues']();

        expect(service['positiveStartingPos']).toEqual({ x: initialCoord.x, y: initialCoord.y - size });
        expect(service['positiveWidth']).toEqual(size);
        expect(service['positiveHeight']).toEqual(size);
    });

    it('setColors should call setStrokeColor of drawingService', () => {
        service.setColors();
        expect(drawingServiceSpy.setStrokeColor).toHaveBeenCalledWith('black');
    });

    it('resetContext should not reset all the current changes that the tool made if selection is being resized', () => {
        resizeSelectionService.isResizing.and.returnValue(true);

        service.mouseDown = true;
        service.isAreaSelected = true;
        service['positiveStartingPos'] = { x: 1, y: 1 };
        service.resetContext();
        expect(service.mouseDown).toBeTrue();
        expect(service.isAreaSelected).toBeTrue();
        expect(service['positiveStartingPos']).toEqual({ x: 1, y: 1 });
        expect(drawingServiceSpy.clearCanvas).not.toHaveBeenCalled();
    });

    it('resetContext should reset all the current changes that the tool made', () => {
        service.mouseDown = true;
        service.isAreaSelected = true;
        service['positiveStartingPos'] = { x: 1, y: 1 };
        service.resetContext();
        expect(service.mouseDown).toBeFalse();
        expect(service.isAreaSelected).toBeFalse();
        expect(service['positiveStartingPos']).toEqual({ x: 0, y: 0 });
        expect(drawingServiceSpy.clearCanvas).toHaveBeenCalledWith(drawingServiceSpy.previewCtx);
    });

    it('copySelection should not save to clipboard if an area is not selected', () => {
        service.isAreaSelected = false;
        const clipboardImageSize = 10;
        service['clipboardImage'] = {
            image: drawingServiceSpy.previewCtx.getImageData(0, 0, clipboardImageSize, clipboardImageSize),
            selectionType: SelectionType.EllipseSelection,
        };
        service.currentType = SelectionType.RectangleSelection;

        service.copySelection();
        expect(service['clipboardImage'].image.width).toEqual(clipboardImageSize);
        expect(service['clipboardImage'].image.height).toEqual(clipboardImageSize);
        expect(service['clipboardImage'].selectionType).toEqual(SelectionType.EllipseSelection);
        expect(service['clipboardImage'].image.data).not.toEqual(service['selectionImageData'].data);
    });

    it('copySelection should save current selection to clipboard', () => {
        const selectionSize = 10;
        service.isAreaSelected = true;
        drawingServiceSpy.previewCtx.fillRect(0, 0, drawingServiceSpy.previewCtx.canvas.width, drawingServiceSpy.previewCtx.canvas.height);
        service['selectionImageData'] = drawingServiceSpy.previewCtx.getImageData(0, 0, selectionSize, selectionSize);
        service['currentType'] = SelectionType.EllipseSelection;
        service['lastAction'] = SelectionAction.None;

        service.copySelection();
        expect(service['clipboardImage'].image.width).toEqual(selectionSize);
        expect(service['clipboardImage'].image.height).toEqual(selectionSize);
        expect(service['clipboardImage'].selectionType).toEqual(SelectionType.EllipseSelection);
        expect(service['clipboardImage'].image.data).toEqual(service['selectionImageData'].data);
    });

    it('copySelection should save current selection to clipboard', () => {
        let selectionSize = 10;
        service.isAreaSelected = true;
        drawingServiceSpy.previewCtx.fillRect(0, 0, drawingServiceSpy.previewCtx.canvas.width, drawingServiceSpy.previewCtx.canvas.height);
        service['selectionImageData'] = drawingServiceSpy.previewCtx.getImageData(0, 0, selectionSize, selectionSize);

        // tslint:disable-next-line: no-magic-numbers / reason: using random numbers to check that correct image was copied
        selectionSize = 20;
        resizeSelectionService.scaledImage = drawingServiceSpy.previewCtx.getImageData(0, 0, selectionSize, selectionSize);

        service['currentType'] = SelectionType.EllipseSelection;
        service['lastAction'] = SelectionAction.Resize;

        service.copySelection();
        expect(service['clipboardImage'].image.width).toEqual(selectionSize);
        expect(service['clipboardImage'].image.height).toEqual(selectionSize);
        expect(service['clipboardImage'].selectionType).toEqual(SelectionType.EllipseSelection);
        expect(service['clipboardImage'].image.data).not.toEqual(service['selectionImageData'].data);
        expect(service['clipboardImage'].image.data).toEqual(resizeSelectionService.scaledImage.data);
    });

    it('copySelection should save current selection to clipboard', () => {
        let selectionSize = 10;
        service.isAreaSelected = true;
        drawingServiceSpy.previewCtx.fillRect(0, 0, drawingServiceSpy.previewCtx.canvas.width, drawingServiceSpy.previewCtx.canvas.height);
        service['selectionImageData'] = drawingServiceSpy.previewCtx.getImageData(0, 0, selectionSize, selectionSize);

        // tslint:disable-next-line: no-magic-numbers / reason: using random numbers to check that correct image was copied
        selectionSize = 20;
        rotateSelectionService.rotatedImage.image = drawingServiceSpy.previewCtx.getImageData(0, 0, selectionSize, selectionSize);

        service['currentType'] = SelectionType.EllipseSelection;
        service['lastAction'] = SelectionAction.Rotate;

        service.copySelection();
        expect(service['clipboardImage'].image.width).toEqual(selectionSize);
        expect(service['clipboardImage'].image.height).toEqual(selectionSize);
        expect(service['clipboardImage'].selectionType).toEqual(SelectionType.EllipseSelection);
        expect(service['clipboardImage'].image.data).not.toEqual(service['selectionImageData'].data);
        expect(service['clipboardImage'].image.data).toEqual(rotateSelectionService.rotatedImage.image.data);
    });

    it('pasteSelection should place clipboard image', () => {
        moveSelectionService.finalPosition = { x: 1, y: 1 };
        const clipboardImageSize = 10;
        service['clipboardImage'] = {
            image: drawingServiceSpy.previewCtx.getImageData(0, 0, clipboardImageSize, clipboardImageSize),
            selectionType: SelectionType.EllipseSelection,
        };
        service.currentType = SelectionType.RectangleSelection;

        service.pasteSelection();
        expect(moveSelectionService.finalPosition).toEqual({ x: 0, y: 0 });
        expect(service.currentType).toEqual(SelectionType.EllipseSelection);
        expect(service['positiveWidth']).toEqual(clipboardImageSize);
        expect(service['positiveHeight']).toEqual(clipboardImageSize);
        expect(service['selectionImageData'].data).toEqual(service['clipboardImage'].image.data);
        expect(rotateSelectionService.initializeRotation).toHaveBeenCalled();
    });

    it('pasteSelection should not place clipboard image if no clipboard image is available', () => {
        moveSelectionService.finalPosition = { x: 1, y: 1 };
        service.currentType = SelectionType.RectangleSelection;
        const previousSelectionSize = 10;
        service['positiveWidth'] = previousSelectionSize;
        service['positiveHeight'] = previousSelectionSize;

        service.pasteSelection();
        expect(moveSelectionService.finalPosition).toEqual({ x: 1, y: 1 });
        expect(service.currentType).toEqual(SelectionType.RectangleSelection);
        expect(service['positiveWidth']).toEqual(previousSelectionSize);
        expect(service['positiveHeight']).toEqual(previousSelectionSize);
        expect(rotateSelectionService.initializeRotation).not.toHaveBeenCalled();
    });

    it('cutSelection should call copy and delete selection', () => {
        spyOn(service, 'copySelection');
        spyOn(service, 'deleteSelection');
        service.cutSelection();
        expect(service.copySelection).toHaveBeenCalled();
        expect(service.deleteSelection).toHaveBeenCalled();
    });

    it('deleteSelection should call resetSelection and erase all selected pixel', () => {
        spyOn(service, 'resetSelection');
        drawingServiceSpy.previewCtx.fillRect(0, 0, drawingServiceSpy.previewCtx.canvas.width, drawingServiceSpy.previewCtx.canvas.height);
        service['selectionImageData'] = drawingServiceSpy.previewCtx.getImageData(
            0,
            0,
            drawingServiceSpy.previewCtx.canvas.width,
            drawingServiceSpy.previewCtx.canvas.height,
        );
        service.deleteSelection();
        expect(service.resetSelection).toHaveBeenCalled();
        // checking random pixel
        expect(service['selectionImageData'].data[0]).toEqual(0);
        expect(service['selectionImageData'].data[1]).toEqual(0);
        expect(service['selectionImageData'].data[2]).toEqual(0);
        expect(service['selectionImageData'].data[IMAGE_DATA_OPACITY_INDEX]).toEqual(0);
    });

    it('resize should call scaleImage if shift is not down', () => {
        resizeSelectionService.onResize.and.returnValue({ x: 0, y: 0 });
        resizeSelectionService.isResizing.and.returnValue(true);

        service.resize({} as MouseEvent);
        expect(resizeSelectionService.scaleImage).toHaveBeenCalled();
    });

    it('resize should call scaleImageKeepRatio if shift is down', () => {
        resizeSelectionService.onResize.and.returnValue({ x: 0, y: 0 });
        resizeSelectionService.isResizing.and.returnValue(true);

        service.shiftDown = true;
        service.resize({} as MouseEvent);
        expect(resizeSelectionService.scaleImageKeepRatio).toHaveBeenCalled();
    });

    it('resize should not scale selection if not resizing', () => {
        resizeSelectionService.isResizing.and.returnValue(false);
        service.resize({} as MouseEvent);
        expect(resizeSelectionService.scaleImageKeepRatio).not.toHaveBeenCalled();
        expect(resizeSelectionService.scaleImage).not.toHaveBeenCalled();
    });

    it('resize should not scale selection if not resizing', () => {
        resizeSelectionService.onResize.and.returnValue({ x: 0, y: 0 });
        resizeSelectionService.isResizing.and.returnValue(true);

        rotateSelectionService.angle = 0;
        service['shiftDown'] = false;
        service.resize({} as MouseEvent);
        expect(resizeSelectionService.scaleImage).toHaveBeenCalledWith(service['selectionImageData']);
    });

    it('isClipboardEmpty should return true if clipboard is empty', () => {
        expect(service.isClipboardEmpty()).toBeTrue();
    });

    it('isClipboardEmpty should return false if clipboard is not empty', () => {
        service['clipboardImage'] = { image: drawingServiceSpy.previewCtx.getImageData(0, 0, 1, 1), selectionType: SelectionType.RectangleSelection };
        expect(service.isClipboardEmpty()).toBeFalse();
    });

    it('clone should copy tool and original selection image if it was not resized or rotated', () => {
        const selectionSize = 10;
        drawingServiceSpy.previewCtx.fillRect(0, 0, drawingServiceSpy.previewCtx.canvas.width, drawingServiceSpy.previewCtx.canvas.height);
        service['selectionImageData'] = drawingServiceSpy.previewCtx.getImageData(0, 0, selectionSize, selectionSize);
        service['lastAction'] = SelectionAction.None;

        const clonedTool = service.clone();
        expect(clonedTool['positiveStartingPos']).toEqual(service['positiveStartingPos']);
        expect(clonedTool['positiveWidth']).toEqual(service['positiveWidth']);
        expect(clonedTool['positiveHeight']).toEqual(service['positiveHeight']);
        expect(clonedTool['currentType']).toEqual(service['currentType']);
        expect(clonedTool['moveSelectionService'].finalPosition).toEqual(moveSelectionService.finalPosition);
        expect(clonedTool['selectionImageData']).toEqual(service['selectionImageData']);
    });

    it('clone should copy tool and rotated image if original selection was rotated', () => {
        let selectionSize = 10;
        drawingServiceSpy.previewCtx.fillRect(0, 0, drawingServiceSpy.previewCtx.canvas.width, drawingServiceSpy.previewCtx.canvas.height);
        service['selectionImageData'] = drawingServiceSpy.previewCtx.getImageData(0, 0, selectionSize, selectionSize);
        // tslint:disable-next-line: no-magic-numbers / reason: using random numbers to check that correct image was copied
        selectionSize = 20;
        rotateSelectionService.rotatedImage.image = drawingServiceSpy.previewCtx.getImageData(0, 0, selectionSize, selectionSize);
        service['lastAction'] = SelectionAction.Rotate;

        const clonedTool = service.clone();
        expect(clonedTool['positiveStartingPos']).toEqual(service['positiveStartingPos']);
        expect(clonedTool['positiveWidth']).toEqual(service['positiveWidth']);
        expect(clonedTool['positiveHeight']).toEqual(service['positiveHeight']);
        expect(clonedTool['currentType']).toEqual(service['currentType']);
        expect(clonedTool['moveSelectionService'].finalPosition).toEqual(moveSelectionService.finalPosition);
        expect(clonedTool['selectionImageData']).not.toEqual(service['selectionImageData']);
        expect(clonedTool['selectionImageData']).toEqual(rotateSelectionService.rotatedImage.image);
    });

    it('clone should copy tool and rotated image if original selection was rotated', () => {
        let selectionSize = 10;
        drawingServiceSpy.previewCtx.fillRect(0, 0, drawingServiceSpy.previewCtx.canvas.width, drawingServiceSpy.previewCtx.canvas.height);
        service['selectionImageData'] = drawingServiceSpy.previewCtx.getImageData(0, 0, selectionSize, selectionSize);
        // tslint:disable-next-line: no-magic-numbers / reason: using random numbers to check that correct image was copied
        selectionSize = 20;
        resizeSelectionService.scaledImage = drawingServiceSpy.previewCtx.getImageData(0, 0, selectionSize, selectionSize);
        service['lastAction'] = SelectionAction.Resize;

        const clonedTool = service.clone();
        expect(clonedTool['positiveStartingPos']).toEqual(service['positiveStartingPos']);
        expect(clonedTool['positiveWidth']).toEqual(service['positiveWidth']);
        expect(clonedTool['positiveHeight']).toEqual(service['positiveHeight']);
        expect(clonedTool['currentType']).toEqual(service['currentType']);
        expect(clonedTool['moveSelectionService'].finalPosition).toEqual(moveSelectionService.finalPosition);
        expect(clonedTool['selectionImageData']).not.toEqual(service['selectionImageData']);
        expect(clonedTool['selectionImageData']).toEqual(resizeSelectionService.scaledImage);
    });

    it('execute should call copySelection and resetSelection', () => {
        const resetSelectionSpy = spyOn(service, 'resetSelection');
        service['positiveStartingPos'] = { x: 0, y: 0 };
        const selectionSize = 10;
        service['positiveHeight'] = selectionSize;
        service['positiveWidth'] = selectionSize;
        service.execute();
        expect(copySelectionSpy).toHaveBeenCalled();
        expect(resetSelectionSpy).toHaveBeenCalled();
    });

    it('magneticMoveKeyboard should call magneticMove', () => {
        service.magnetismService.firstmove = true;
        const magneticMoveSpy = spyOn(service, 'magneticMove');
        service.magneticMoveKeyboard('ArrowLeft');
        expect(magneticMoveSpy).toHaveBeenCalled();
    });

    it('magneticMoveKeyboard should call magneticMove', () => {
        service.magnetismService.firstmove = false;
        const moveSpy = spyOn(service['moveSelectionService'], 'moveSelectionMagnetic');
        service.magneticMoveKeyboard('ArrowLeft');
        expect(moveSpy).toHaveBeenCalled();
    });

    it('onKeyDown with magnetism should call magneticMoveKeyboard', () => {
        service.activeMagnet = true;
        service.isAreaSelected = true;
        const magneticMoveKeyboardSpy = spyOn(service, 'magneticMoveKeyboard');
        const event = {} as KeyboardEvent;
        service.onKeyDown(event);
        expect(magneticMoveKeyboardSpy).toHaveBeenCalled();
    });

    // tslint:disable-next-line: max-file-line-count / reason: its a test file
});
