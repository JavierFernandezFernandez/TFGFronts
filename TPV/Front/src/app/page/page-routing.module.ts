import { PageComponent } from './page.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import { InicioComponent } from './inicio/inicio.component';
import { PedidosComponent } from './pedidos/pedidos.component';
import { PedidosOnlineComponent } from './pedidos-online/pedidos-online.component';

const routes:Routes = [
  {
    path: '',
    component:PageComponent,
    children: [
      {
        path: 'inicio',
        component: InicioComponent
      },
      {
        path: 'pedido',
        component: PedidosComponent
      },
      {
        path: 'pedidoOnline',
        component: PedidosOnlineComponent
      }
    ]

  }
]


@NgModule({

  declarations: [],
  imports: [
    RouterModule.forChild(routes),
    CommonModule
  ],
  exports:[RouterModule]

})

export class PageRoutingModule { }
