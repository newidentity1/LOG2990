import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { StampProperties } from '@app/classes/tools-properties/stamp-properties';
import { StampService } from '@app/services/tools/stamp/stamp.service';
import { StampComponent } from './stamp.component';

// tslint:disable:no-string-literal // use private variable for testing
describe('StampComponent', () => {
    let component: StampComponent;
    let fixture: ComponentFixture<StampComponent>;
    const sticker = { id: 0, src: '../../../../assets/stamp/1.png' };
    let stampServiceMock: jasmine.SpyObj<StampService>;

    beforeEach(async(() => {
        stampServiceMock = jasmine.createSpyObj('StampService', ['updateImagePreviewURL']);
        TestBed.configureTestingModule({
            declarations: [StampComponent],
            providers: [{ provide: StampService, useValue: stampServiceMock }],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
        stampServiceMock = TestBed.inject(StampService) as jasmine.SpyObj<StampService>;
        stampServiceMock.toolProperties = new StampProperties();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(StampComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('onStickerChange should set the new sticker', () => {
        component.onStickerChange(sticker);
        expect(stampServiceMock.updateImagePreviewURL).toHaveBeenCalled();
        const properties = component['stampService'].toolProperties as StampProperties;
        expect(properties.currentSticker).toEqual(sticker);
    });

    it('onSizeChange should set the new size', () => {
        component.onSizeChange(1);
        expect(stampServiceMock.updateImagePreviewURL).toHaveBeenCalled();
        const properties = component['stampService'].toolProperties as StampProperties;
        expect(properties.size).toEqual(1);
    });

    it('onAngleChange should set the new angle', () => {
        component.onAngleChange(1);
        expect(stampServiceMock.updateImagePreviewURL).toHaveBeenCalled();
        const properties = component['stampService'].toolProperties as StampProperties;
        expect(properties.angle).toEqual(1);
    });
});
