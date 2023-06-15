import { TestBed } from '@angular/core/testing';

import { FormaPagoUsuarioService } from './forma-pago-usuario.service';

describe('FormaPagoUsuarioService', () => {
  let service: FormaPagoUsuarioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormaPagoUsuarioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
