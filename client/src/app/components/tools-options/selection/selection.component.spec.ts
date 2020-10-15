import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectionType } from '@app/enums/selection-type.enum';
import { SelectionService } from '@app/services/tools/selection/selection.service';
import { SelectionComponent } from './selection.component';

describe('SelectionComponent', () => {
    let component: SelectionComponent;
    let fixture: ComponentFixture<SelectionComponent>;
    let selectionServiceMock: jasmine.SpyObj<SelectionService>;

    beforeEach(async(() => {
        selectionServiceMock = jasmine.createSpyObj('SelectionService', ['setSelectionType', 'selectAll']);

        TestBed.configureTestingModule({
            declarations: [SelectionComponent],
            providers: [{ provide: SelectionService, useValue: selectionServiceMock }],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SelectionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('onTypeSelectionChange should call setSelectionType of selection service', () => {
        selectionServiceMock.currentType = SelectionType.RectangleSelection;
        const expectedType = SelectionType.EllipseSelection;
        component.onTypeSelectionChange(expectedType);
        expect(selectionServiceMock.setSelectionType).toHaveBeenCalledWith(expectedType);
    });

    it('onTypeSelectionChange should call selectAll of selection service', () => {
        component.triggerSelectAll();
        expect(selectionServiceMock.selectAll).toHaveBeenCalledWith();
    });

    it('keepOriginalOrder should return 0', () => {
        const result = component.keepOriginalOrder();
        expect(result).toEqual(0);
    });

    it('currentType getter should return currentType of selection service', () => {
        const currentType = component.currentType;
        expect(currentType).toEqual(selectionServiceMock.currentType);
    });
});
