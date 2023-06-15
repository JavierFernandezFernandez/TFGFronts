import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAddUserPaymentMethodComponent } from './modal-add-user-payment-method.component';

describe('ModalAddUserPaymentMethodComponent', () => {
  let component: ModalAddUserPaymentMethodComponent;
  let fixture: ComponentFixture<ModalAddUserPaymentMethodComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ModalAddUserPaymentMethodComponent]
    });
    fixture = TestBed.createComponent(ModalAddUserPaymentMethodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
