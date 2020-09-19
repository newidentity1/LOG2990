import { BasicToolProperties } from './basic-tool-properties';

export class BasicShapeProperties implements BasicToolProperties {
    thickness: number = 1;
    // TODO créer un enum pour les types possibles
    typesDrawing: ['Contour', 'Plein', 'Plein avec contour'];
    currentType: string = 'Contour';
}
