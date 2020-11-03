import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Color } from '@app/classes/color/color';
import { BLACK, MAX_RECENT_COLORS_SIZE, WHITE } from '@app/constants/constants';
import { MouseButton } from '@app/enums/mouse-button.enum';
import { ColorPickerService } from '@app/services/color-picker/color-picker.service';
import { RecentColorsComponent } from './recent-colors.component';

describe('RecentColorsComponent', () => {
    let component: RecentColorsComponent;
    let fixture: ComponentFixture<RecentColorsComponent>;

    let colorPickerServiceSpy: jasmine.SpyObj<ColorPickerService>;
    let mouseEvent: MouseEvent;

    beforeEach(async(() => {
        colorPickerServiceSpy = jasmine.createSpyObj('ColorPickerService', ['applyRecentColor']);

        TestBed.configureTestingModule({
            declarations: [RecentColorsComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
        colorPickerServiceSpy = TestBed.inject(ColorPickerService) as jasmine.SpyObj<ColorPickerService>;
        colorPickerServiceSpy.recentColors = [];
        for (let index = 0; index < MAX_RECENT_COLORS_SIZE; index++) {
            colorPickerServiceSpy.recentColors.push(new Color(BLACK));
        }

        mouseEvent = {
            offsetX: 25,
            offsetY: 25,
            button: MouseButton.Left,
            // tslint:disable-next-line:no-empty / reason: mock preventDefault of MouseEvent
            preventDefault: () => {},
        } as MouseEvent;
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(RecentColorsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it(' getRecentColors should return recentColors from colorPickerService', () => {
        const returnedRecentColors = component.getRecentColors();
        expect(returnedRecentColors).toBeTruthy();
        expect(returnedRecentColors).toEqual(colorPickerServiceSpy.recentColors);
    });

    it(' selectAsPrimaryColor should return applyRecentColor of colorPickerService', () => {
        const expectedColor = new Color(WHITE);
        // tslint:disable-next-line:no-any / reason: jasmine spy
        const applyRecentColorSpy = spyOn<any>(colorPickerServiceSpy, 'applyRecentColor').and.callFake(() => {
            return;
        });
        component.selectAsPrimaryColor(expectedColor);
        expect(applyRecentColorSpy).toHaveBeenCalledWith(expectedColor, false);
    });

    it(' selectAsSecondaryColor should call applyRecentColor of colorPickerService', () => {
        const expectedColor = new Color(WHITE);
        // tslint:disable-next-line:no-any / reason: jasmine spy
        const applyRecentColorSpy = spyOn<any>(colorPickerServiceSpy, 'applyRecentColor').and.callFake(() => {
            return;
        });
        component.selectAsSecondaryColor(mouseEvent, expectedColor);
        expect(applyRecentColorSpy).toHaveBeenCalledWith(expectedColor, true);
    });
});
