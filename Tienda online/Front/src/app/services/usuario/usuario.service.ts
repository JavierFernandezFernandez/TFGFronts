import { HttpClient, HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of, throwError } from 'rxjs';
import { API_URL, GET_HEADERS } from 'src/app/config';
import { Usuario } from 'src/app/models/Usuario';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private url = API_URL + '/usuario/';
  private headers: HttpHeaders = GET_HEADERS()

  constructor(private http: HttpClient) {}

  saveUser(
    name: string,
    phone: string,
    email: string,
    password: string,
    rolId: number
  ): Observable<Usuario> {
    const usuario: Usuario = {
      nombre: name,
      email: email,
      telefono: phone,
      password: password,
      rol: null,
    } as Usuario;
    return this.http.post<Usuario>(this.url + 'guardar', usuario);
  }

  login(email: string, password: string): Observable<any> {
    const creds = { email: email, password: password }

    return this.http.post(
      API_URL + '/login',
      creds,
      { observe: 'response', responseType: 'json' }
    );
  }
  getUserByEmail(email: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.url}email/${localStorage.getItem('email')}`, { headers: this.headers })
  }

  updateUser(id: number, usuario: Usuario): Observable<any> {
    return this.http.patch<Usuario>(this.url + id, usuario, { headers: this.headers });
  }

  getToken(): String | null {
    return localStorage.getItem('token');
  }
}
