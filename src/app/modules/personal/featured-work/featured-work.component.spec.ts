import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeaturedWorkComponent } from './featured-work.component';

describe('FeaturedWorkComponent', () => {
  let component: FeaturedWorkComponent;
  let fixture: ComponentFixture<FeaturedWorkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeaturedWorkComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FeaturedWorkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
