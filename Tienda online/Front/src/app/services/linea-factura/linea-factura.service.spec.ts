import { TestBed } from '@angular/core/testing';

import { LineaFacturaService } from './linea-factura.service';

describe('LineasFacturaService', () => {
  let service: LineaFacturaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LineaFacturaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
