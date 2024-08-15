import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiletempComponent } from './filetemp.component';

describe('FiletempComponent', () => {
  let component: FiletempComponent;
  let fixture: ComponentFixture<FiletempComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FiletempComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FiletempComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
