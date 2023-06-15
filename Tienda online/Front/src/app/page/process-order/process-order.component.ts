
import { DireccionService } from './../../services/direccion/direccion.service';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, catchError, forkJoin, map } from 'rxjs';
import { Direccion } from 'src/app/models/Direccion';
import { Ejemplar } from 'src/app/models/Ejemplar';
import { Factura } from 'src/app/models/Factura';
import { FormaPagoUsuario } from 'src/app/models/FormaPagoUsuarios';
import { LineaFactura } from 'src/app/models/LineaFactura';
import { LineaPedido } from 'src/app/models/LineaPedido';
import { Pedido } from 'src/app/models/Pedido';
import { Producto } from 'src/app/models/Producto';
import { Usuario } from 'src/app/models/Usuario';
import { EjemplarService } from 'src/app/services/ejemplar/ejemplar.service';
import { FacturaService } from 'src/app/services/factura/factura.service';
import { FormaPagoUsuarioService } from 'src/app/services/foma-pago-usuario/forma-pago-usuario.service';
import { LineaFacturaService } from 'src/app/services/linea-factura/linea-factura.service';
import { LineaPedidoService } from 'src/app/services/linea-pedido/linea-pedido.service';
import { PedidoService } from 'src/app/services/pedido/pedido.service';
import { ProductoService } from 'src/app/services/producto/producto.service';


@Component({
  selector: 'app-process-order',
  templateUrl: './process-order.component.html',
  styleUrls: ['./process-order.component.scss']
})
export class ProcessOrderComponent implements OnInit {
  isCollapsedAddress: boolean = true;
  isCollapsedUserPaymentMethod: boolean = true;

  roundedAddressId: number = 0;
  selectedAddress: Direccion | false = false;
  roundedUserPaymentMethodId: number = 0;
  selectedUserPaymentMethod: FormaPagoUsuario | false = false;

  user: Usuario = {} as Usuario;
  cart: Producto[] = [];
  addresses: Direccion[] = [];
  userPaymentMethods: FormaPagoUsuario[] = [];

  units: Ejemplar[] = [];

  constructor(
    private router: Router,
    private usuarioService: UsuarioService,
    private productoService: ProductoService,
    private direccionService: DireccionService,
    private formaPagoUsusarioService: FormaPagoUsuarioService,
    private facturaService: FacturaService,
    private pedidoService: PedidoService,
    private lineaFacturaService: LineaFacturaService,
    private lineaPedidoService: LineaPedidoService,
    private ejemplarService: EjemplarService,
    private ngbModal: NgbModal
  ) { }
  ngOnInit(): void {
    this.isCollapsedAddress = true;
    if (localStorage.getItem("token") && localStorage.getItem("email")) {
      this.usuarioService.getUserByEmail(localStorage.getItem("email") as string)
        .subscribe((response: Usuario) => {
          this.user = response
          this.cart = JSON.parse(response.cesta as string);
          for (const product of this.cart) {
            if (!product.quantity) {
              product.quantity = 1
            }
          }
          this.initUnits()
          this.direccionService.getAddressByUserId(this.user.id)
            .subscribe((response: Direccion[]) => {
              this.addresses = response
            })
          this.formaPagoUsusarioService.getUserPaymentMethodByUserId(this.user.id)
            .subscribe((response: FormaPagoUsuario[]) => {
              this.userPaymentMethods = response
            })


        })
    }
  }
  onSelectedAddressChange(address: Direccion) {
    this.selectedAddress = address;
    this.isCollapsedAddress = true;
  }
  onSelectedUserPaymentMethodChange(userPaymentMethod: FormaPagoUsuario) {
    this.selectedUserPaymentMethod = userPaymentMethod;
    this.isCollapsedAddress = true;
  }

  priceWithIva(product: Producto): number {
    return this.productoService.getPriceWithIva(product)
  }
  totalPrice() {
    let totalPrice: number = 0;
    for (const product of this.cart) {
      if (product?.quantity) {
        totalPrice += this.priceWithIva(product) * product?.quantity;
      } else {
        totalPrice += this.priceWithIva(product)
      }
    }
    return totalPrice.toFixed(2)
  }

  selectAddress() {
    this.selectedAddress = this.addresses.find((address: Direccion) => {
      return address.id == this.roundedAddressId
    }) as Direccion;
  }
  selectUserPaymentMethod() {
    this.selectedUserPaymentMethod = this.userPaymentMethods.find((userPaymentMethod: FormaPagoUsuario) => {
      return userPaymentMethod.id == this.roundedUserPaymentMethodId
    }) as FormaPagoUsuario;
  }

  //ng-bootstrap
  openVerticallyCentered(content: any) {
    this.ngbModal.open(content, { centered: true });
  }

  makePurchase() {
    let order: Pedido = {} as Pedido;
    let invoice: Factura = {} as Factura;

    this.pedidoService.addOrder(
      this.user,
      this.selectedAddress as Direccion,
      (this.selectedUserPaymentMethod as FormaPagoUsuario).formaPago
    )
      .subscribe(() => {
        this.pedidoService.getLastUserOrder(this.user)
          .subscribe((response: Pedido) => {
            order = response
            this.facturaService.addInvoice(this.user, this.selectedAddress as Direccion)
              .subscribe(() => {
                this.facturaService.getLastUserInvoice(this.user)
                  .subscribe((response: Factura) => {
                    invoice = response
                    for (const product of this.cart) {
                      this.lineaPedidoService.addOrderLine(
                        product.precio,
                        product.iva,
                        (product.quantity ? product.quantity : 1),
                        product,
                        order,
                        invoice
                      )
                        .subscribe((response: LineaPedido) => {
                        });
                    }

                    const observables: Observable<any>[] = [];
                    for (const unit of this.units) {
                      const observable = this.lineaFacturaService.addInvoiceLine(
                        unit.producto.precio,
                        unit.producto.iva,
                        unit.serie,
                        unit.producto,
                        invoice
                      );
                      observables.push(
                        observable.pipe(
                          catchError(error => {
                            return error.message;
                          })
                        )
                      );
                    }

                    forkJoin(observables)
                      .subscribe((responses: (LineaFactura | string)[]) => {
                        for (let i = 0; i < responses.length; i++) {
                          const response = responses[i];
                          const unit = this.units[i];

                          if (!(typeof response === 'string')) {
                            const changedParameter: Ejemplar = {
                              estado: 'adquirido'
                            } as Ejemplar;
                            this.ejemplarService.updateUnit(unit.id, changedParameter).subscribe();
                          } else {
                            console.log(response);
                          }
                          console.log(response);
                        }
                        this.clearCart()
                        this.router.navigate(['correct-purchase'])
                      });
                  });
              });
          });
      });
  }

  private clearCart() {
    const cart: string = JSON.stringify([])
    this.usuarioService.updateUser(this.user.id, { cesta: cart } as Usuario)
      .subscribe(() => {
        //console.log('carrito borrado');
      })
  }

  private initUnits() {
    for (const product of this.cart) {
      for (let index = 0; index < (product.quantity ? product.quantity : 1); index++) {
        this.ejemplarService.getUnitsByProductId(product.id)
          .subscribe((response: Ejemplar[]) => {
            for (const unit of response) {
              const existeEnCesta = this.units.some(item => item.id == unit.id);
              if (!existeEnCesta) {
                this.units.push(unit);
                return
              }
            }
          })
      }
    }
  }

}
