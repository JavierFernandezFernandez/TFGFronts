import { FormaPagoService } from './../../services/forma-pago/forma-pago.service';
import { FormaPagoUsuarioService } from './../../services/foma-pago-usuario/forma-pago-usuario.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormaPagoUsuario } from 'src/app/models/FormaPagoUsuarios';
import { FormaPago } from 'src/app/models/FormaPago';
import { Usuario } from 'src/app/models/Usuario';

@Component({
  selector: 'app-modal-add-user-payment-method',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule],
  templateUrl: './modal-add-user-payment-method.component.html',
  styleUrls: ['./modal-add-user-payment-method.component.scss']
})
export class ModalAddUserPaymentMethodComponent implements OnInit {
  @Input('modal') modal: any;
  @Input('user') user: Usuario = {} as Usuario;
  @Output() selectedUserPaymentMethod: EventEmitter<FormaPagoUsuario> = new EventEmitter<FormaPagoUsuario>();

  paymentMethods: FormaPago[] = [];
  selectedPaymentMethod: number = 0;

  formCD = this.formBuilder.group({
    cardMumber: ['', [
      Validators.required,
      Validators.pattern("[0-9]{4}[0-9]{4}[0-9]{4}[0-9]{4}")
    ]],
    expirationDate: ['', [
      Validators.required,
      Validators.pattern("(0[1-9]|1[0-2])/[0-9]{2}")
    ]],
    cvv: ['', [
      Validators.required,
      Validators.pattern("[0-9]{3,4}")
    ]],
  })
  formPaypal = this.formBuilder.group({
    email: ['', [
      Validators.required,
      Validators.email
    ]],
  })

  formBizum = this.formBuilder.group({
    phone: ['', [
      Validators.required,
      Validators.pattern("[67][0-9]{8}")
    ]],
  })



  constructor(
    private formBuilder: FormBuilder,
    private formaPagoUsuarioService: FormaPagoUsuarioService,
    private formaPagoService: FormaPagoService
  ) { }
  get cardMumber(): FormControl {
    return this.formCD.get('cardMumber') as FormControl
  }
  get expirationDate(): FormControl {
    return this.formCD.get('expirationDate') as FormControl
  }
  get cvv(): FormControl {
    return this.formCD.get('cvv') as FormControl
  }

  get email(): FormControl {
    return this.formPaypal.get('email') as FormControl
  }

  get phone(): FormControl {
    return this.formBizum.get('phone') as FormControl
  }



  ngOnInit(): void {
    this.selectedPaymentMethod = 0;
    this.initFormaPago();
  }

  selectPaymentMethod(method: HTMLSelectElement) {
    this.selectedPaymentMethod = Number(method.value)
  }

  createUserPaymentForm() {
    if (this.selectedPaymentMethod != 0) {
      let data: string = ''
      if (this.selectedPaymentMethod == 3) {
        data = this.cardMumber.value
      } else if (this.selectedPaymentMethod == 4) {
        data = this.email.value
      } else if (this.selectedPaymentMethod == 5) {
        data = this.phone.value
      }

      this.formaPagoUsuarioService.addUserPaymentMethod(data, { id: this.user.id } as Usuario, { id: this.selectedPaymentMethod } as FormaPago)
        .subscribe((response: FormaPagoUsuario) => {
          console.log(response);
          this.selectedUserPaymentMethod.emit(response)
        })
    }
  }

  private initFormaPago() {
    this.formaPagoService.getPaymentForms()
      .subscribe((response: FormaPago[]) => {
        this.paymentMethods = response
      })
  }
}
