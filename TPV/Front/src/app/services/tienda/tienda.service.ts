import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL, GET_HEADERS } from 'src/app/config';
import { Tienda } from 'src/app/models/Tienda.model';


@Injectable({
  providedIn: 'root'
})
export class TiendaService {

  url = API_URL + '/tienda/';

  private headers:HttpHeaders = GET_HEADERS()

  constructor(private http: HttpClient) {

  }

  getShopById(id: number): Observable<Tienda> {
    return this.http.get<Tienda>(this.url + id, { headers: this.headers })
  }
}
