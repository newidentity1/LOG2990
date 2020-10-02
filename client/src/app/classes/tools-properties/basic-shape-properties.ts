import { DrawingType } from '@app/enums/drawing-type.enum';
import { BasicToolProperties } from './basic-tool-properties';

export class BasicShapeProperties extends BasicToolProperties {
    thickness: number = 1;
    typesDrawing: string[] = [DrawingType.Stroke, DrawingType.Fill, DrawingType.FillAndStroke];
    currentType: string = DrawingType.Fill;
}
