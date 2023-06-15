import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { PageRoutingModule } from './page-routing.module';
import { ProductComponent } from './product/product.component';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { CarrouselMarcasComponent } from './carrousel-marcas/carrousel-marcas.component';
import { SearchedProductsComponent } from './searched-products/searched-products.component';
import { FormsModule } from '@angular/forms';
import { ProcessOrderComponent } from './process-order/process-order.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalAddAddressComponent } from '../layout/modal-add-address/modal-add-address.component';
import { ModalAddUserPaymentMethodComponent } from '../layout/modal-add-user-payment-method/modal-add-user-payment-method.component';
import { CorrectPurchaseComponent } from './correct-purchase/correct-purchase.component';



@NgModule({
  declarations: [
    HomeComponent,
    ProductComponent,
    ShoppingCartComponent,
    CarrouselMarcasComponent,
    SearchedProductsComponent,
    ProcessOrderComponent,
    CorrectPurchaseComponent,
  ],
  imports: [
    CommonModule,
    PageRoutingModule,
    FormsModule,
    NgbModule,
    ModalAddAddressComponent,
    ModalAddUserPaymentMethodComponent
  ],
  bootstrap:[
    HomeComponent,
    ProductComponent,
    ShoppingCartComponent,
    CarrouselMarcasComponent,
    SearchedProductsComponent,
    ProcessOrderComponent,
  ]

})
export class PageModule { }
