import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorrectPurchaseComponent } from './correct-purchase.component';

describe('CorrectPurchaseComponent', () => {
  let component: CorrectPurchaseComponent;
  let fixture: ComponentFixture<CorrectPurchaseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CorrectPurchaseComponent]
    });
    fixture = TestBed.createComponent(CorrectPurchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
