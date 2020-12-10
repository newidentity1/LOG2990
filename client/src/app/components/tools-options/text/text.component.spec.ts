import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TextProperties } from '@app/classes/tools-properties/text-properties';
import { TextService } from '@app/services/tools/text/text.service';
import { TextComponent } from './text.component';

describe('TextComponent', () => {
    let component: TextComponent;
    let fixture: ComponentFixture<TextComponent>;
    let textServiceSpy: jasmine.SpyObj<TextService>;

    beforeEach(async(() => {
        textServiceSpy = jasmine.createSpyObj('TextService', ['onClick']);

        TestBed.configureTestingModule({
            declarations: [TextComponent],
            providers: [{ provide: TextService, useValue: textServiceSpy }],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();

        textServiceSpy = TestBed.inject(TextService) as jasmine.SpyObj<TextService>;
        textServiceSpy.toolProperties = new TextProperties();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TextComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
