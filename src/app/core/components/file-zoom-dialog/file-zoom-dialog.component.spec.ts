import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileZoomDialogComponent } from './file-zoom-dialog.component';

describe('FileZoomDialogComponent', () => {
  let component: FileZoomDialogComponent;
  let fixture: ComponentFixture<FileZoomDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileZoomDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FileZoomDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
