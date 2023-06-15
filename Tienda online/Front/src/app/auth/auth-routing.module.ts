import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DataComponent } from './data/data.component';
import { OrdersComponent } from './orders/orders.component';
import { ReviewsComponent } from './reviews/reviews.component';
import { PaymentMethodsComponent } from './payment-methods/payment-methods.component';
import { CustomerServiceComponent } from './customer-service/customer-service.component';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';

// configuration/informacion
// lista de deseos
// pedidos
// opiniones
// formas de pago
// atencion al clientes
const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'data-user',
        component: DataComponent
      },
      {
        path:'orders',
        component: OrdersComponent
      },
      {
        path:'reviews',
        component: ReviewsComponent
      },
      {
        path: 'payment-method',
        component: PaymentMethodsComponent
      },
      {
        path: 'customer-service',
        component: CustomerServiceComponent
      },
      {
        path:'login',
        component: LoginComponent
     },
      {
        path:'registration',
        component: RegistrationComponent
      },
      {
        path: '**',
        redirectTo: 'data-user'
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
