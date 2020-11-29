import { Component, OnInit } from '@angular/core';
// import {MagnetismOption} from '@app/enums/magnetism-option.enum'
import { SelectionService } from '@app/services/tools/selection/selection.service';

@Component({
    selector: 'app-magnetism-option',
    templateUrl: './magnetism.component.html',
    styleUrls: ['../../../sidebar/sidebar.component.scss'],
})
export class MagnetismComponent implements OnInit {
    activateOption: number = 1;
    constructor(private selectionService: SelectionService) {
        //
    }

    ngOnInit(): void {
        //
        this.activateOption = this.selectionService.magnetismOption;
    }

    activeMagnetism(): void {
        this.selectionService.activeMagnet = !this.selectionService.activeMagnet;
    }

    setMagnetismeOption(option: number): void {
        this.activateOption = option;
        this.selectionService.magnetismOption = option;
    }

    getMagnetismeOption(): boolean {
        return this.selectionService.activeMagnet;
    }
}
