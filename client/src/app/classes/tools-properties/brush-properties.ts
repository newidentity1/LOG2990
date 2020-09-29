// Paintbrush specific properties
import { BasicToolProperties } from './basic-tool-properties';

export class BrushProperties extends BasicToolProperties {
    // Default thickness
    thickness: number = 15;

    filterType: string[] = ['Blurred', 'Brushed', 'Graffiti', 'Goo', 'Water'];
    currentFilter: string = 'Blurred';
}
