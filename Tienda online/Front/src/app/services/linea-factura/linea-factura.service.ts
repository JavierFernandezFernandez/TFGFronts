import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL, GET_HEADERS } from 'src/app/config';
import { Direccion } from 'src/app/models/Direccion';
import { Factura } from 'src/app/models/Factura';
import { LineaFactura } from 'src/app/models/LineaFactura';
import { Producto } from 'src/app/models/Producto';
import { Usuario } from 'src/app/models/Usuario';

@Injectable({
  providedIn: 'root'
})
export class LineaFacturaService {
  private url = API_URL + '/lineaFactura/';
  private headers: HttpHeaders = GET_HEADERS();
  constructor(private http: HttpClient) { }

  addInvoiceLine(
    price: number,
    iva: number,
    serial: string,
    product: Producto,
    invoice: Factura
  ): Observable<any> {
    const invoiceLine: LineaFactura = {
      precio: price,
      iva: iva,
      serie: serial,
      producto: product,
      factura: invoice
    } as LineaFactura;
    return this.http.post<LineaFactura>(this.url + 'guardar', invoiceLine, { headers: this.headers })
  }

  getInvoiceLineByInvoiceId(invoiceId: number): Observable<LineaFactura[]> {
    return this.http.get<LineaFactura[]>(`${this.url}factura/${invoiceId}`, { headers: this.headers })
  }
}
