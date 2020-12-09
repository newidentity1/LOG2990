import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatRadioModule } from '@angular/material/radio';
import { SelectionType } from '@app/enums/selection-type.enum';
import { SelectionService } from '@app/services/tools/selection/selection.service';
import { SelectionComponent } from './selection.component';

describe('SelectionComponent', () => {
    let component: SelectionComponent;
    let fixture: ComponentFixture<SelectionComponent>;
    let selectionServiceMock: jasmine.SpyObj<SelectionService>;

    beforeEach(async(() => {
        selectionServiceMock = jasmine.createSpyObj('SelectionService', [
            'setSelectionType',
            'selectAll',
            'isClipboardEmpty',
            'copySelection',
            'cutSelection',
            'pasteSelection',
            'deleteSelection',
            'isClipboardEmpty',
        ]);

        TestBed.configureTestingModule({
            declarations: [SelectionComponent],
            imports: [MatRadioModule],
            providers: [{ provide: SelectionService, useValue: selectionServiceMock }],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
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

    it('triggerSelectAll should call selectAll of selection service', () => {
        component.triggerSelectAll();
        expect(selectionServiceMock.selectAll).toHaveBeenCalled();
    });

    it('triggerCopy should call pasteSelection of selection service', () => {
        component.triggerCopy();
        expect(selectionServiceMock.copySelection).toHaveBeenCalled();
    });

    it('triggerCut should call cutSelection of selection service', () => {
        component.triggerCut();
        expect(selectionServiceMock.cutSelection).toHaveBeenCalled();
    });

    it('triggerPaste should call pasteSelection of selection service', () => {
        component.triggerPaste();
        expect(selectionServiceMock.pasteSelection).toHaveBeenCalled();
    });

    it('triggerDelete should call deleteSelection of selection service', () => {
        component.triggerDelete();
        expect(selectionServiceMock.deleteSelection).toHaveBeenCalled();
    });

    it('isClipboardEmpty should call isClipboardEmpty of selection service', () => {
        component.isClipboardEmpty();
        expect(selectionServiceMock.isClipboardEmpty).toHaveBeenCalled();
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
