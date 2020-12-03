import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SprayComponent } from './spray.component';

describe('SprayComponent', () => {
  let component: SprayComponent;
  let fixture: ComponentFixture<SprayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SprayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SprayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
