import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Factura } from 'src/app/models/Factura.model';
import { LineaFactura } from 'src/app/models/LineaFactura.model';
import { LineaPedido } from 'src/app/models/LineaPedido.model';
import { Pedido } from 'src/app/models/Pedido.model';
import { FacturaService } from 'src/app/services/factura/factura.service';
import { LineaFacturaService } from 'src/app/services/linea-factura/linea-factura.service';
import { LineaPedidoService } from 'src/app/services/linea-pedido/linea-pedido.service';
import { PedidoService } from 'src/app/services/pedido/pedido.service';
import { TiendaService } from 'src/app/services/tienda/tienda.service';

@Component({
  selector: 'app-pedidos-online',
  templateUrl: './pedidos-online.component.html',
  styleUrls: ['./pedidos-online.component.scss']
})
export class PedidosOnlineComponent implements OnInit{

  dtOptions: DataTables.Settings = {}
  pedidos: Pedido[] = [];
  lineasPedidos: LineaPedido[] = [];
  idFacturas: number[] = [];
  facturas: Factura[] = [];
  datosCargados = false
  estadoEnvio: string = ''

  constructor(private facturaService: FacturaService,
    private pedidoService: PedidoService,
    private lineaFacturaService: LineaFacturaService,
    private lineaPedidoService: LineaPedidoService,
    private tiendaService: TiendaService,
    private modalService: NgbModal) { }

  ngOnInit(): void {
    this.getAllPedidos()
  }

    private getAllPedidos() {

      this.pedidoService.getOrders()
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

  actualizarPedido(id : number) {

    let pedidoAct = {} as Pedido

    pedidoAct.estado =  this.estadoEnvio

    this.pedidoService.updateOrrder(id, pedidoAct).subscribe()

    location.reload()

  }

  openVerticallyCentered(content: any) {
    this.modalService.open(content, { centered: true });
  }

}
