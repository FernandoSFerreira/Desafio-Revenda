import { TestBed } from '@angular/core/testing';
import { RevendasComponent } from './revendas-component';

describe('RevendasComponent', () => {
  let component: RevendasComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RevendasComponent]
    });
    component = TestBed.createComponent(RevendasComponent).componentInstance;
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve carregar revendas corretamente', () => {
    spyOn(component, 'carregarRevendas');
    component.ngOnInit();
    expect(component.carregarRevendas).toHaveBeenCalled();
  });
});