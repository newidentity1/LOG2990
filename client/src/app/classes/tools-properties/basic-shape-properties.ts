import { BasicToolProperties } from './basic-tool-properties';

export class BasicShapeProperties extends BasicToolProperties {
    thickness: number = 1;
    // TODO créer un enum pour les types possibles
    typesDrawing: ['Contour', 'Plein', 'Plein avec contour'];
    currentType: string = 'Contour';

    resetProperties(): void {
        this.thickness = 1;
        this.currentType = 'Contour';
    }
}
