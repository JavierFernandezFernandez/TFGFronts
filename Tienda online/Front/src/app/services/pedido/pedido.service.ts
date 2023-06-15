import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL, GET_HEADERS } from 'src/app/config';
import { Direccion } from 'src/app/models/Direccion';
import { FormaPago } from 'src/app/models/FormaPago';
import { Pedido } from 'src/app/models/Pedido';
import { Usuario } from 'src/app/models/Usuario';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  private url = API_URL + '/pedido/';
  private headers: HttpHeaders;
  constructor(private http: HttpClient) {
    this.headers = GET_HEADERS();
  }

  addOrder(user: Usuario, address: Direccion, paymentForm: FormaPago): Observable<Pedido> {
    const order: Pedido = {
      usuario: user,
      direccion: address,
      formaPago: paymentForm
    } as Pedido;
    return this.http.post<Pedido>(this.url + 'guardar', order, { headers: this.headers })
  }
  getLastUserOrder(user: Usuario): Observable<Pedido> {
    return this.http.get<Pedido>(`${this.url}usuario/end/${user.id}`, { headers: this.headers })
  }
  getOrderByUserId(userId: number): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(`${this.url}usuario/${userId}`, {headers:this.headers})
  }


}
