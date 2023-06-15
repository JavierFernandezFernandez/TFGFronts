import {
  Component,
  ElementRef,
  NgModuleRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import * as bootstrap from 'bootstrap';
import { BRANDS } from 'src/app/config';

@Component({
  selector: 'app-carrousel-marcas',
  templateUrl: './carrousel-marcas.component.html',
  styleUrls: ['./carrousel-marcas.component.scss'],
})
export class CarrouselMarcasComponent implements OnInit {
  @ViewChild('marcasCarrousel', { static: true })
  viewMarcasCarrousel?: ElementRef;
  @ViewChild('buttonNextMarcas', { static: true })
  buttonNextMarcas?: HTMLButtonElement;
  @ViewChild('buttonNextMarcas', { static: true })
  buttonPrevMarcas?: HTMLButtonElement;
  marcasCarrousel?: any;
  marcas?: HTMLCollection;

  brandsNames: string[] = BRANDS;

  constructor() {}

  ngOnInit(): void {
    this.marcasCarrousel = this.inicializarMarcasCarrousel();
    //console.log(JSON.stringify(this.marcasCarrousel));
    this.marcas = this.marcasCarrousel._element.children[0].children;
    // console.log(this.marcas);
    // console.log(this.marcasCarrousel);
  }

  prev3(): void {
    if (this.marcas && this.buttonPrevMarcas) {
      const boton = this.buttonPrevMarcas;
      // boton.disabled = true;
      const nuevoNodo = this.marcas.item(this.marcas.length - 1) as HTMLElement;
      const primerNodo = this.marcas.item(0) as HTMLElement;
      //this.marcasCarrousel?.prev();
      setTimeout(() => {
        if (this.marcas) {
          this.marcas?.item(this.marcas.length)?.remove();
          this.marcasCarrousel._element.children[0].insertBefore(
            nuevoNodo,
            primerNodo
          );
          console.log(this.marcas);
        }
      }, 600);
      setTimeout(() => {
        nuevoNodo.className += ' active';
        // boton.disabled = false;
        console.log(this.marcas);
      }, 650);
    }
  }

  next3(): void {
    if (this.marcas && this.buttonNextMarcas) {
      const boton = this.buttonNextMarcas;
      // boton.disabled = true;
      const nuevoNodo = this.marcas.item(0) as HTMLElement;

      //this.marcasCarrousel.next();
      setTimeout(() => {
        if (this.marcas) {
          this.marcasCarrousel._element.children[0].appendChild(nuevoNodo);
        }
      }, 600);
      setTimeout(() => {
        nuevoNodo.className += ' active';
        // boton.disabled = false;
        console.log(this.marcas);
      }, 650);
    }
  }

  private inicializarMarcasCarrousel(): bootstrap.Carousel {
    return new bootstrap.Carousel(this.viewMarcasCarrousel?.nativeElement, {});
  }

  async delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
