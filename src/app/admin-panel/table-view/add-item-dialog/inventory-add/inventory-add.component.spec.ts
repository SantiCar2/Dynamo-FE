import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryAddComponent } from './inventory-add.component';

describe('InventoryAddComponent', () => {
  let component: InventoryAddComponent;
  let fixture: ComponentFixture<InventoryAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoryAddComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InventoryAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
