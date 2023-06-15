import { Direccion } from 'src/app/models/Direccion';
import { DireccionService } from './../../services/direccion/direccion.service';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Usuario } from 'src/app/models/Usuario';

@Component({
  selector: 'app-modal-add-address',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './modal-add-address.component.html',
  styleUrls: ['./modal-add-address.component.scss']
})
export class ModalAddAddressComponent {
  @Input('modal') modal: any;
  @Input('user') user: Usuario = {} as Usuario;
  @Output() selectedAddress: EventEmitter<Direccion> = new EventEmitter<Direccion>();

  form = this.formBuilder.group({
    name: ['', [
      Validators.required,
      Validators.maxLength(45)
    ]],
    city: ['', [
      Validators.required,
      Validators.maxLength(45)
    ]],
    address: ['', [
      Validators.required,
      Validators.maxLength(255)
    ]],
    cp: ['', [
      Validators.required,
      Validators.pattern(/^\d{5}$/) // Asume un código postal de 5 dígitos
    ]]
  })
  constructor(private formBuilder: FormBuilder, private direccionService: DireccionService) { }

  get name(): FormControl {
    return this.form.get('name') as FormControl;
  }
  get city(): FormControl {
    return this.form.get('city') as FormControl;
  }
  get address(): FormControl {
    return this.form.get('address') as FormControl;
  }
  get cp(): FormControl {
    return this.form.get('cp') as FormControl;
  }

  createAddress() {
    this.direccionService.addAddress(this.name.value, this.city.value, this.address.value, this.cp.value, { id: this.user.id } as Usuario)
    .subscribe((response:Direccion)=>{
      console.log(JSON.stringify(response));
      this.selectedAddress.emit(response)
    })
  }
}
