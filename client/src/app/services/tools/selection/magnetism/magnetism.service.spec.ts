import { TestBed } from '@angular/core/testing';
import { Vec2 } from '@app/classes/vec2';
import * as CONSTANTS from '@app/constants/constants';
import { MagnetismOption } from '@app/enums/magnetism-option.enum';
import { MagnetismService } from './magnetism.service';
// tslint:disable:no-string-literal // use private variable for test
describe('MagnetismService', () => {
    let service: MagnetismService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(MagnetismService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('getActiveMagnet should say if the mgnetism option is activ or not', () => {
        expect(service.getActiveMagnet()).toBeFalse();
    });

    it('getMagnetismOption should return the active control point', () => {
        expect(service.getMagnetismOption()).toEqual(MagnetismOption.TopLeft);
    });

    it('setActiveMagnet should set the magnet option', () => {
        service.setActiveMagnet(true);
        expect(service['activeMagnet']).toEqual(true);
    });

    it('setMagnetismOption should set the magnet option', () => {
        service.setMagnetismOption(MagnetismOption.TopCenter);
        expect(service['magnetismOption']).toEqual(MagnetismOption.TopCenter);
    });

    it('magneticOption should return the position depend of the controle point TOPLEFT', () => {
        let position: Vec2 = { x: 26, y: 26 };
        const width = 100;
        const height = 100;
        service['magnetismOption'] = MagnetismOption.TopLeft;
        position = service.magneticOption(position, width, height);
        expect(position.x).toEqual(CONSTANTS.GRID_BEGIN_SIZE);
        expect(position.y).toEqual(CONSTANTS.GRID_BEGIN_SIZE);
    });

    it('magneticOption should return the position depend of the controle point TOPCENTER', () => {
        let position: Vec2 = { x: 25, y: 25 };
        const width = 100;
        const height = 100;
        service['magnetismOption'] = MagnetismOption.TopCenter;
        position = service.magneticOption(position, width, height);
        expect(position.x).toEqual(-CONSTANTS.GRID_BEGIN_SIZE);
        expect(position.y).toEqual(CONSTANTS.GRID_BEGIN_SIZE);
    });

    it('magneticOption should return the position depend of the controle point TOPRIGHT', () => {
        let position: Vec2 = { x: 25, y: 25 };
        const width = 100;
        const height = 100;
        service['magnetismOption'] = MagnetismOption.TopRight;
        position = service.magneticOption(position, width, height);
        expect(position.x).toEqual(-CONSTANTS.GRID_BEGIN_SIZE * 2);
        expect(position.y).toEqual(CONSTANTS.GRID_BEGIN_SIZE);
    });

    it('magneticOption should return the position depend of the controle point MIDDLELEFT', () => {
        let position: Vec2 = { x: 25, y: 25 };
        const width = 100;
        const height = 100;
        service['magnetismOption'] = MagnetismOption.MiddleLeft;
        position = service.magneticOption(position, width, height);
        expect(position.x).toEqual(CONSTANTS.GRID_BEGIN_SIZE);
        expect(position.y).toEqual(-CONSTANTS.GRID_BEGIN_SIZE);
    });

    it('magneticOption should return the position depend of the controle point MIDDLECENTER', () => {
        let position: Vec2 = { x: 25, y: 25 };
        const width = 100;
        const height = 100;
        service['magnetismOption'] = MagnetismOption.MiddleCenter;
        position = service.magneticOption(position, width, height);
        expect(position.x).toEqual(-CONSTANTS.GRID_BEGIN_SIZE);
        expect(position.y).toEqual(-CONSTANTS.GRID_BEGIN_SIZE);
    });

    it('magneticOption should return the position depend of the controle point MIDDLERIGHT', () => {
        let position: Vec2 = { x: 25, y: 25 };
        const width = 100;
        const height = 100;
        service['magnetismOption'] = MagnetismOption.MiddleRight;
        position = service.magneticOption(position, width, height);
        expect(position.x).toEqual(-CONSTANTS.GRID_BEGIN_SIZE * 2);
        expect(position.y).toEqual(0);
    });

    it('magneticOption should return the position depend of the controle point BOTTOMLEFT', () => {
        let position: Vec2 = { x: 25, y: 25 };
        const width = 100;
        const height = 100;
        service['magnetismOption'] = MagnetismOption.BottomLeft;
        position = service.magneticOption(position, width, height);
        expect(position.x).toEqual(CONSTANTS.GRID_BEGIN_SIZE);
        expect(position.y).toEqual(-CONSTANTS.GRID_BEGIN_SIZE * 2);
    });

    it('magneticOption should return the position depend of the controle point BOTTOMCENTER', () => {
        let position: Vec2 = { x: 25, y: 25 };
        const width = 100;
        const height = 100;
        service['magnetismOption'] = MagnetismOption.BottomCenter;
        position = service.magneticOption(position, width, height);
        expect(position.x).toEqual(-CONSTANTS.GRID_BEGIN_SIZE);
        expect(position.y).toEqual(-CONSTANTS.GRID_BEGIN_SIZE * 2);
    });

    it('magneticOption should return the position depend of the controle point BOTTOMRIGHT', () => {
        let position: Vec2 = { x: 25, y: 25 };
        const width = 100;
        const height = 100;
        service['magnetismOption'] = MagnetismOption.BottomRight;
        position = service.magneticOption(position, width, height);
        expect(position.x).toEqual(-CONSTANTS.GRID_BEGIN_SIZE * 2);
        expect(position.y).toEqual(-CONSTANTS.GRID_BEGIN_SIZE * 2);
    });

    it('moveKeyBord should return the position depend of the controle point BOTTOMRIGHT and key code ArrowLeft', () => {
        let position: Vec2 = { x: 25, y: 25 };
        position = service.moveKeyBord('ArrowLeft', position);
        expect(position.x).toEqual(0);
        expect(position.y).toEqual(CONSTANTS.GRID_BEGIN_SIZE);
    });

    it('moveKeyBord should return the position depend of the controle point BOTTOMRIGHT and key code ArrowRight', () => {
        let position: Vec2 = { x: 25, y: 25 };
        position = service.moveKeyBord('ArrowRight', position);
        expect(position.x).toEqual(CONSTANTS.GRID_BEGIN_SIZE * 2);
        expect(position.y).toEqual(CONSTANTS.GRID_BEGIN_SIZE);
    });

    it('moveKeyBord should return the position depend of the controle point BOTTOMRIGHT and key code ArrowUp', () => {
        let position: Vec2 = { x: 25, y: 25 };
        position = service.moveKeyBord('ArrowUp', position);
        expect(position.x).toEqual(CONSTANTS.GRID_BEGIN_SIZE);
        expect(position.y).toEqual(0);
    });

    it('moveKeyBord should return the position depend of the controle point BOTTOMRIGHT and key code ArrowDown', () => {
        let position: Vec2 = { x: 25, y: 25 };
        position = service.moveKeyBord('ArrowDown', position);
        expect(position.x).toEqual(CONSTANTS.GRID_BEGIN_SIZE);
        expect(position.y).toEqual(CONSTANTS.GRID_BEGIN_SIZE * 2);
    });
});
