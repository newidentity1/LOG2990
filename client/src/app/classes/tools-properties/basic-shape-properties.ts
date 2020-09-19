import { DrawingType } from '@app/enums/drawing-type.enum';
import { BasicToolProperties } from './basic-tool-properties';

export class BasicShapeProperties extends BasicToolProperties {
    thickness: number = 1;

    typesDrawing: string[] = [DrawingType.Contour, DrawingType.Plein, DrawingType.PleinEtContour];
    currentType: string = DrawingType.Contour;

    resetProperties(): void {
        this.thickness = 1;
        this.currentType = DrawingType.Contour;
    }
}
