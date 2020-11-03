import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ColorPickerComponent } from '@app/components/color/color-picker/color-picker.component';
import { ColorPickerService } from '@app/services/color-picker/color-picker.service';

@Component({
    selector: 'app-color-tool',
    templateUrl: './color-tool.component.html',
    styleUrls: ['./color-tool.component.scss'],
})
export class ColorToolComponent {
    constructor(private colorPickerService: ColorPickerService, private dialog: MatDialog) {}

    openPrimaryColorPicker(): void {
        this.openDialog(false);
    }

    openSecondaryColorPicker(): void {
        this.openDialog(true);
    }

    getPrimaryColor(): string {
        return this.colorPickerService.primaryColor.getValue().toStringRGBA();
    }

    getSecondaryColor(): string {
        return this.colorPickerService.secondaryColor.getValue().toStringRGBA();
    }

    onSwapColors(): void {
        this.colorPickerService.swapColors();
    }

    private openDialog(isSecondaryColorPicker: boolean): void {
        this.dialog.open(ColorPickerComponent, { data: { isSecondaryColorPicker } });
        this.colorPickerService.resetSelectedColor(isSecondaryColorPicker);
    }
}
