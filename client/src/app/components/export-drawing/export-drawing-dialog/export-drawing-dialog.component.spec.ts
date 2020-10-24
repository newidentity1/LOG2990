import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportDrawingDialogComponent } from './export-drawing-dialog.component';

describe('ExportDrawingDialogComponent', () => {
  let component: ExportDrawingDialogComponent;
  let fixture: ComponentFixture<ExportDrawingDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExportDrawingDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportDrawingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
