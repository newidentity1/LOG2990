import { Injectable } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import { MagnetismOption } from '@app/enums/magnetism-option.enum';
import { GridService } from '@app/services/tools/grid/grid.service';

@Injectable({
    providedIn: 'root',
})
export class MagnetismService {
    private activeMagnet: boolean = false;
    private magnetismOption: MagnetismOption = MagnetismOption.TopLeft;
    constructor(private gridService: GridService) {}

    getActiveMagnet(): boolean {
        return this.activeMagnet;
    }

    getMagnetismOption(): MagnetismOption {
        return this.magnetismOption;
    }

    setActiveMagnet(state: boolean): void {
        this.activeMagnet = state;
    }

    setMagnetismOption(option: number): void {
        this.magnetismOption = option;
    }

    magneticOption(position: Vec2, positiveWidth: number, positiveHeight: number): Vec2 {
        let x = 0;
        let y = 0;
        switch (this.magnetismOption) {
            case MagnetismOption.TopLeft:
                position.x = this.calculPosition(position.x);
                position.y = this.calculPosition(position.y);
                break;

            case MagnetismOption.TopCenter:
                x = this.calculPosition(position.x) + this.gridService.getGridSize() - positiveWidth / 2;
                y = this.calculPosition(position.y);
                position.x = x;
                position.y = y;
                break;

            case MagnetismOption.TopRight:
                x = this.calculPosition(position.x) + this.gridService.getGridSize() - positiveWidth;
                y = this.calculPosition(position.y);
                position.x = x;
                position.y = y;
                break;

            case MagnetismOption.MiddleLeft:
                x = this.calculPosition(position.x);
                y = this.calculPosition(position.y) + this.gridService.getGridSize() - positiveHeight / 2;
                position.x = x;
                position.y = y;
                break;

            case MagnetismOption.MiddleCenter:
                x = this.calculPosition(position.x) - positiveWidth / 2;
                y = this.calculPosition(position.y) - positiveHeight / 2;
                position.x = x;
                position.y = y;
                break;

            case MagnetismOption.MiddleRight:
                x = this.calculPosition(position.x) + this.gridService.getGridSize() - positiveWidth;
                y = this.calculPosition(position.y) + this.gridService.getGridSize() - positiveHeight / 2;
                position.x = x;
                position.y = y;
                break;

            case MagnetismOption.BottomLeft:
                x = this.calculPosition(position.x);
                y = this.calculPosition(position.y) + this.gridService.getGridSize() - positiveHeight;
                position.x = x;
                position.y = y;
                break;

            case MagnetismOption.BottomCenter:
                x = this.calculPosition(position.x) + this.gridService.getGridSize() - positiveWidth / 2;
                y = this.calculPosition(position.y) + this.gridService.getGridSize() - positiveHeight / 2;
                position.x = x;
                position.y = y;
                break;

            case MagnetismOption.BottomRight:
                x = this.calculPosition(position.x + positiveWidth);
                y = this.calculPosition(position.y + positiveHeight);
                position.x = x - positiveWidth;
                position.y = y - positiveHeight;
                break;
        }
        return position;
    }

    private calculPosition(position: number): number {
        position = position - (position % this.gridService.getGridSize());
        return position;
    }
}
