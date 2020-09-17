import { Component } from '@angular/core';
import { Color } from '@app/classes/color';
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
        const opacity = this.colorService.primaryColor.alpha;
        this.colorService.primaryColor = new Color(color.hex, opacity);
    }

    selectAsSecondaryColor(event: MouseEvent, color: Color): void {
        event.preventDefault();
        this.colorService.secondaryColor = color;
    }
}
