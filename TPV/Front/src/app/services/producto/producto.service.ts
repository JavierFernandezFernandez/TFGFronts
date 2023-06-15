import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL, GET_HEADERS } from 'src/app/config';
import { Producto } from 'src/app/models/Producto.model';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private url:string = API_URL+"/producto";
  private header:HttpHeaders = GET_HEADERS()

  constructor(private http: HttpClient) {
  }

  listar():Observable<Producto[]> {

    return this.http.get<Producto[]>(this.url+"/listar",{headers:this.header})

  }

}
