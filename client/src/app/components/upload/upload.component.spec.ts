import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FireBaseService } from '@app/services/fire/fire-base.service';
import { UploadComponent } from './upload.component';

describe('UploadComponent', () => {
    let component: UploadComponent;
    let fixture: ComponentFixture<UploadComponent>;
    let fireBaseServiceSpy: jasmine.SpyObj<FireBaseService>;

    beforeEach(async(() => {
        fireBaseServiceSpy = jasmine.createSpyObj('FireBaseService', ['uploadCanvas']);
        TestBed.configureTestingModule({
            declarations: [UploadComponent],
            providers: [{ provide: FireBaseService, useValue: fireBaseServiceSpy }],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
        fireBaseServiceSpy = TestBed.inject(FireBaseService) as jasmine.SpyObj<FireBaseService>;
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(UploadComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
