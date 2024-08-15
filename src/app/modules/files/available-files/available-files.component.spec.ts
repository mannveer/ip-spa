import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailableFilesComponent } from './available-files.component';

describe('AvailableFilesComponent', () => {
  let component: AvailableFilesComponent;
  let fixture: ComponentFixture<AvailableFilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvailableFilesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AvailableFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
