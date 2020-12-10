import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MagnetismOption } from '@app/enums/magnetism-option.enum';
// import * as CONSTANTS from '@app/constants/constants';
import { SelectionService } from '@app/services/tools/selection/selection.service';
import { MagnetismComponent } from './magnetism.component';

// tslint:disable:no-string-literal // use private variable for test
describe('MagnetismComponent', () => {
    let component: MagnetismComponent;
    let fixture: ComponentFixture<MagnetismComponent>;
    let selectionServiceMock: jasmine.SpyObj<SelectionService>;

    beforeEach(async(() => {
        selectionServiceMock = jasmine.createSpyObj('SelectionService', ['setMoveSelectionMagnet', 'setMagnetismOption']);
        TestBed.configureTestingModule({
            declarations: [MagnetismComponent],
            providers: [{ provide: selectionServiceMock, useValue: SelectionService }],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
        selectionServiceMock = TestBed.inject(SelectionService) as jasmine.SpyObj<SelectionService>;
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MagnetismComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('setMagnetismeOption should set the magnetism option', () => {
        component.setMagnetismeOption(MagnetismOption.TopLeft);
        expect(component.activateOption).toEqual(MagnetismOption.TopLeft);
    });

    it('activeMagnetism should set the magnetism option', () => {
        component.activeMagnetism();
        expect(component['selectionService'].activeMagnet).toBeTrue();
    });

    it('getMagnetismeOption should return the state of magnetism option', () => {
        expect(component.getMagnetismeOption()).toBeFalse();
    });
});
