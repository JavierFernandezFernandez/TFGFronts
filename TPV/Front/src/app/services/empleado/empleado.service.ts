import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from 'src/app/config';
import { Empleado } from 'src/app/models/Empleado.model';
import { ResponseLogin } from 'src/app/models/ResponseLogin';

@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {

  url:string = API_URL+"/empleado";
  private header:HttpHeaders = new HttpHeaders();

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<ResponseLogin> {

    return this.http.post<ResponseLogin>(API_URL+"/login", {
      email: email,
      password: password
    })

  }

  getEmpleadoByEmail(email: string): Observable<Empleado> {

    return this.http.get<any>(this.url+"/email/"+email,{headers:this.header})

  }

}
