import * as CONSTANTS from '@app/constants/constants';

export class Color {
    private hexString: string = CONSTANTS.BLACK;
    private redValue: number = CONSTANTS.MAX_COLOR_VALUE;
    private greenValue: number = CONSTANTS.MAX_COLOR_VALUE;
    private blueValue: number = CONSTANTS.MAX_COLOR_VALUE;
    private alpha: number = CONSTANTS.DEFAULT_COLOR_OPACITY;

    constructor(hex?: string, alpha?: number) {
        this.hexString = hex ? hex.toUpperCase() : this.hexString;
        this.alpha = alpha !== undefined ? alpha : this.alpha;
        this.computeRBGFromHex();
    }

    static decToHex(dec: number): string {
        const hex = dec.toString(CONSTANTS.HEX_BASE).toUpperCase();
        return hex.length === 1 ? '0' + hex : hex;
    }

    static hexToDec(hex: string): number | null {
        if (hex.match(/[0-9A-F]{1,2}$/i)) {
            return parseInt(hex, CONSTANTS.HEX_BASE);
        }
        return null;
    }

    clone(): Color {
        return new Color(this.hexString, this.alpha);
    }

    set red(value: number) {
        if (value >= 0 && value <= CONSTANTS.MAX_COLOR_VALUE) {
            this.redValue = value;
            this.computeHexFromRGB();
        }
    }

    get getRed(): number {
        return this.redValue;
    }

    set green(value: number) {
        if (value >= 0 && value <= CONSTANTS.MAX_COLOR_VALUE) {
            this.greenValue = value;
            this.computeHexFromRGB();
        }
    }

    get getGreen(): number {
        return this.greenValue;
    }

    set blue(value: number) {
        if (value >= 0 && value <= CONSTANTS.MAX_COLOR_VALUE) {
            this.blueValue = value;
            this.computeHexFromRGB();
        }
    }

    get getBlue(): number {
        return this.blueValue;
    }

    get hex(): string {
        return this.hexString;
    }

    set hex(value: string) {
        if (value.match(/[0-9A-F]{6}$/i)) {
            this.hexString = value.toUpperCase();
            this.computeRBGFromHex();
        }
    }

    get opacity(): number {
        return this.alpha;
    }

    set opacity(value: number) {
        if (value >= 0 && value <= 1) {
            this.alpha = value;
        }
    }

    setRedHex(hexValue: string): void {
        const dec = Color.hexToDec(hexValue);
        if (dec !== null) {
            this.red = dec;
        }
    }

    setGreenHex(hexValue: string): void {
        const dec = Color.hexToDec(hexValue);
        if (dec !== null) {
            this.green = dec;
        }
    }

    setBlueHex(hexValue: string): void {
        const dec = Color.hexToDec(hexValue);
        if (dec !== null) {
            this.blue = dec;
        }
    }

    getRedHex(): string {
        return Color.decToHex(this.redValue).toUpperCase();
    }

    getGreenHex(): string {
        return Color.decToHex(this.greenValue).toUpperCase();
    }

    getBlueHex(): string {
        return Color.decToHex(this.blueValue).toUpperCase();
    }

    toStringRGBA(): string {
        return `rgba(${this.redValue}, ${this.greenValue}, ${this.blueValue}, ${this.alpha})`;
    }

    private computeRBGFromHex(): void {
        const redDec = Color.hexToDec(this.hexString.substring(0, CONSTANTS.RED_POSITION_IN_HEX_STRING));
        this.redValue = redDec !== null ? redDec : this.redValue;
        const greenDec = Color.hexToDec(this.hexString.substring(CONSTANTS.RED_POSITION_IN_HEX_STRING, CONSTANTS.GREEN_POSITION_IN_HEX_STRING));
        this.greenValue = greenDec !== null ? greenDec : this.greenValue;
        const blueDec = Color.hexToDec(this.hexString.substring(CONSTANTS.GREEN_POSITION_IN_HEX_STRING, CONSTANTS.BLUE_POSITION_IN_HEX_STRING));
        this.blueValue = blueDec !== null ? blueDec : this.blueValue;
    }

    private computeHexFromRGB(): void {
        this.hexString = Color.decToHex(this.redValue) + Color.decToHex(this.greenValue) + Color.decToHex(this.blueValue);
    }
}
