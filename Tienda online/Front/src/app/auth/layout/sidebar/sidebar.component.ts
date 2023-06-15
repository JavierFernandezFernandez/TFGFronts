import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { interval } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  constructor(private router:Router){}

  ngOnInit(): void {
    if(!localStorage.getItem('token')){
      this.router.navigate(['/']);
    }
  }
  cerrarSesion(){
    localStorage.clear();
    const seconds = interval(1000)
    this.router.navigate(['/']);
    location.reload()
  }
}
