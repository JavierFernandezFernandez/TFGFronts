import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageRoutingModule } from './page-routing.module';
import { InicioComponent } from './inicio/inicio.component';
import { DataTablesModule } from "angular-datatables";
import { AppComponent } from '../app.component';
import { PageComponent } from './page.component';
import { HeaderComponent } from './layouts/header/header.component';
import { FooterComponent } from './layouts/footer/footer.component';
import { FormsModule } from '@angular/forms';
import { PedidosComponent } from './pedidos/pedidos.component';
import { PedidosOnlineComponent } from './pedidos-online/pedidos-online.component';




@NgModule({
  declarations: [
    InicioComponent,
    PageComponent,
    HeaderComponent,
    FooterComponent,
    PedidosComponent,
    PedidosOnlineComponent
  ],
  imports: [
    CommonModule,
    PageRoutingModule,
    DataTablesModule,
    FormsModule
  ]
})
export class PageModule { }
