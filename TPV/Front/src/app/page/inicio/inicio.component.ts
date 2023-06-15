import { Empleado } from './../../models/Empleado.model';
import { EjemplarService } from './../../services/ejemplar/ejemplar.service';
import { Producto } from 'src/app/models/Producto.model';
import { ProductoService } from './../../services/producto/producto.service';
import { Component, OnInit } from '@angular/core';
import { Ejemplar } from 'src/app/models/Ejemplar.model';
import { Observable, catchError, finalize, forkJoin, map } from 'rxjs';
import { FacturaService } from 'src/app/services/factura/factura.service';
import { PedidoService } from 'src/app/services/pedido/pedido.service';
import { LineaFacturaService } from 'src/app/services/linea-factura/linea-factura.service';
import { LineaPedidoService } from 'src/app/services/linea-pedido/linea-pedido.service';
import { Pedido } from 'src/app/models/Pedido.model';
import { Factura } from 'src/app/models/Factura.model';
import { LineaFactura } from 'src/app/models/LineaFactura.model';
import { LineaPedido } from 'src/app/models/LineaPedido.model';
import { EmpleadoService } from 'src/app/services/empleado/empleado.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
})
export class InicioComponent implements OnInit {

  dtOptions: DataTables.Settings = {}
  productos: Producto[] = []
  datosCargados = false
  cesta: Ejemplar[] = []
  productosCesta: Producto[] = [];
  metodoPago: string | false = false

  totalPedido: number = 0

  cliente: number = 0
  vueltas: number = 0

  empleado: Empleado = {} as Empleado

  constructor(private productoService: ProductoService,
              private ejemplarService: EjemplarService,
              private facturaService: FacturaService,
              private pedidoService: PedidoService,
              private lineaFacturaService: LineaFacturaService,
              private lineaPedidoService: LineaPedidoService,
              private empleadoService: EmpleadoService,
              private modalService: NgbModal) { }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers'
    };

    this.listarProductos()

    this.empleadoService.getEmpleadoByEmail(localStorage.getItem('email') as string)
      .subscribe((response: Empleado) => {
        this.empleado = response;
    })

    localStorage.setItem('ganacias', "")
    localStorage.setItem('perdidas', "")
    localStorage.setItem('cajaDelDia', "")

  }

  cierreCaja(): any {

    localStorage.setItem("cajaDelDia","")

    localStorage.setItem('cajaDelDia', String( Number(localStorage.getItem('ganacias')) - Number(localStorage.getItem('perdidas'))))

    return localStorage.getItem('cajaDelDia')

  }

  openVerticallyCentered(content: any) {
    this.modalService.open(content, { centered: true });
  }

  resetearVueltas(){
    this.vueltas = 0
  }

  listarProductos() {
    this.productoService.listar()
      .subscribe((response: Producto[]) => {
        this.productos = response
        for (const producto of this.productos) {
          this.countEjemlar(producto);
        }
        setTimeout(() => {
          this.datosCargados = true;
        }, 200);
      })

  }

  private countEjemlar(producto: Producto) {

    this.ejemplarService.countEjemplaresByProductoByTienda(producto.id)
      .pipe(catchError(err => {
        return err.message
      }))
      .subscribe((response: any) => {
        if (typeof response === 'number') {

          producto.stock = response
        }
      })
  }

  anadieEjemplarCesta(id: any) {

    let ejmeplarAnadido: Ejemplar;

    this.ejemplarService.obtenerEjemplaresByPoducto(id)
      .pipe(finalize(() => {
        this.countEjemplares(ejmeplarAnadido)
      }))
      .subscribe((response: Ejemplar[]) => {

        for (const ejemplar of response) {

          const existeEnCesta = this.cesta.some(item => item.id === ejemplar.id);
          if (!existeEnCesta) {
            this.cesta.push(ejemplar);
            ejmeplarAnadido = ejemplar
            return
          }

        }

      })

  }

  totalCesta(): number {

    this.totalPedido = 0

    for (const ejemplar of this.cesta) {

      this.totalPedido += ejemplar.producto.precio

    }

    return this.totalPedido

  }

  calcularvueltas(): number {

    return this.vueltas = this.cliente - this.totalPedido

  }

  private countEjemplares(ejemplar: Ejemplar) {

    const prdoducto: Producto = this.productos.find((p: Producto) => p.id === ejemplar.producto.id) as Producto;

    const existeEnCesta = this.productosCesta.findIndex(item => item.id === prdoducto.id);
    if (existeEnCesta == -1) {

      prdoducto.cantidad = 1

      this.productosCesta.push(prdoducto);
    } else {

      let productoExist: Producto = this.productosCesta[existeEnCesta]

      productoExist.cantidad ? productoExist.cantidad++ : productoExist.cantidad = 1

    }

  }

  makePurchase() {
    let order: Pedido = {} as Pedido;
    let invoice: Factura = {} as Factura;
    let formaPago: number = 0;

    localStorage.setItem('ganacias', String( Number(localStorage.getItem('ganacias')) + this.totalPedido ))
    localStorage.setItem('perdidas', String( Number(localStorage.getItem('perdidas')) + this.totalPedido ))


    if (this.metodoPago = 'Trajeta') {
      formaPago= 3
    }else{
      formaPago= 7
    }

    this.pedidoService.addOrder(
      this.empleado,
      formaPago

    )
      .subscribe(() => {
        this.pedidoService.getLastEmpOrder(this.empleado)
          .subscribe((response: Pedido) => {

            order = response
            this.facturaService.addInvoice(this.empleado)
              .subscribe(() => {
                this.facturaService.getLastEmpInvoice(this.empleado)
                  .subscribe((response: Factura) => {
                    invoice = response

                    for (const producto of this.productosCesta) {
                      this.lineaPedidoService.addOrderLine(
                        producto.precio,
                        producto.iva,
                        (producto.cantidad ? producto.cantidad : 1),
                        producto,
                        order,
                        invoice
                      )
                        .subscribe((response: LineaPedido) => {
                        });
                    }

                    for (const ejemplar of this.cesta) {
                      this.lineaFacturaService.addInvoiceLine(
                        ejemplar.producto.precio,
                        ejemplar.producto.iva,
                        ejemplar.serie,
                        ejemplar.producto,
                        invoice
                      )
                        .pipe(catchError(error => {
                          return error.message
                        }))
                        .subscribe((response: LineaFactura | string) => {
                          if (!(typeof response === 'string')) {
                            const chagedParameter: Ejemplar = {
                              estado: 'adquirido'
                            } as Ejemplar
                            this.ejemplarService.updateUnit(ejemplar.id, chagedParameter)
                              .subscribe()
                          } else {
                            console.log(response)
                          }
                          console.log(response)
                          location.reload()
                        })
                    }
                  })
              })
          })
      })

  }

}


