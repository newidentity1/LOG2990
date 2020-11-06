import { BLACK, MAX_COLOR_VALUE, WHITE } from '@app/constants/constants';
import { Color } from './color';

describe('Color', () => {
    // tslint:disable:no-string-literal / reason : access private members
    // tslint:disable:no-magic-numbers / reason : using random values

    it('should create an instance', () => {
        const testColor: Color = new Color();
        expect(testColor).toBeTruthy();
    });

    it(' decToHex should convert dec to hex if value is valid', () => {
        const dec = Color.decToHex(171);
        expect(dec).toEqual('AB');
    });

    it(' hexToDec should convert hex to dec if value is valid', () => {
        const dec = Color.hexToDec('AB');
        expect(dec).toBeTruthy();
        expect(dec).toEqual(171);
    });

    it(' hexToDec should return null if value is invalid', () => {
        const dec = Color.hexToDec('ss');
        expect(dec).toBeFalsy();
    });

    it(' clone should return new color with same hex and opacity', () => {
        const testColor: Color = new Color(WHITE);
        const clonedColor = testColor.clone();
        expect(clonedColor.hex).toEqual(testColor.hex);
        expect(clonedColor.opacity).toEqual(testColor.opacity);
        expect(Object.is(testColor, clonedColor)).toBeFalsy();
    });

    it(' red setter should compute hex if value is valid', () => {
        const testColor = new Color(BLACK);
        testColor.red = MAX_COLOR_VALUE;
        expect(testColor.hex).toEqual('FF0000');
        expect(testColor['redValue']).toEqual(MAX_COLOR_VALUE);
    });

    it(' red setter should not accept invalid values', () => {
        const testColor = new Color(BLACK);
        testColor.red = 256;
        expect(testColor.hex).toEqual('000000');
        expect(testColor['redValue']).toEqual(0);

        testColor.red = -1;
        expect(testColor.hex).toEqual('000000');
        expect(testColor['redValue']).toEqual(0);
    });

    it(' green setter should compute hex if value is valid', () => {
        const testColor = new Color(BLACK);
        testColor.green = MAX_COLOR_VALUE;
        expect(testColor.hex).toEqual('00FF00');
        expect(testColor['greenValue']).toEqual(MAX_COLOR_VALUE);
    });

    it(' green setter should not accept invalid values', () => {
        const testColor = new Color(BLACK);
        testColor.green = 256;
        expect(testColor.hex).toEqual('000000');
        expect(testColor['greenValue']).toEqual(0);

        testColor.green = -1;
        expect(testColor.hex).toEqual('000000');
        expect(testColor['greenValue']).toEqual(0);
    });

    it(' blue setter should compute hex if value is valid', () => {
        const testColor = new Color(BLACK);
        testColor.blue = MAX_COLOR_VALUE;
        expect(testColor.hex).toEqual('0000FF');
        expect(testColor['blueValue']).toEqual(MAX_COLOR_VALUE);
    });

    it(' blue setter should not accept invalid values', () => {
        const testColor = new Color(BLACK);
        testColor.blue = 256;
        expect(testColor.hex).toEqual('000000');
        expect(testColor['blueValue']).toEqual(0);

        testColor.blue = -1;
        expect(testColor.hex).toEqual('000000');
        expect(testColor['blueValue']).toEqual(0);
    });

    it(' hex getter should return hex string', () => {
        const testColor = new Color(WHITE);
        const returnedHex = testColor.hex;
        expect(returnedHex).toEqual(testColor['hexString']);
        expect(returnedHex).toEqual(WHITE);
    });

    it(' hex setter should compute rgb if value is valid', () => {
        const testColor = new Color(WHITE);
        testColor.hex = 'ABCDEF';
        expect(testColor['hexString']).toEqual('ABCDEF');
        expect(testColor['redValue']).toEqual(171);
        expect(testColor['greenValue']).toEqual(205);
        expect(testColor['blueValue']).toEqual(239);
    });

    it(' hex setter should not accept invalid values', () => {
        const testColor = new Color(WHITE);
        testColor.hex = 'sdfijqp121kp';
        expect(testColor['hexString']).toEqual(WHITE);
        expect(testColor['redValue']).toEqual(MAX_COLOR_VALUE);
        expect(testColor['greenValue']).toEqual(MAX_COLOR_VALUE);
        expect(testColor['blueValue']).toEqual(MAX_COLOR_VALUE);
    });

    it(' opacity getter should return color alpha', () => {
        const testColor = new Color(WHITE, 0.5);
        const returnedOpacity = testColor.opacity;
        expect(returnedOpacity).toEqual(testColor['alpha']);
        expect(returnedOpacity).toEqual(0.5);
    });

    it(' opacity setter should change alpha if value is valid', () => {
        const testColor = new Color(BLACK, 0.5);
        testColor.opacity = 0.7;
        expect(testColor.opacity).toEqual(0.7);
    });

    it(' opacity setter should not accept invalid values', () => {
        const testColor = new Color(BLACK, 0.5);
        testColor.opacity = 2;
        expect(testColor.opacity).toEqual(0.5);

        testColor.opacity = -1;
        expect(testColor.opacity).toEqual(0.5);
    });

    it(' setRedHex should change red if value is valid', () => {
        const testColor = new Color(BLACK, 0.5);
        testColor.setRedHex('AB');
        expect(testColor['redValue']).toEqual(171);
        expect(testColor.hex).toEqual('AB0000');
    });

    it(' setRedHex should not accept invalid values', () => {
        const testColor = new Color(BLACK, 0.5);
        testColor.setRedHex('LL');
        expect(testColor['redValue']).toEqual(0);
        expect(testColor.hex).toEqual(BLACK);
    });

    it(' setGreenHex should change red if value is valid', () => {
        const testColor = new Color(BLACK, 0.5);
        testColor.setGreenHex('AB');
        expect(testColor['greenValue']).toEqual(171);
        expect(testColor.hex).toEqual('00AB00');
    });

    it(' setGreenHex should not accept invalid values', () => {
        const testColor = new Color(BLACK, 0.5);
        testColor.setGreenHex('LL');
        expect(testColor['greenValue']).toEqual(0);
        expect(testColor.hex).toEqual(BLACK);
    });

    it(' setBlueHex should change red if value is valid', () => {
        const testColor = new Color(BLACK, 0.5);
        testColor.setBlueHex('AB');
        expect(testColor['blueValue']).toEqual(171);
        expect(testColor.hex).toEqual('0000AB');
    });

    it(' setBlueHex should not accept invalid values', () => {
        const testColor = new Color(BLACK, 0.5);
        testColor.setBlueHex('LL');
        expect(testColor['blueValue']).toEqual(0);
        expect(testColor.hex).toEqual(BLACK);
    });

    it(' getRedHex should return red value in hex format', () => {
        const testColor = new Color('ABCDEF');
        const returnedRedHex = testColor.getRedHex();
        expect(returnedRedHex).toEqual('AB');
    });

    it(' getGreenHex should return red value in hex format', () => {
        const testColor = new Color('ABCDEF');
        const returnedGreenHex = testColor.getGreenHex();
        expect(returnedGreenHex).toEqual('CD');
    });

    it(' getBlueHex should return red value in hex format', () => {
        const testColor = new Color('ABCDEF');
        const returnedBlueHex = testColor.getBlueHex();
        expect(returnedBlueHex).toEqual('EF');
    });

    it(' toStringRGBA should return rgba values in string format', () => {
        const testColor = new Color('ABCDEF', 0.5);
        const rgba = testColor.toStringRGBA();
        expect(rgba).toEqual('rgba(171, 205, 239, 0.5)');
    });

    it(' computeRBGFromHex should set hex if RGB values are valid', () => {
        const testColor = new Color();
        testColor['hexString'] = 'ABCDEF';
        testColor['computeRBGFromHex']();
        expect(testColor['redValue']).toEqual(171);
        expect(testColor['greenValue']).toEqual(205);
        expect(testColor['blueValue']).toEqual(239);
    });

    it(' computeRBGFromHex should not set hex if RGB values are invalid', () => {
        const testColor = new Color();
        testColor['hexString'] = 'ssssss';
        testColor['computeRBGFromHex']();
        expect(testColor['redValue']).toEqual(0);
        expect(testColor['greenValue']).toEqual(0);
        expect(testColor['blueValue']).toEqual(0);
    });

    it(' computeHexFromRGB should set hex from RGB values', () => {
        const testColor = new Color();
        // manually set rgb values to random values
        testColor['redValue'] = 121;
        testColor['greenValue'] = 230;
        testColor['blueValue'] = 49;
        testColor['computeHexFromRGB']();

        expect(testColor['hexString']).toEqual('79E631');
    });
});
