import { TestBed } from '@angular/core/testing';
import { Color } from '@app/classes/color/color';
import { ShapeTool } from '@app/classes/tool/shape-tool';
import { BLACK, WHITE } from '@app/constants/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';

// To instanciate a ShapeTool object
export class ShapeToolTest extends ShapeTool {
    resetContext(): void {
        // Not necessary
    }
}

// tslint:disable:no-any
describe('Class: ShapeTool', () => {
    let shapeTool: ShapeToolTest;
    let service: DrawingService;
    let firstColor: Color;
    let secondColor: Color;
    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(DrawingService);
        shapeTool = new ShapeToolTest(service);
        firstColor = new Color(WHITE);
        secondColor = new Color(BLACK);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('function setColors should call setFillColor with primaryColor and setStrokeColor with secondColor', () => {
        const spyFill = spyOn(service, 'setFillColor');
        const spyStroke = spyOn(service, 'setStrokeColor');
        shapeTool.setColors(firstColor, secondColor);
        expect(spyFill).toHaveBeenCalled();
        expect(spyFill).toHaveBeenCalledWith(firstColor.toStringRGBA());
        expect(spyStroke).toHaveBeenCalled();
        expect(spyStroke).toHaveBeenCalledWith(secondColor.toStringRGBA());
    });
});
