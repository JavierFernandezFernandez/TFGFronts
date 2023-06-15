import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL, GET_HEADERS } from 'src/app/config';
import { FormaPago } from 'src/app/models/FormaPago';

@Injectable({
  providedIn: 'root'
})
export class FormaPagoService {
  private url = API_URL + '/formaPago/'
  private headers: HttpHeaders = GET_HEADERS()

  constructor(private http: HttpClient) {}

  getPaymentForms(): Observable<FormaPago[]> {
    return this.http.get<FormaPago[]>(`${this.url}listar`,{headers:this.headers});
  }
}
