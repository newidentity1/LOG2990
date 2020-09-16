import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { ColorToolComponent } from './color-tool.component';

describe('ColorToolComponent', () => {
    let component: ColorToolComponent;
    let fixture: ComponentFixture<ColorToolComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ColorToolComponent],
            providers: [{ provide: MatDialog, useValue: {} }],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ColorToolComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
