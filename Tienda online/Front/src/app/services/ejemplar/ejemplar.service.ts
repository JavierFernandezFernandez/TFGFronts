import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL, GET_HEADERS } from 'src/app/config';
import { Ejemplar } from 'src/app/models/Ejemplar';

@Injectable({
  providedIn: 'root'
})
export class EjemplarService {

  private url: string = API_URL + "/ejemplar/";
  private header: HttpHeaders = GET_HEADERS();

  constructor(private http: HttpClient) {}

  getUnitsByProductId(idProducto: number): Observable<Ejemplar[]> {
    return this.http.get<Ejemplar[]>(this.url + "producto/" + idProducto, { headers: this.header})
  }

  updateUnit(idUnit: number, unit: Ejemplar): Observable<Ejemplar>{
    return this.http.patch<Ejemplar>(this.url + idUnit, unit,{headers: this.header})
  }

}
