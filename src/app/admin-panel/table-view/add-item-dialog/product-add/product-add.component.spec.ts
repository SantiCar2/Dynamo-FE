import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreductAddComponent } from './product-add.component';

describe('PreductAddComponent', () => {
  let component: PreductAddComponent;
  let fixture: ComponentFixture<PreductAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreductAddComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PreductAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
