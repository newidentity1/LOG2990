import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UploadService } from '@app/services/firebase/upload/upload.service';
import { UploadComponent } from './upload.component';

describe('UploadComponent', () => {
    let component: UploadComponent;
    let fixture: ComponentFixture<UploadComponent>;
    let uploadServiceSpy: jasmine.SpyObj<UploadService>;

    beforeEach(async(() => {
        uploadServiceSpy = jasmine.createSpyObj('UploadService', ['uploadCanvas']);
        TestBed.configureTestingModule({
            declarations: [UploadComponent],
            providers: [{ provide: UploadService, useValue: uploadServiceSpy }],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
        uploadServiceSpy = TestBed.inject(UploadService) as jasmine.SpyObj<UploadService>;
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
