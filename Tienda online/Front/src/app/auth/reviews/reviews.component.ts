import { ComentarioService } from './../../services/comentario/comentario.service';
import { UsuarioService } from './../../services/usuario/usuario.service';
import { Component, OnInit } from '@angular/core';
import { Comentario } from 'src/app/models/Comentario';
import { Usuario } from 'src/app/models/Usuario';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss']
})
export class ReviewsComponent implements OnInit {
  user: Usuario = {} as Usuario;
  comments: Comentario[] = [];

  constructor(
    private usuarioService: UsuarioService,
    private comentarioService: ComentarioService
  ) { }
  ngOnInit(): void {
    if (localStorage.getItem('email')) {
      this.usuarioService.getUserByEmail(localStorage.getItem('email') as string)
        .subscribe((response:Usuario)=>{
          this.user = response
          this.comentarioService.getCommentsByUserId(this.user.id)
            .subscribe((response:Comentario[])=>{
              this.comments = response.reverse();
              console.log(this.comments)
            })
        })
    }

  }



}
