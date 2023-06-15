
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL, GET_HEADERS } from 'src/app/config';
import { Empleado } from 'src/app/models/Empleado.model';
import { Factura } from 'src/app/models/Factura.model';


@Injectable({
  providedIn: 'root'
})
export class FacturaService {
  url = API_URL + '/factura/';

  private headers:HttpHeaders = GET_HEADERS()

  constructor(private http: HttpClient) { }

  addInvoice(empleado: Empleado, observations?: string): Observable<Factura> {
    const invoice: Factura = {
      empleado: empleado,
      observaciones: observations
    } as Factura;
    return this.http.post<Factura>(this.url + 'guardar', invoice, { headers: this.headers })
  }

  getLastEmpInvoice(empleado: Empleado): Observable<Factura> {
    return this.http.get<Factura>(`${this.url}empleado/end/${empleado.id}`, { headers: this.headers })
  }

  getInvoiceById(id: number): Observable<Factura> {
    return this.http.get<Factura>(`${this.url}${id}`, { headers: this.headers })
  }

}
