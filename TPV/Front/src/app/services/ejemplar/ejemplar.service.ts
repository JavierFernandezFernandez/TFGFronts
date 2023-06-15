import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL, GET_HEADERS, ID_TIENDA } from 'src/app/config';
import { Ejemplar } from 'src/app/models/Ejemplar.model';

@Injectable({
  providedIn: 'root'
})
export class EjemplarService {

  private url:string = API_URL+"/ejemplar/";
  private header:HttpHeaders = GET_HEADERS()

  constructor(private http: HttpClient) {

  }

  // findByProductoId(idProducto:number):Observable<number> {

  //   return this.http.get<number>(this.url+"/count/"+idProducto,{headers:this.header})

  // }

  countEjemplaresByProductoByTienda(id:number):Observable<number> {
    return this.http.get<number>(`${this.url}count/producto/tienda/${id}/${ID_TIENDA}`,{headers:this.header})
  }

  obtenerEjemplaresByPoducto(id:number):Observable<Ejemplar[]> {
    return this.http.get<Ejemplar[]>(`${this.url}producto/tienda/${id}/${ID_TIENDA}`,{headers:this.header})
  }

  updateUnit(idUnit: number, unit: Ejemplar): Observable<Ejemplar>{
    return this.http.patch<Ejemplar>(this.url + idUnit, unit,{headers: this.header})
  }

}
