import { Component, OnInit } from '@angular/core';
import { SelectionService } from '@app/services/tools/selection/selection.service';

@Component({
    selector: 'app-magnetism-option',
    templateUrl: './magnetism.component.html',
    styleUrls: ['../../../sidebar/sidebar.component.scss'],
})
export class MagnetismComponent implements OnInit {
    activateOption: number = 1;
    constructor(private selectionService: SelectionService) {}

    ngOnInit(): void {
        this.activateOption = this.selectionService.magnetismService.getMagnetismOption();
    }

    activeMagnetism(): void {
        this.selectionService.magnetismService.firstmove = true;
        this.selectionService.activeMagnet = !this.selectionService.activeMagnet;
    }

    setMagnetismeOption(option: number): void {
        this.selectionService.magnetismService.firstmove = true;
        this.activateOption = option;
        this.selectionService.magnetismService.setMagnetismOption(option);
    }

    getMagnetismeOption(): boolean {
        return this.selectionService.activeMagnet;
    }
}
