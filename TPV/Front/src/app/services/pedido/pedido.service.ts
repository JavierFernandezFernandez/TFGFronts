import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL, GET_HEADERS } from 'src/app/config';
import { Empleado } from 'src/app/models/Empleado.model';
import { Pedido } from 'src/app/models/Pedido.model';


@Injectable({
  providedIn: 'root'
})

export class PedidoService {

  url = API_URL + '/pedido/';

  private headers:HttpHeaders = GET_HEADERS()

  constructor(private http: HttpClient) {

  }

  getOrderById(id: number): Observable<Pedido> {
    return this.http.get<Pedido>(this.url + id, { headers: this.headers })
  }

  getOrders(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(this.url + "listar", { headers: this.headers })
  }

  addOrder(empleado: Empleado, metodoPago : number): Observable<Pedido> {
    const order: Pedido = {
      empleado: empleado,
      formaPago: {
        id: metodoPago
      }

    } as Pedido;
    return this.http.post<Pedido>(this.url + 'guardar', order, { headers: this.headers })
  }

  getLastEmpOrder(empleado: Empleado): Observable<Pedido> {
    return this.http.get<Pedido>(`${this.url}empleado/end/${empleado.id}`, { headers: this.headers })
  }

  getAllPedidosByEmpleados(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(`${this.url}empleado/listar`, { headers: this.headers })
  }

  updateOrrder(id: number, pedido:Pedido) :Observable<any> {
    return this.http.patch<Pedido>(this.url + id,pedido, { headers: this.headers })
  }

}
