import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL, GET_HEADERS } from 'src/app/config';
import { Categoria } from 'src/app/models/Producto';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private url = API_URL + '/categoria/'
  private headers:HttpHeaders = GET_HEADERS()

  constructor(private http: HttpClient) {}

  getCategories(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.url + 'listar',{headers:this.headers})
  }
}
