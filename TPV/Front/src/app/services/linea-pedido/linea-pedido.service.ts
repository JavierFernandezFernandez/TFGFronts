import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL, GET_HEADERS } from 'src/app/config';
import { Factura } from 'src/app/models/Factura.model';
import { LineaPedido } from 'src/app/models/LineaPedido.model';
import { Pedido } from 'src/app/models/Pedido.model';
import { Producto } from 'src/app/models/Producto.model';

@Injectable({
  providedIn: 'root'
})
export class LineaPedidoService {
  url = API_URL + '/lineaPedido/';
  headers: HttpHeaders = GET_HEADERS();
  constructor(private http: HttpClient) { }

  addOrderLine(
    price: number,
    iva: number,
    units: number,
    product: Producto,
    order: Pedido,
    invoice: Factura
  ): Observable<LineaPedido> {
    const orderLine: LineaPedido = {
      precio: price,
      iva: iva,
      unidades: units,
      producto: product,
      pedido: order,
      factura: invoice
    } as LineaPedido;
    return this.http.post<LineaPedido>(this.url + 'guardar', orderLine, { headers: this.headers })

  }

  getOrdersLineByOrder(id: number): Observable<LineaPedido[]> {
    return this.http.get<LineaPedido[]>(this.url +"pedido/"+ id, { headers: this.headers })
  }
}
