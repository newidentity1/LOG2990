import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UndoRedoComponent } from './undo-redo.component';

// tslint:disable:no-string-literal
describe('UndoRedoComponent', () => {
    let component: UndoRedoComponent;
    let fixture: ComponentFixture<UndoRedoComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [UndoRedoComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(UndoRedoComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('undo() should call toolbar.undo()', () => {
        const spyUndo = spyOn(component['toolbarService'], 'undo');
        component.undo();
        expect(spyUndo).toHaveBeenCalled();
    });

    it('redo() should call toolbar.redo()', () => {
        const spyRedo = spyOn(component['toolbarService'], 'redo');
        component.redo();
        expect(spyRedo).toHaveBeenCalled();
    });

    it('canRedo() should call toolbar.canRedo()', () => {
        const spyCanRedo = spyOn(component['toolbarService'], 'canRedo');
        component.canRedo();
        expect(spyCanRedo).toHaveBeenCalled();
    });

    it('canUndo() should call toolbar.canUndo()', () => {
        const spyCanRedo = spyOn(component['toolbarService'], 'canUndo');
        component.canUndo();
        expect(spyCanRedo).toHaveBeenCalled();
    });
});
