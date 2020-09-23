import { Component } from '@angular/core';
import { Color } from '@app/classes/color/color';
import { ColorPickerService } from '@app/services/color-picker/color-picker.service';

@Component({
    selector: 'app-recent-colors',
    templateUrl: './recent-colors.component.html',
    styleUrls: ['./recent-colors.component.scss'],
})
export class RecentColorsComponent {
    constructor(private colorService: ColorPickerService) {}

    getRecentColors(): Color[] {
        return this.colorService.recentColors;
    }

    selectAsPrimaryColor(color: Color): void {
        this.colorService.applyRecentColor(color, false);
    }

    selectAsSecondaryColor(event: MouseEvent, color: Color): void {
        event.preventDefault();
        this.colorService.applyRecentColor(color, true);
    }
}
