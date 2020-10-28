import { TestBed } from '@angular/core/testing';
import { MoveSelectionService } from './move-selection.service';

describe('MoveSelectionService', () => {
    let service: MoveSelectionService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(MoveSelectionService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    // it('drawSelectedArea should change preview canvas position and size', () => {
    //     service.isAreaSelected = false;
    //     service['positiveStartingPos'] = { x: 20, y: 20 };
    //     service['positiveWidth'] = 20;
    //     service['positiveHeight'] = 20;
    //     drawingServiceSpy.previewCtx.canvas.width = 0;
    //     drawingServiceSpy.previewCtx.canvas.height = 0;
    //     drawingServiceSpy.previewCtx.canvas.style.left = '0px';
    //     drawingServiceSpy.previewCtx.canvas.style.top = '0px';
    //     service['drawSelectedArea']();

    //     expect(service.isAreaSelected).toBeTrue();
    //     expect(drawingServiceSpy.previewCtx.canvas.width).toEqual(20);
    //     expect(drawingServiceSpy.previewCtx.canvas.height).toEqual(20);
    //     expect(drawingServiceSpy.previewCtx.canvas.style.left).toEqual('20px');
    //     expect(drawingServiceSpy.previewCtx.canvas.style.top).toEqual('20px');
    // });

    // it('drawSelectedArea should call isPositionInEllipse if selection is ellipse', () => {
    //     service.isAreaSelected = false;
    //     service['positiveStartingPos'] = { x: 20, y: 20 };
    //     service['positiveWidth'] = 20;
    //     service['positiveHeight'] = 20;
    //     drawingServiceSpy.previewCtx.canvas.width = 0;
    //     drawingServiceSpy.previewCtx.canvas.height = 0;
    //     drawingServiceSpy.previewCtx.canvas.style.left = '0px';
    //     drawingServiceSpy.previewCtx.canvas.style.top = '0px';
    //     service.currentType = SelectionType.EllipseSelection;
    //     service['drawSelectedArea']();

    //     expect(service.isAreaSelected).toBeTrue();
    //     expect(drawingServiceSpy.previewCtx.canvas.width).toEqual(20);
    //     expect(drawingServiceSpy.previewCtx.canvas.height).toEqual(20);
    //     expect(drawingServiceSpy.previewCtx.canvas.style.left).toEqual('20px');
    //     expect(drawingServiceSpy.previewCtx.canvas.style.top).toEqual('20px');
    // });

    // it('isPositionInEllipse should return true ', () => {
    //     service['positiveWidth'] = 200;
    //     service['positiveHeight'] = 100;
    //     const returnedResult = service['isPositionInEllipse']({ x: 100, y: 50 });
    //     expect(returnedResult).toBeTrue();
    // });

    // it('isPositionInEllipse should return false ', () => {
    //     service['positiveWidth'] = 200;
    //     service['positiveHeight'] = 100;
    //     const returnedResult = service['isPositionInEllipse']({ x: 0, y: 0 });
    //     expect(returnedResult).toBeFalse();
    // });
});
