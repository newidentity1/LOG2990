import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSlider, MatSliderChange } from '@angular/material/slider';
import * as CONSTANTS from '@app/constants/constants';
import { GridService } from '@app/services/tools/grid/grid.service';
import { GridComponent } from './grid.component';

// tslint:disable: no-string-literal // use private variable
describe('GridComponent', () => {
    let component: GridComponent;
    let fixture: ComponentFixture<GridComponent>;
    let gridServiceMock: jasmine.SpyObj<GridService>;
    let matSliderEvent: MatSliderChange;
    // tslint:disable-next-line: prefer-const / reason: needed for matSliderSource and matRadioSource as placeholders
    let matSliderSource: MatSlider;

    beforeEach(async(() => {
        gridServiceMock = jasmine.createSpyObj('GridService', ['getGridSize', 'setCanvasOpacity', 'setGridSize', 'draw', 'generateGrid']);
        TestBed.configureTestingModule({
            declarations: [GridComponent],
            providers: [{ provide: GridService, useValue: gridServiceMock }],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
        gridServiceMock = TestBed.inject(GridService) as jasmine.SpyObj<GridService>;
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GridComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('showGrid should generate the grid', () => {
        component.showGrid();
        expect(gridServiceMock.draw).toHaveBeenCalled();
    });

    it('onChangeGridSize should change the size of the grid', () => {
        matSliderEvent = { source: matSliderSource, value: CONSTANTS.GRID_BEGIN_SIZE + CONSTANTS.GRID_MULTIPLE_OPACITY_AND_SIZE };
        component.onChangeGridSize(matSliderEvent);
        expect(gridServiceMock.setGridSize).toHaveBeenCalled();
    });

    it('onChangeGridOpacity should change the opacity of the grid', () => {
        matSliderEvent = { source: matSliderSource, value: CONSTANTS.GRID_BEGIN_SIZE + CONSTANTS.GRID_MULTIPLE_OPACITY_AND_SIZE };
        component.onChangeGridOpacity(matSliderEvent);
        expect(gridServiceMock.setCanvasOpacity).toHaveBeenCalled();
    });
});
