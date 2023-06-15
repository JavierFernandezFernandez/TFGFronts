import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { finalize, retry } from 'rxjs';
import { Factura } from 'src/app/models/Factura.model';
import { LineaFactura } from 'src/app/models/LineaFactura.model';
import { LineaPedido } from 'src/app/models/LineaPedido.model';
import { Pedido } from 'src/app/models/Pedido.model';
import { FacturaService } from 'src/app/services/factura/factura.service';
import { LineaFacturaService } from 'src/app/services/linea-factura/linea-factura.service';
import { LineaPedidoService } from 'src/app/services/linea-pedido/linea-pedido.service';
import { PedidoService } from 'src/app/services/pedido/pedido.service';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { TiendaService } from 'src/app/services/tienda/tienda.service';
import { ID_TIENDA } from 'src/app/config';
import { Tienda } from 'src/app/models/Tienda.model';
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.css']
})
export class PedidosComponent implements OnInit {

  dtOptions: DataTables.Settings = {}
  pedidos: Pedido[] = [];
  lineasPedidos: LineaPedido[] = [];
  idFacturas: number[] = [];
  facturas: Factura[] = [];
  datosCargados = false


  constructor(private facturaService: FacturaService,
    private pedidoService: PedidoService,
    private lineaFacturaService: LineaFacturaService,
    private lineaPedidoService: LineaPedidoService,
    private tiendaService: TiendaService,
    private modalService: NgbModal) { }

  ngOnInit(): void {
    this.getAllPedidosByEmpleados()
  }

  openVerticallyCentered(content: any) {
    this.modalService.open(content, { centered: true });
  }

  private getAllPedidosByEmpleados() {

    this.pedidoService.getAllPedidosByEmpleados()
      .subscribe((response: Pedido[]) => {
        this.pedidos = response;
      })
    setTimeout(() => {
      this.datosCargados = true;
    }, 200);

  }

  getOrdersLineByOrder(id: number) {

    this.idFacturas = []

    this.lineaPedidoService.getOrdersLineByOrder(id)
      .subscribe((response: any) => {

        this.lineasPedidos = response;

        for (let line of this.lineasPedidos) {

          const existeenFactura = this.idFacturas.some(item => item == line.factura.id);
          if (!existeenFactura) {
            this.idFacturas.push(line.factura.id);
          }

        }

        this.facturas = []

        for (let factura of this.idFacturas) {

          this.facturaService.getInvoiceById(factura)
            .subscribe((response: Factura) => {

              this.facturas.push(response)

              this.lineaFacturaService.getInvoiceLineByInvoiceId(response.id)
                .subscribe((response: LineaFactura[]) => {

                  this.facturas[this.facturas.length - 1].lineasFactura = response;

                })

            })
        }
      })

  }

  generarFactura(id: number) {

    let facturaI: Factura = {} as Factura
    let pedido: Pedido = {} as Pedido
    let tienda: Tienda = {} as Tienda
    let lineasFactura: LineaFactura[] = []
    let metodoP: string = ''

    let lineasFacturaPdf: any[] = [
      [
        { text: 'Producto', bold: true },
        { text: 'Nº serie', bold: true },
        { text: 'Precio', bold: true },
        { text: 'Iva', bold: true },
        { text: 'Total', bold: true },
      ]
    ]

    for (let factura of this.facturas) {

      if (factura.id = id) {
        facturaI = factura;
      }

    }


    this.lineaFacturaService.getInvoiceLineByInvoiceId(id)
      .subscribe((respomse: LineaFactura[]) => {

        lineasFactura = respomse

        console.log(lineasFactura)

        let totalPrice: number = 0;

        for (const line of lineasFactura) {
          const priceMoreIva: string = Number(line.precio + (line.precio / line.iva)).toFixed(2)
          lineasFacturaPdf.push(
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

        this.pedidoService.getOrderById(this.lineasPedidos[0].pedido.id)
          .subscribe((response: Pedido) => {
            pedido = response

            metodoP = pedido.formaPago.tipo

            this.tiendaService.getShopById(ID_TIENDA)
              .pipe(finalize(() => {

              }))
              .subscribe((response: Tienda) => {
                tienda = response

                console.log(response)

                console.log(pedido)

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
                              text: tienda.nombre,
                              bold: true,
                            },
                            tienda.ubicacion,
                            tienda.ciudad + ', ' + tienda.pais,
                            'Teléfono: +12 3456789',
                            'Email:  javdez32@gmail.com',
                          ],
                        },
                        {
                          width: 'auto',
                          stack: [
                            {
                              text: facturaI.fecha,
                              bold: true,
                              alignment: 'right',
                            },
                            {
                              text: 'Factura #: ' + facturaI.id,
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
                    {
                      columns: [
                        {
                          width: 'auto',
                          stack: [
                            {
                              text: 'Método de pago: ' + metodoP,
                              bold: true,
                              alignment: 'right',
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
                        body: lineasFacturaPdf
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
                              text: totalPrice.toFixed(2) + '€',
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
                              text: totalPrice.toFixed(2) + '€',
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

          })

      })





  }



}
