import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Color } from '@app/classes/color/color';

@Component({
    selector: 'app-color-picker-form',
    templateUrl: './color-picker-form.component.html',
    styleUrls: ['./color-picker-form.component.scss'],
})
export class ColorPickerFormComponent implements OnInit {
    @Input() color: Color = new Color(); // TODO remove initialization after tests are done
    @Output() confirm: EventEmitter<null> = new EventEmitter();
    red: FormControl;
    green: FormControl;
    blue: FormControl;
    alpha: FormControl;

    ngOnInit(): void {
        this.red = new FormControl(this.color.getRedHex(), [Validators.pattern(/^[0-9A-F]{2}$/i), Validators.required]);
        this.green = new FormControl(this.color.getGreenHex(), [Validators.pattern(/^[0-9A-F]{2}$/i), Validators.required]);
        this.blue = new FormControl(this.color.getBlueHex(), [Validators.pattern(/^[0-9A-F]{2}$/i), Validators.required]);
        this.alpha = new FormControl(this.color.opacity, [Validators.required]);
    }

    onRedChange(value: string): void {
        this.color.setRedHex(value);
        this.red.setValue(this.color.getRedHex());
    }

    onGreenChange(value: string): void {
        this.color.setGreenHex(value);
        this.green.setValue(this.color.getGreenHex());
    }

    onBlueChange(value: string): void {
        this.color.setBlueHex(value);
        this.blue.setValue(this.color.getBlueHex());
    }

    changeOpacity(value: number): void {
        this.color.opacity = value;
        this.alpha.setValue(this.color.opacity);
    }

    closeDialog(): void {
        this.confirm.emit();
    }

    getColorErrorMessage(form: FormControl): string {
        return form.errors ? 'Couleur non valide' : '';
    }

    getOpacityErrorMessage(): string {
        return this.alpha.errors ? 'SVP saisir une valeur entre 0 et 1' : '';
    }

    isColorInvalid(): boolean {
        return this.red.invalid || this.green.invalid || this.blue.invalid || this.alpha.invalid;
    }
}
