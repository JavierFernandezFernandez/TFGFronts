import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarrouselMarcasComponent } from './carrousel-marcas.component';

describe('CarrouselMarcasComponent', () => {
  let component: CarrouselMarcasComponent;
  let fixture: ComponentFixture<CarrouselMarcasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CarrouselMarcasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarrouselMarcasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
