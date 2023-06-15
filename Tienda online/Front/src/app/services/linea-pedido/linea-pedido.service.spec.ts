import { TestBed } from '@angular/core/testing';

import { LineaPedidoService } from './linea-pedido.service';

describe('LineasPedidoService', () => {
  let service: LineaPedidoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LineaPedidoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
