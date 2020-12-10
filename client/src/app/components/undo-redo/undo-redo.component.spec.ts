import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ToolbarService } from '@app/services/toolbar/toolbar.service';
import { UndoRedoComponent } from './undo-redo.component';

// tslint:disable:no-string-literal
describe('UndoRedoComponent', () => {
    let component: UndoRedoComponent;
    let fixture: ComponentFixture<UndoRedoComponent>;
    let toolbarServiceSpy: jasmine.SpyObj<ToolbarService>;

    beforeEach(async(() => {
        toolbarServiceSpy = jasmine.createSpyObj('ToolbarService', ['undo', 'redo', 'canUndo', 'canRedo']);
        TestBed.configureTestingModule({
            declarations: [UndoRedoComponent],
            providers: [{ provide: ToolbarService, useValue: toolbarServiceSpy }],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
        toolbarServiceSpy = TestBed.inject(ToolbarService) as jasmine.SpyObj<ToolbarService>;
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
        component.undo();
        expect(toolbarServiceSpy.undo).toHaveBeenCalled();
    });

    it('redo() should call toolbar.redo()', () => {
        component.redo();
        expect(toolbarServiceSpy.redo).toHaveBeenCalled();
    });

    it('canRedo() should call toolbar.canRedo()', () => {
        component.canRedo();
        expect(toolbarServiceSpy.canRedo).toHaveBeenCalled();
    });

    it('canUndo() should call toolbar.canUndo()', () => {
        component.canUndo();
        expect(toolbarServiceSpy.canUndo).toHaveBeenCalled();
    });
});
