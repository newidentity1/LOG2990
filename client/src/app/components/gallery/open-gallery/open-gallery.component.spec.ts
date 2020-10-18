import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenGalleryComponent } from './open-gallery.component';

describe('OpenGalleryComponent', () => {
  let component: OpenGalleryComponent;
  let fixture: ComponentFixture<OpenGalleryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpenGalleryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenGalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
