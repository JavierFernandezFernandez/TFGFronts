import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL, GET_HEADERS } from 'src/app/config';
import { FormaPago } from 'src/app/models/FormaPago';
import { FormaPagoUsuario } from 'src/app/models/FormaPagoUsuarios';
import { Usuario } from 'src/app/models/Usuario';

@Injectable({
  providedIn: 'root'
})
export class FormaPagoUsuarioService {
  private url = API_URL + '/formaPagoUsuario/'
  private headers: HttpHeaders = GET_HEADERS()

  constructor(private http: HttpClient) {}
  getUserPaymentMethodByUserId(userId: number): Observable<FormaPagoUsuario[]> {
    // console.log(`${this.url}usuario/${userId}`)
    return this.http.get<FormaPagoUsuario[]>(`${this.url}usuario/${userId}`, { headers:this.headers })
  }

  addUserPaymentMethod(datos: string, usuario: Usuario, formaPago: FormaPago): Observable<FormaPagoUsuario> {
    const userPaymentMethod: FormaPagoUsuario = {
      datos: datos,
      usuario: usuario,
      formaPago: formaPago
    } as FormaPagoUsuario;

    return this.http.post<FormaPagoUsuario>(this.url+'guardar',userPaymentMethod,{headers:this.headers});
  }
}
