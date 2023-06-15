import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL, GET_HEADERS } from 'src/app/config';
import { Comentario } from 'src/app/models/Comentario';
import { Producto } from 'src/app/models/Producto';
import { Usuario } from 'src/app/models/Usuario';

@Injectable({
  providedIn: 'root'
})
export class ComentarioService {
  private url = API_URL + '/comentario/'
  private headers:HttpHeaders = GET_HEADERS()

  constructor(private http: HttpClient) {}

  getCommentsByProduct(idProduct: number): Observable<Comentario[]> {
    return this.http.get<Comentario[]>(`${this.url}producto/${idProduct}`)
  }
  getCommentsByUserId(idUser: number): Observable<Comentario[]> {
    return this.http.get<Comentario[]>(`${this.url}usuario/${idUser}`)
  }
  createComment(title:string,message:string,stars:number,userId:number,productId:number){
    const user: Usuario = {id:userId} as Usuario;
    const product: Producto = {id:productId} as Producto;
    const comment: Comentario= {
      titulo:title,
      mensaje:message,
      puntuacion:stars,
      producto:product,
      usuario:user
    } as Comentario
    return this.http.post(this.url+'guardar',comment,{headers:this.headers})
  }
}
