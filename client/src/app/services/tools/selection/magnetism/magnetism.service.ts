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
    firstmove: boolean = true;
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
        this.firstmove = false;
        switch (this.magnetismOption) {
            case MagnetismOption.TopLeft:
                position.x = this.calculPosition(position.x);
                position.y = this.calculPosition(position.y);
                break;

            case MagnetismOption.TopCenter:
                position.x = this.calculPosition(position.x) - positiveWidth / 2;
                position.y = this.calculPosition(position.y);
                break;

            case MagnetismOption.TopRight:
                position.x = this.calculPosition(position.x) - positiveWidth + this.gridService.getGridSize();
                position.y = this.calculPosition(position.y);
                break;

            case MagnetismOption.MiddleLeft:
                position.x = this.calculPosition(position.x);
                position.y = this.calculPosition(position.y) - positiveHeight / 2;
                break;

            case MagnetismOption.MiddleCenter:
                position.x = this.calculPosition(position.x) - positiveWidth / 2;
                position.y = this.calculPosition(position.y) - positiveHeight / 2;
                break;

            case MagnetismOption.MiddleRight:
                position.x = this.calculPosition(position.x) - positiveWidth + this.gridService.getGridSize();
                position.y = this.calculPosition(position.y) - positiveHeight / 2 + this.gridService.getGridSize();
                break;

            case MagnetismOption.BottomLeft:
                position.x = this.calculPosition(position.x);
                position.y = this.calculPosition(position.y) - positiveHeight + this.gridService.getGridSize();
                break;

            case MagnetismOption.BottomCenter:
                position.x = this.calculPosition(position.x) - positiveWidth / 2;
                position.y = this.calculPosition(position.y) + this.gridService.getGridSize() - positiveHeight;
                break;

            case MagnetismOption.BottomRight:
                position.x = this.calculPosition(position.x) + this.gridService.getGridSize() - positiveWidth;
                position.y = this.calculPosition(position.y) + this.gridService.getGridSize() - positiveHeight;
                break;
        }
        return position;
    }

    private calculPosition(position: number): number {
        position = position - (position % this.gridService.getGridSize());
        return position;
    }

    moveKeyBord(key: string, position: Vec2): Vec2 {
        switch (key) {
            case 'ArrowLeft':
                position.x -= this.gridService.getGridSize();
                break;

            case 'ArrowRight':
                position.x += this.gridService.getGridSize();
                break;

            case 'ArrowUp':
                position.y -= this.gridService.getGridSize();
                break;

            case 'ArrowDown':
                position.y += this.gridService.getGridSize();
                break;
        }

        return position;
    }
}
