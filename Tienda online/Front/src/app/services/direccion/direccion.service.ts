import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GET_HEADERS } from 'src/app/config';
import { API_URL } from 'src/app/config';
import { Direccion } from 'src/app/models/Direccion';
import { Usuario } from 'src/app/models/Usuario';

@Injectable({
  providedIn: 'root'
})
export class DireccionService {
  private url: string = API_URL + '/direccion/';
  private headers: HttpHeaders = GET_HEADERS();

  constructor(private http: HttpClient) { }

  getAddressByUserId(userId: number): Observable<Direccion[]> {
    return this.http.get<Direccion[]>(`${this.url}usuario/${userId}`,{headers:this.headers})
  }

  addAddress(nombre:string, ciudad: string, direccion:string, codigoPostal:string, usuario:Usuario):  Observable<Direccion> {
    const address: Direccion = {
      nombre:nombre,
      ciudad: ciudad,
      direccion: direccion,
      cp:codigoPostal,
      usuario: usuario
    } as Direccion;
    return this.http.post<Direccion>(this.url + 'guardar', address, {headers:this.headers});
  }
}
