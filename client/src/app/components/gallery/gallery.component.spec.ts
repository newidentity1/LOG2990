import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { DeleteService } from '@app/services/firebase/delete/delete.service';
import { GalleryComponent } from './gallery.component';

describe('GalleryComponent', () => {
    let component: GalleryComponent;
    let fixture: ComponentFixture<GalleryComponent>;
    let drawingServiceSpy: jasmine.SpyObj<DrawingService>;
    let deleteServiceSpy: jasmine.SpyObj<DeleteService>;

    beforeEach(async(() => {
        drawingServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);
        TestBed.configureTestingModule({
            declarations: [GalleryComponent],
            imports: [HttpClientTestingModule, MatDialogModule, FormsModule],
            providers: [
                { provide: DrawingService, useValue: drawingServiceSpy },
                { provide: DeleteService, useValue: deleteServiceSpy },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
        drawingServiceSpy = TestBed.inject(DrawingService) as jasmine.SpyObj<DrawingService>;
        deleteServiceSpy = TestBed.inject(DeleteService) as jasmine.SpyObj<DeleteService>;
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GalleryComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
