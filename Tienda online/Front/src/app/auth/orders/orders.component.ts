import { Usuario } from 'src/app/models/Usuario';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import { LineaPedidoService } from '../../services/linea-pedido/linea-pedido.service';
import { PedidoService } from '../../services/pedido/pedido.service';
import { Component, OnInit } from '@angular/core';
import { Pedido } from 'src/app/models/Pedido';
import { LineaPedido } from 'src/app/models/LineaPedido';
import { Observable, finalize, forkJoin, map } from 'rxjs';
import { Producto } from 'src/app/models/Producto';
import { ProductoService } from 'src/app/services/producto/producto.service';
import { Factura } from 'src/app/models/Factura';
import { FacturaService } from 'src/app/services/factura/factura.service';
import { LineaFacturaService } from 'src/app/services/linea-factura/linea-factura.service';
import { LineaFactura } from 'src/app/models/LineaFactura';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  user: Usuario = {} as Usuario;
  orders: Pedido[] = [];
  invoice: Factura[] = [];
  constructor(
    private usuarioService: UsuarioService,
    private pedidoService: PedidoService,
    private lineaPedidoService: LineaPedidoService,
    private productoService: ProductoService,
    private facturaService: FacturaService,
    private lineaFacturaService: LineaFacturaService,

  ) { }
  ngOnInit(): void {
    if (localStorage.getItem('email')) {
      this.usuarioService.getUserByEmail(localStorage.getItem('email') as string)
        .subscribe((response: Usuario) => {
          this.user = response
          this.pedidoService.getOrderByUserId(this.user.id)
            .pipe(finalize(() => {
              let arrObservables: Observable<any>[] = [];
              for (const order of this.orders) {
                const observ = this.lineaPedidoService.getOrederLineByOrederId(order.id);
                arrObservables.push(observ);
              }
              forkJoin(arrObservables)
                .subscribe((responses: LineaPedido[][]) => {
                  for (let index = 0; index < responses.length; index++) {
                    const response: LineaPedido[] = responses[index]
                    const order: Pedido = this.orders[index]

                    order.lines = response
                    for (const line of order.lines) {
                      order.totalPrice = Number(((line.precio + (line.precio / line.iva)) * line.unidades ).toFixed(2))
                    }
                  }
                  this.orders = this.orders.reverse();
                });
            }))
            .subscribe((response: Pedido[]) => {
              this.orders = response
            })
        })
    }
  }
  priceWithIva(product: Producto): number {
    return this.productoService.getPriceWithIva(product)
  }

  generateFactura(order: Pedido) {
    if (order.lines) {
      let invoicesId: number[] = [];
      for (const line of order.lines) {
        const index: number = invoicesId.findIndex(id => id == line.factura.id);
        if (index == -1) {
          invoicesId.push(line.factura.id);
        }
      }
      let invoices: Factura[] = [];
      let observsInvoices: Observable<Factura>[] = [];

      for (let index = 0; index < invoicesId.length; index++) {
        const observ = this.facturaService.getInvoiceById(invoicesId[index]);
        observsInvoices.push(observ);
      }

      forkJoin(observsInvoices)
        .subscribe((responses: Factura[]) => {
          let observsLineInvoice: Observable<LineaFactura[]>[] = [];
          for (let index = 0; index < responses.length; index++) {
            let response: Factura = responses[index];
            invoices.push(response);

            const observ = this.lineaFacturaService.getInvoiceLineByInvoiceId(response.id)
            observsLineInvoice.push(observ)
            forkJoin(observsLineInvoice)
              .subscribe((responsesLine: LineaFactura[][]) => {
                for (const responseLine of responsesLine) {
                  invoices[index].line = responseLine
                }
                // aquí genera el pdf
                let invoiceLienPDF: any[] = [
                  [
                    { text: 'Producto', bold: true },
                    { text: 'Nº serie', bold: true },
                    { text: 'Precio', bold: true },
                    { text: 'Iva', bold: true },
                    { text: 'Total', bold: true },
                  ]
                ]
                let totalPrice: number = 0;
                for (const invoice of invoices) {
                  console.log(invoice)
                  if (invoice.line) {
                    for (const line of invoice.line) {
                      const priceMoreIva: string = Number(line.precio + (line.precio / line.iva)).toFixed(2)
                      invoiceLienPDF.push(
                        [
                          line.producto.nombre,
                          line.serie,
                          line.precio + '€',
                          line.iva + '%',
                          priceMoreIva + '€',
                        ]
                      )
                      totalPrice += Number(priceMoreIva);
                    }

                  }

                }

                const documentDefinition: TDocumentDefinitions = {
                  content: [
                    // Encabezado
                    {
                      text: 'Factura',
                      fontSize: 20,
                      bold: true,
                      alignment: 'center',
                      margin: [0, 0, 0, 20], // [izquierda, arriba, derecha, abajo]
                    },
                    // Información de la empresa
                    {
                      columns: [
                        {
                          width: '*',
                          stack: [
                            {
                              text: 'Nombre de la Empresa',
                              bold: true,
                            },
                            'C/ Extemadura 20',
                            'Bullas, España',
                            'Teléfono: +34 693018044',
                            'Email: javdez32@gmail.com',
                          ],
                        },
                        {
                          width: 'auto',
                          stack: [
                            {
                              text: order.fechaEntrega,
                              bold: true,
                              alignment: 'right',
                            },
                            {
                              text: 'Factura #: ' + invoices[0].id,
                              bold: true,
                              alignment: 'right',
                              margin: [0, 0, 0, 10],
                            },
                            {
                              qr: 'https://www.empresa.com/facturas/001',
                              fit: 60,
                              alignment: 'right',
                              margin: [0, 0, 0, 10],
                            },
                          ],
                        },
                      ],
                    },
                    // Información del cliente
                    {
                      text: 'Datos del cliente:',
                      bold: true,
                      margin: [0, 20, 0, 10],
                    },
                    {
                      columns: [
                        {
                          width: '*',
                          stack: [
                            this.user.nombre,
                            order.direccion.direccion,
                            order.direccion.ciudad + ', España',
                            'Teléfono: ' + this.user.telefono,
                            'Email: ' + this.user.email,
                          ],
                        },
                        {
                          width: 'auto',
                          stack: [
                            {
                              text: 'Método de pago:',
                              bold: true,
                              alignment: 'right',
                            },
                            {
                              text: order.formaPago.tipo,
                              alignment: 'right',
                              margin: [0, 0, 0, 10],
                            },
                          ],
                        },
                      ],
                    },
                    // Detalles de la factura
                    {
                      table: {
                        headerRows: 1,
                        widths: ['*', '*', '*', '*', '*'],
                        body: invoiceLienPDF
                      },
                      layout: 'lightHorizontalLines',
                      margin: [0, 20, 0, 20],
                    },
                    // Resumen de la factura
                    {
                      columns: [
                        {
                          width: 'auto',
                          stack: [
                            {
                              text: 'Subtotal:',
                              bold: true,
                            },
                            {
                              text: 'Descuento:',
                              bold: true,
                              margin: [0, 10, 0, 0],
                            },
                            {
                              text: 'Total:',
                              bold: true,
                              margin: [0, 10, 0, 0],
                            },
                          ],
                        },
                        {
                          width: 'auto',
                          stack: [
                            {
                              text: totalPrice + '€',
                              bold: true,
                              alignment: 'right',
                            },
                            {
                              text: '0€',
                              bold: true,
                              alignment: 'right',
                              margin: [0, 10, 0, 0],
                            },
                            {
                              text: totalPrice + '€',
                              bold: true,
                              alignment: 'right',
                              margin: [0, 10, 0, 0],
                            },
                          ],
                        },
                      ],
                      margin: [0, 20, 0, 20],
                    },
                    // Pie de página
                    {
                      text: 'Gracias por su compra.',
                      alignment: 'center',
                    },
                  ]
                };

                pdfMake.createPdf(documentDefinition).open();
              })
          }
        })
    }
  }
}
