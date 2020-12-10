import { Renderer2, RendererFactory2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { IMAGE_DATA_OPACITY_INDEX, MAX_COLOR_VALUE } from '@app/constants/constants';
import { ControlPoint } from '@app/enums/control-point.enum';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ResizeService } from '@app/services/resize/resize.service';
import { ResizeSelectionService } from './resize-selection.service';

// tslint:disable:max-file-line-count

describe('ResizeSelectionService', () => {
    let service: ResizeSelectionService;
    let drawingServiceSpy: jasmine.SpyObj<DrawingService>;
    let resizeServiceSpy: jasmine.SpyObj<ResizeService>;
    let rendererFactorySpy: jasmine.SpyObj<RendererFactory2>;
    let renderer2Mock: jasmine.SpyObj<Renderer2>;
    let canvasWrapper: HTMLDivElement;

    beforeEach(() => {
        drawingServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas', 'setThickness', 'setStrokeColor']);

        resizeServiceSpy = jasmine.createSpyObj('ResizeService', ['resize']);

        rendererFactorySpy = jasmine.createSpyObj('RendererFactory2', ['createRenderer']);

        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawingServiceSpy },
                { provide: ResizeService, useValue: resizeServiceSpy },
                { provide: RendererFactory2, useValue: rendererFactorySpy },
            ],
        });

        rendererFactorySpy = TestBed.inject(RendererFactory2) as jasmine.SpyObj<RendererFactory2>;
        renderer2Mock = jasmine.createSpyObj('Renderer2', ['createElement']);
        renderer2Mock.createElement.and.returnValue(document.createElement('canvas'));
        rendererFactorySpy.createRenderer.and.returnValue(renderer2Mock);
        service = TestBed.inject(ResizeSelectionService);
        drawingServiceSpy = TestBed.inject(DrawingService) as jasmine.SpyObj<DrawingService>;
        const canvas = document.createElement('canvas');
        canvas.width = canvasTestHelper.canvas.width;
        canvas.height = canvasTestHelper.canvas.height;
        canvasWrapper = document.createElement('div');
        canvasWrapper.appendChild(canvas);

        // tslint:disable: no-string-literal / reason: accessing private member
        service['drawingService'].canvas = canvas;
        service['drawingService'].baseCtx = canvas.getContext('2d') as CanvasRenderingContext2D;
        service['drawingService'].previewCtx = canvas.getContext('2d') as CanvasRenderingContext2D;
        resizeServiceSpy = TestBed.inject(ResizeService) as jasmine.SpyObj<ResizeService>;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('onResize should change starting point, call onResize width and height and call onChangeStartingPoint', () => {
        const mouseEvent = { clientX: 10, clientY: 10 } as MouseEvent;
        // tslint:disable-next-line: no-any reason: private method
        spyOn<any>(service, 'onResizeWidth');
        // tslint:disable-next-line: no-any reason: private method
        spyOn<any>(service, 'onResizeHeight');
        // tslint:disable-next-line: no-any reason: private method
        spyOn<any>(service, 'onChangeStartingPoint');
        expect(service.onResize(mouseEvent, { x: 0, y: 0 })).toEqual(service['startingPoint']);
        expect(service['onResizeWidth']).toHaveBeenCalledWith(mouseEvent);
        expect(service['onResizeHeight']).toHaveBeenCalledWith(mouseEvent);
        expect(service['onChangeStartingPoint']).toHaveBeenCalledWith(mouseEvent);
    });

    it('onResizeWidth should not do anything if controlPoint is BottomCenter or TopCenter', () => {
        const mouseEvent = { clientX: 10, clientY: 10 } as MouseEvent;
        resizeServiceSpy.controlPoint = ControlPoint.BottomCenter;
        spyOn(drawingServiceSpy.canvas, 'getBoundingClientRect').and.returnValue({ x: 2, y: 2 } as DOMRect);
        // tslint:disable-next-line: no-any reason: private method
        spyOn<any>(service, 'changeOppositeControlPoint');
        const oldWidth = drawingServiceSpy.previewCtx.canvas.width;
        service['onResizeWidth'](mouseEvent);
        expect(drawingServiceSpy.previewCtx.canvas.width).toEqual(oldWidth);
        expect(drawingServiceSpy.canvas.getBoundingClientRect).not.toHaveBeenCalled();
        expect(service['changeOppositeControlPoint']).not.toHaveBeenCalled();

        resizeServiceSpy.controlPoint = ControlPoint.TopCenter;
        service['onResizeWidth'](mouseEvent);
        expect(drawingServiceSpy.previewCtx.canvas.width).toEqual(oldWidth);
        expect(drawingServiceSpy.canvas.getBoundingClientRect).not.toHaveBeenCalled();
        expect(service['changeOppositeControlPoint']).not.toHaveBeenCalled();
    });

    it('onResizeWidth calculate the correct width if control is not height only and is not left side', () => {
        const mouseEvent = { clientX: 10, clientY: 10 } as MouseEvent;
        resizeServiceSpy.controlPoint = ControlPoint.BottomRight;
        service['startingPoint'] = { x: 0, y: 0 };
        spyOn(drawingServiceSpy.canvas, 'getBoundingClientRect').and.returnValue({ x: 2, y: 2 } as DOMRect);
        // tslint:disable-next-line: no-any reason: private method
        spyOn<any>(service, 'changeOppositeControlPoint');
        const newWidth = mouseEvent.clientX - 2;
        service['onResizeWidth'](mouseEvent);
        expect(drawingServiceSpy.previewCtx.canvas.width).toEqual(newWidth);
        expect(drawingServiceSpy.canvas.getBoundingClientRect).toHaveBeenCalled();
        expect(service['changeOppositeControlPoint']).not.toHaveBeenCalled();
    });

    it('onResizeWidth calculate the correct width if control is not height only and not left side and newWidth is negative', () => {
        const mouseEvent = { clientX: 10, clientY: 10 } as MouseEvent;
        resizeServiceSpy.controlPoint = ControlPoint.BottomRight;
        service.isMirrorWidth = false;
        service['startingPoint'] = { x: 10, y: 0 };
        spyOn(drawingServiceSpy.canvas, 'getBoundingClientRect').and.returnValue({ x: 2, y: 2 } as DOMRect);
        // tslint:disable-next-line: no-any reason: private method
        spyOn<any>(service, 'changeOppositeControlPoint');
        service['onResizeWidth'](mouseEvent);
        expect(drawingServiceSpy.previewCtx.canvas.width).toEqual(1);
        expect(drawingServiceSpy.canvas.getBoundingClientRect).toHaveBeenCalled();
        expect(service['changeOppositeControlPoint']).toHaveBeenCalledWith(true);
        expect(service.isMirrorWidth).toBeTrue();
    });

    it('onResizeWidth calculate the correct width if control is not height only and on left side and newWidth is positive', () => {
        const mouseEvent = { clientX: 10, clientY: 10 } as MouseEvent;
        resizeServiceSpy.controlPoint = ControlPoint.TopLeft;
        service.isMirrorWidth = false;
        service['startingPoint'] = { x: 10, y: 0 };
        drawingServiceSpy.previewCtx.canvas.width = service['startingPoint'].x;
        spyOn(drawingServiceSpy.canvas, 'getBoundingClientRect').and.returnValue({ x: 2, y: 2 } as DOMRect);
        // tslint:disable-next-line: no-any reason: private method
        spyOn<any>(service, 'changeOppositeControlPoint');
        const newWidth = drawingServiceSpy.previewCtx.canvas.width + drawingServiceSpy.previewCtx.canvas.getBoundingClientRect().x;
        service['onResizeWidth'](mouseEvent);
        expect(drawingServiceSpy.previewCtx.canvas.width).toEqual(newWidth);
        expect(drawingServiceSpy.canvas.getBoundingClientRect).toHaveBeenCalled();
    });

    it('onResizeHeight should not do anything if controlPoint is CenterLeft or CenterRight', () => {
        const mouseEvent = { clientX: 10, clientY: 10 } as MouseEvent;
        resizeServiceSpy.controlPoint = ControlPoint.CenterLeft;
        spyOn(drawingServiceSpy.canvas, 'getBoundingClientRect').and.returnValue({ x: 2, y: 2 } as DOMRect);
        // tslint:disable-next-line: no-any reason: private method
        spyOn<any>(service, 'changeOppositeControlPoint');
        const oldHeight = drawingServiceSpy.previewCtx.canvas.height;
        service['onResizeHeight'](mouseEvent);
        expect(drawingServiceSpy.previewCtx.canvas.height).toEqual(oldHeight);
        expect(drawingServiceSpy.canvas.getBoundingClientRect).not.toHaveBeenCalled();
        expect(service['changeOppositeControlPoint']).not.toHaveBeenCalled();

        resizeServiceSpy.controlPoint = ControlPoint.CenterRight;
        service['onResizeHeight'](mouseEvent);
        expect(drawingServiceSpy.previewCtx.canvas.height).toEqual(oldHeight);
        expect(drawingServiceSpy.canvas.getBoundingClientRect).not.toHaveBeenCalled();
        expect(service['changeOppositeControlPoint']).not.toHaveBeenCalled();
    });

    it('onResizeHeight calculate the correct height if control is not width only and not top side', () => {
        const mouseEvent = { clientX: 10, clientY: 10 } as MouseEvent;
        resizeServiceSpy.controlPoint = ControlPoint.BottomRight;
        service['startingPoint'] = { x: 0, y: 0 };
        spyOn(drawingServiceSpy.canvas, 'getBoundingClientRect').and.returnValue({ x: 2, y: 2 } as DOMRect);
        // tslint:disable-next-line: no-any reason: private method
        spyOn<any>(service, 'changeOppositeControlPoint');
        const newHeight = mouseEvent.clientY - 2;
        service['onResizeHeight'](mouseEvent);
        expect(drawingServiceSpy.previewCtx.canvas.height).toEqual(newHeight);
        expect(drawingServiceSpy.canvas.getBoundingClientRect).toHaveBeenCalled();
        expect(service['changeOppositeControlPoint']).not.toHaveBeenCalled();
    });

    it('onResizeHeight calculate the correct height if control is not width only and not top side and newHeight is negative', () => {
        const mouseEvent = { clientX: 10, clientY: 10 } as MouseEvent;
        resizeServiceSpy.controlPoint = ControlPoint.BottomRight;
        service.isMirrorHeight = false;
        service['startingPoint'] = { x: 10, y: 10 };
        spyOn(drawingServiceSpy.canvas, 'getBoundingClientRect').and.returnValue({ x: 2, y: 2 } as DOMRect);
        // tslint:disable-next-line: no-any reason: private method
        spyOn<any>(service, 'changeOppositeControlPoint');
        service['onResizeHeight'](mouseEvent);
        expect(drawingServiceSpy.previewCtx.canvas.height).toEqual(1);
        expect(drawingServiceSpy.canvas.getBoundingClientRect).toHaveBeenCalled();
        expect(service['changeOppositeControlPoint']).toHaveBeenCalledWith(false);
        expect(service.isMirrorHeight).toBeTrue();
    });

    it('onResizeHeight calculate the correct height if control is not width only and on top side and newHeight is positive', () => {
        const mouseEvent = { clientX: 10, clientY: 10 } as MouseEvent;
        resizeServiceSpy.controlPoint = ControlPoint.TopLeft;
        service.isMirrorHeight = false;
        service['startingPoint'] = { x: 10, y: 10 };
        drawingServiceSpy.previewCtx.canvas.height = service['startingPoint'].y;
        spyOn(drawingServiceSpy.canvas, 'getBoundingClientRect').and.returnValue({ x: 2, y: 2 } as DOMRect);
        // tslint:disable-next-line: no-any reason: private method
        spyOn<any>(service, 'changeOppositeControlPoint');
        const newHeight = drawingServiceSpy.previewCtx.canvas.height + drawingServiceSpy.previewCtx.canvas.getBoundingClientRect().y;
        service['onResizeHeight'](mouseEvent);
        expect(drawingServiceSpy.previewCtx.canvas.height).toEqual(newHeight);
        expect(drawingServiceSpy.canvas.getBoundingClientRect).toHaveBeenCalled();
    });

    it('onChangeStartingPoint should call onChangeStarting X and Y', () => {
        const mouseEvent = { clientX: 10, clientY: 10 } as MouseEvent;
        // tslint:disable-next-line: no-any reason: private method
        spyOn<any>(service, 'onChangeStartingX');
        // tslint:disable-next-line: no-any reason: private method
        spyOn<any>(service, 'onChangeStartingY');
        service['onChangeStartingPoint'](mouseEvent);
        expect(service['onChangeStartingX']).toHaveBeenCalledWith(mouseEvent);
        expect(service['onChangeStartingY']).toHaveBeenCalledWith(mouseEvent);
    });

    it('onChangeStartingX should change startingPoint x and apply it to canvas if its a controlLeft', () => {
        const mouseEvent = { clientX: 10, clientY: 10 } as MouseEvent;
        resizeServiceSpy.controlPoint = ControlPoint.TopLeft;
        service['startingPoint'] = { x: 0, y: 0 };
        spyOn(drawingServiceSpy.canvas, 'getBoundingClientRect').and.returnValue({ x: 2, y: 2 } as DOMRect);
        const newStartingX = mouseEvent.clientX - 2;
        service['onChangeStartingX'](mouseEvent);
        expect(service['startingPoint'].x).toEqual(newStartingX);
        expect(drawingServiceSpy.canvas.style.left).toEqual(newStartingX + 'px');
    });

    it('onChangeStartingX should do nothing if its not a controlLeft', () => {
        const mouseEvent = { clientX: 10, clientY: 10 } as MouseEvent;
        resizeServiceSpy.controlPoint = ControlPoint.BottomRight;
        service['startingPoint'] = { x: 0, y: 0 };
        drawingServiceSpy.previewCtx.canvas.style.left = 0 + 'px';
        spyOn(drawingServiceSpy.canvas, 'getBoundingClientRect').and.returnValue({ x: 2, y: 2 } as DOMRect);
        const oldStartingX = { x: 0, y: 0 };
        service['onChangeStartingX'](mouseEvent);
        expect(drawingServiceSpy.canvas.style.left).toEqual(oldStartingX.x + 'px');
    });

    it('onChangeStartingY should change startingPoint y and apply it to canvas if its a controlTop', () => {
        const mouseEvent = { clientX: 10, clientY: 10 } as MouseEvent;
        resizeServiceSpy.controlPoint = ControlPoint.TopCenter;
        service['startingPoint'] = { x: 0, y: 0 };
        spyOn(drawingServiceSpy.canvas, 'getBoundingClientRect').and.returnValue({ x: 2, y: 2 } as DOMRect);
        const newStartingY = mouseEvent.clientY - 2;
        service['onChangeStartingY'](mouseEvent);
        expect(service['startingPoint'].y).toEqual(newStartingY);
        expect(drawingServiceSpy.canvas.style.top).toEqual(newStartingY + 'px');
    });

    it('onChangeStartingY should do nothing if its not a controlTop', () => {
        const mouseEvent = { clientX: 10, clientY: 10 } as MouseEvent;
        resizeServiceSpy.controlPoint = ControlPoint.BottomRight;
        service['startingPoint'] = { x: 0, y: 0 };
        drawingServiceSpy.previewCtx.canvas.style.top = 0 + 'px';
        spyOn(drawingServiceSpy.canvas, 'getBoundingClientRect').and.returnValue({ x: 2, y: 2 } as DOMRect);
        const oldStartingY = { x: 0, y: 0 };
        service['onChangeStartingY'](mouseEvent);
        expect(drawingServiceSpy.canvas.style.top).toEqual(oldStartingY.x + 'px');
    });

    it('scaleImage should calculate the scale of the image based on the selection size and return applyScaleToImage', () => {
        service.isMirrorWidth = false;
        service.isMirrorHeight = false;
        const imageDataWidth = 10;
        const imageDataHeight = 10;
        const imageData = new ImageData(imageDataWidth, imageDataHeight);
        const scaleX = 1.5;
        const scaleY = 2;
        drawingServiceSpy.previewCtx.canvas.width = imageDataWidth * scaleX;
        drawingServiceSpy.previewCtx.canvas.height = imageDataWidth * scaleY;
        spyOn(service, 'applyScaleToImage').and.callFake(() => {
            return imageData;
        });
        service.scaleImage(imageData);
        expect(service.scaleX).toEqual(scaleX);
        expect(service.scaleY).toEqual(scaleY);
        expect(service.applyScaleToImage).toHaveBeenCalled();
    });

    it('scaleImage should calculate the scale of the image based on the selection size and return applyScaleToImage and isMirrorWidth true', () => {
        service.isMirrorWidth = true;
        service.isMirrorHeight = false;
        const imageDataWidth = 10;
        const imageDataHeight = 10;
        const imageData = new ImageData(imageDataWidth, imageDataHeight);
        const scaleX = 1.5;
        const scaleY = 2;
        drawingServiceSpy.previewCtx.canvas.width = imageDataWidth * scaleX;
        drawingServiceSpy.previewCtx.canvas.height = imageDataWidth * scaleY;
        spyOn(service, 'applyScaleToImage').and.callFake(() => {
            return imageData;
        });
        service.scaleImage(imageData);
        expect(service.scaleX).toEqual(-scaleX);
        expect(service.scaleY).toEqual(scaleY);
        expect(service.applyScaleToImage).toHaveBeenCalled();
    });

    it('scaleImage should calculate the scale of the image based on the selection size and return applyScaleToImage and isMirrorHeight true', () => {
        service.isMirrorWidth = false;
        service.isMirrorHeight = true;
        const imageDataWidth = 10;
        const imageDataHeight = 10;
        const imageData = new ImageData(imageDataWidth, imageDataHeight);
        const scaleX = 1.5;
        const scaleY = 2;
        drawingServiceSpy.previewCtx.canvas.width = imageDataWidth * scaleX;
        drawingServiceSpy.previewCtx.canvas.height = imageDataWidth * scaleY;
        spyOn(service, 'applyScaleToImage').and.callFake(() => {
            return imageData;
        });
        service.scaleImage(imageData);
        expect(service.scaleX).toEqual(scaleX);
        expect(service.scaleY).toEqual(-scaleY);
        expect(service.applyScaleToImage).toHaveBeenCalled();
    });

    it('scaleImage should calculate the scale of the image based on the selection size and return applyScaleToImage and both isMirror true', () => {
        service.isMirrorWidth = true;
        service.isMirrorHeight = true;
        const imageDataWidth = 10;
        const imageDataHeight = 10;
        const imageData = new ImageData(imageDataWidth, imageDataHeight);
        const scaleX = 1.5;
        const scaleY = 2;
        drawingServiceSpy.previewCtx.canvas.width = imageDataWidth * scaleX;
        drawingServiceSpy.previewCtx.canvas.height = imageDataWidth * scaleY;
        spyOn(service, 'applyScaleToImage').and.callFake(() => {
            return imageData;
        });
        service.scaleImage(imageData);
        expect(service.scaleX).toEqual(-scaleX);
        expect(service.scaleY).toEqual(-scaleY);
        expect(service.applyScaleToImage).toHaveBeenCalled();
    });

    it('scaleImageKeepRatio should calculate the scale of the image based on the selection size and ratio and return applyScaleToImage', () => {
        service.isMirrorWidth = false;
        service.isMirrorHeight = false;
        const imageDataWidth = 10;
        const imageDataHeight = 10;
        const imageData = new ImageData(imageDataWidth, imageDataHeight);
        const scaleX = 1.5;
        const scaleY = 2;
        drawingServiceSpy.previewCtx.canvas.width = imageDataWidth * scaleX;
        drawingServiceSpy.previewCtx.canvas.height = imageDataWidth * scaleY;
        spyOn(service, 'applyScaleToImage').and.callFake(() => {
            return imageData;
        });
        service.scaleImageKeepRatio(imageData);
        expect(service.scaleX).toEqual(scaleX);
        expect(service.scaleY).toEqual(scaleX);
        expect(service.applyScaleToImage).toHaveBeenCalled();
    });

    it('scaleImageKeepRatio should calculate the scale of the image based on the selection size and ratio and return applyScaleToImage and isMirrorWidth true', () => {
        service.isMirrorWidth = true;
        service.isMirrorHeight = false;
        const imageDataWidth = 10;
        const imageDataHeight = 10;
        const imageData = new ImageData(imageDataWidth, imageDataHeight);
        const scaleX = 1.5;
        const scaleY = 2;
        drawingServiceSpy.previewCtx.canvas.width = imageDataWidth * scaleX;
        drawingServiceSpy.previewCtx.canvas.height = imageDataWidth * scaleY;
        spyOn(service, 'applyScaleToImage').and.callFake(() => {
            return imageData;
        });
        service.scaleImageKeepRatio(imageData);
        expect(service.scaleX).toEqual(-scaleX);
        expect(service.scaleY).toEqual(scaleX);
        expect(service.applyScaleToImage).toHaveBeenCalled();
    });

    it('scaleImageKeepRatio should calculate the scale of the image based on the selection size and ratio and return applyScaleToImage and isMirrorHeight true', () => {
        service.isMirrorWidth = false;
        service.isMirrorHeight = true;
        const imageDataWidth = 10;
        const imageDataHeight = 10;
        const imageData = new ImageData(imageDataWidth, imageDataHeight);
        const scaleX = 1.5;
        const scaleY = 2;
        drawingServiceSpy.previewCtx.canvas.width = imageDataWidth * scaleX;
        drawingServiceSpy.previewCtx.canvas.height = imageDataWidth * scaleY;
        spyOn(service, 'applyScaleToImage').and.callFake(() => {
            return imageData;
        });
        service.scaleImageKeepRatio(imageData);
        expect(service.scaleX).toEqual(scaleX);
        expect(service.scaleY).toEqual(-scaleX);
        expect(service.applyScaleToImage).toHaveBeenCalled();
    });

    it('scaleImageKeepRatio should calculate the scale of the image based on the selection size and ratio and return applyScaleToImage and both isMirror true', () => {
        service.isMirrorWidth = true;
        service.isMirrorHeight = true;
        const imageDataWidth = 10;
        const imageDataHeight = 10;
        const imageData = new ImageData(imageDataWidth, imageDataHeight);
        const scaleX = 2;
        const scaleY = 1.5;
        drawingServiceSpy.previewCtx.canvas.width = imageDataWidth * scaleX;
        drawingServiceSpy.previewCtx.canvas.height = imageDataWidth * scaleY;
        spyOn(service, 'applyScaleToImage').and.callFake(() => {
            return imageData;
        });
        service.scaleImageKeepRatio(imageData);
        expect(service.scaleX).toEqual(-scaleY);
        expect(service.scaleY).toEqual(-scaleY);
        expect(service.applyScaleToImage).toHaveBeenCalled();
    });

    it('applyScaleToImage should scale image based on scale properties, put it in preview canvas and return the scaled image', () => {
        const imageDataWidth = 10;
        const imageDataHeight = 10;
        const imageData = drawingServiceSpy.previewCtx.getImageData(0, 0, imageDataWidth, imageDataHeight);

        const scaleX = 1.5;
        const scaleY = 2;
        service.isMirrorWidth = false;
        service.isMirrorHeight = false;
        service.scaleX = scaleX;
        service.scaleY = scaleY;
        spyOn(drawingServiceSpy.previewCtx, 'scale');
        spyOn(drawingServiceSpy.previewCtx, 'drawImage');
        spyOn(drawingServiceSpy.previewCtx, 'setTransform');
        spyOn(drawingServiceSpy.previewCtx, 'getImageData');
        spyOn(drawingServiceSpy.previewCtx, 'putImageData');

        service.applyScaleToImage(imageData);
        expect(drawingServiceSpy.previewCtx.scale).toHaveBeenCalledWith(scaleX, scaleY);
        expect(drawingServiceSpy.previewCtx.drawImage).toHaveBeenCalled();
        expect(drawingServiceSpy.previewCtx.setTransform).toHaveBeenCalled();
        expect(drawingServiceSpy.previewCtx.getImageData).toHaveBeenCalled();
        expect(drawingServiceSpy.previewCtx.putImageData).toHaveBeenCalled();
        expect(drawingServiceSpy.clearCanvas).toHaveBeenCalled();
    });

    it('applyScaleToImage should scale image based previews properties and with isMirrorWidth true and offsetLeft is negative', () => {
        const imageDataWidth = 10;
        const imageDataHeight = 10;
        const imageData = drawingServiceSpy.previewCtx.getImageData(0, 0, imageDataWidth, imageDataHeight);

        const scaleX = 1.5;
        const scaleY = 2;
        service.isMirrorWidth = true;
        service.isMirrorHeight = false;
        service.scaleX = scaleX;
        service.scaleY = scaleY;
        drawingServiceSpy.previewCtx.canvas.style.left = '-10px';
        drawingServiceSpy.previewCtx.canvas.style.top = '-10px';
        spyOn(drawingServiceSpy.previewCtx, 'scale');
        spyOn(drawingServiceSpy.previewCtx, 'drawImage');
        spyOn(drawingServiceSpy.previewCtx, 'setTransform');
        spyOn(drawingServiceSpy.previewCtx, 'getImageData');
        spyOn(drawingServiceSpy.previewCtx, 'putImageData');

        service.applyScaleToImage(imageData);
        expect(drawingServiceSpy.previewCtx.scale).toHaveBeenCalledWith(scaleX, scaleY);
        expect(drawingServiceSpy.previewCtx.drawImage).toHaveBeenCalled();
        expect(drawingServiceSpy.previewCtx.setTransform).toHaveBeenCalled();
        expect(drawingServiceSpy.previewCtx.getImageData).toHaveBeenCalled();
        expect(drawingServiceSpy.previewCtx.putImageData).toHaveBeenCalled();
        expect(drawingServiceSpy.clearCanvas).toHaveBeenCalled();
    });

    it('applyScaleToImage should scale image based previews properties and with isMirrorHeight true and offsetTop is negative', () => {
        const imageDataWidth = 10;
        const imageDataHeight = 10;
        const imageData = drawingServiceSpy.previewCtx.getImageData(0, 0, imageDataWidth, imageDataHeight);

        const scaleX = 1.5;
        const scaleY = 2;
        service.isMirrorWidth = false;
        service.isMirrorHeight = true;
        service.scaleX = scaleX;
        service.scaleY = scaleY;
        canvasWrapper.style.marginLeft = '10px';
        canvasWrapper.style.marginTop = '10px';
        spyOn(drawingServiceSpy.previewCtx, 'scale');
        spyOn(drawingServiceSpy.previewCtx, 'drawImage');
        spyOn(drawingServiceSpy.previewCtx, 'setTransform');
        spyOn(drawingServiceSpy.previewCtx, 'getImageData');
        spyOn(drawingServiceSpy.previewCtx, 'putImageData');

        service.applyScaleToImage(imageData);
        expect(drawingServiceSpy.previewCtx.scale).toHaveBeenCalledWith(scaleX, scaleY);
        expect(drawingServiceSpy.previewCtx.drawImage).toHaveBeenCalled();
        expect(drawingServiceSpy.previewCtx.setTransform).toHaveBeenCalled();
        expect(drawingServiceSpy.previewCtx.getImageData).toHaveBeenCalled();
        expect(drawingServiceSpy.previewCtx.putImageData).toHaveBeenCalled();
        expect(drawingServiceSpy.clearCanvas).toHaveBeenCalled();
    });

    it('applyScaleToImage should hide image outside of canvas when scaling', () => {
        drawingServiceSpy.clearCanvas.and.callFake(() => {
            drawingServiceSpy.previewCtx.clearRect(0, 0, drawingServiceSpy.previewCtx.canvas.width, drawingServiceSpy.previewCtx.canvas.height);
        });
        spyOn(drawingServiceSpy.previewCtx, 'putImageData').and.callThrough();
        const selectionImageDataWidth = 10;
        const selectionImageDataHeight = 10;

        drawingServiceSpy.previewCtx.fillStyle = 'black';
        drawingServiceSpy.previewCtx.fillRect(0, 0, selectionImageDataWidth, selectionImageDataHeight);
        const selectionImageData = drawingServiceSpy.previewCtx.getImageData(0, 0, selectionImageDataWidth, selectionImageDataHeight);

        // forcing selection to be placed outside of canvas
        const canvasContainer = document.createElement('div');
        canvasContainer.style.position = 'relative';
        canvasContainer.appendChild(drawingServiceSpy.previewCtx.canvas);
        const body = document.getElementsByTagName('body')[0];
        body.appendChild(canvasContainer);
        drawingServiceSpy.previewCtx.canvas.style.position = 'absolute';
        drawingServiceSpy.previewCtx.canvas.style.left = `${-selectionImageDataWidth / 2}px`;
        drawingServiceSpy.previewCtx.canvas.style.top = `${-selectionImageDataHeight / 2}px`;

        service.applyScaleToImage(selectionImageData);

        // checking pixel isn't drawn outside canvas
        let imageData = drawingServiceSpy.previewCtx.getImageData(0, 0, 1, 1).data;
        expect(imageData[0]).toEqual(0);
        expect(imageData[1]).toEqual(0);
        expect(imageData[2]).toEqual(0);
        expect(imageData[IMAGE_DATA_OPACITY_INDEX]).toEqual(0);

        imageData = drawingServiceSpy.previewCtx.getImageData(selectionImageDataWidth / 2, selectionImageDataWidth / 2, 1, 1).data;
        expect(imageData[0]).toEqual(0);
        expect(imageData[1]).toEqual(0);
        expect(imageData[2]).toEqual(0);
        expect(imageData[IMAGE_DATA_OPACITY_INDEX]).toEqual(MAX_COLOR_VALUE);
        body.removeChild(canvasContainer);
    });

    it('changeOppositeControlPoint should not change the control point if current control point is null', () => {
        resizeServiceSpy.controlPoint = null;
        service['changeOppositeControlPoint'](true);
        expect(resizeServiceSpy.controlPoint).toEqual(null);
    });

    it('changeOppositeControlPoint should change the control point for the opposite one for width control point', () => {
        const oldControlPoint: number = ControlPoint.CenterLeft;
        const newControlPoint: number = ControlPoint.CenterRight;
        resizeServiceSpy.controlPoint = oldControlPoint;
        service['changeOppositeControlPoint'](true);
        expect(resizeServiceSpy.controlPoint).toEqual(newControlPoint);
    });

    it('changeOppositeControlPoint should change the control point for the opposite one for height control point', () => {
        const oldControlPoint: number = ControlPoint.BottomCenter;
        const newControlPoint: number = ControlPoint.TopCenter;
        resizeServiceSpy.controlPoint = oldControlPoint;
        service['changeOppositeControlPoint'](false);
        expect(resizeServiceSpy.controlPoint).toEqual(newControlPoint);
    });

    it('changeOppositeControlPoint should not change the control point if control point opposite doesnt exist', () => {
        const oldControlPoint: number = ControlPoint.BottomCenter;
        resizeServiceSpy.controlPoint = oldControlPoint;
        service['changeOppositeControlPoint'](true);
        expect(resizeServiceSpy.controlPoint).toEqual(oldControlPoint);
    });

    it('isResizing should return resizeService.isResizing', () => {
        resizeServiceSpy.isResizing = false;
        expect(service.isResizing()).toBeFalse();

        resizeServiceSpy.isResizing = true;
        expect(service.isResizing()).toBeTrue();
    });
});
