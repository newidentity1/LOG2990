import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EYEDROPPER_PREVIEW_CANVAS_HEIGHT, EYEDROPPER_PREVIEW_CANVAS_WIDTH } from '@app/constants/constants';
import { EyedropperService } from '@app/services/tools/eyedropper/eyedropper.service';
import { EyedropperComponent } from './eyedropper.component';

describe('EyedropperComponent', () => {
    let component: EyedropperComponent;
    let fixture: ComponentFixture<EyedropperComponent>;
    let eyedropperServiceSpy: jasmine.SpyObj<EyedropperService>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [EyedropperComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
        eyedropperServiceSpy = TestBed.inject(EyedropperService) as jasmine.SpyObj<EyedropperService>;
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EyedropperComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it(' isInCanvas should call isInCanvas of eyedropper service', () => {
        const isInCanvasSpy = spyOn(eyedropperServiceSpy, 'isInCanvas').and.callThrough();
        component.isInCanvas();
        expect(isInCanvasSpy).toHaveBeenCalled();
    });

    it(' width getter should return eyedropper preview width constant', () => {
        expect(component.width).toEqual(EYEDROPPER_PREVIEW_CANVAS_WIDTH);
    });

    it(' height getter should return eyedropper preview height constant', () => {
        expect(component.height).toEqual(EYEDROPPER_PREVIEW_CANVAS_HEIGHT);
    });
});
