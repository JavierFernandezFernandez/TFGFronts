import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL, GET_HEADERS } from 'src/app/config';
import { Factura } from 'src/app/models/Factura';
import { LineaPedido } from 'src/app/models/LineaPedido';
import { Pedido } from 'src/app/models/Pedido';
import { Producto } from 'src/app/models/Producto';

@Injectable({
  providedIn: 'root'
})
export class LineaPedidoService {
  private url = API_URL + '/lineaPedido/';
  private headers: HttpHeaders = GET_HEADERS();
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

  getOrederLineByOrederId(pedidoId: number): Observable<LineaPedido[]> {
    return this.http.get<LineaPedido[]>(`${this.url}pedido/${pedidoId}`, { headers: this.headers })
  }
}
