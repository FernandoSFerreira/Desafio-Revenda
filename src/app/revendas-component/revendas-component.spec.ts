import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RevendasComponent } from './revendas-component';
import { RevendaService } from '../Service/revenda-service';
import { HttpClientModule } from '@angular/common/http';

describe('RevendasComponent', () => {
  let component: RevendasComponent;
  let fixture: ComponentFixture<RevendasComponent>;
  let revendaService: RevendaService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [RevendaService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RevendasComponent);
    component = fixture.componentInstance;
    revendaService = TestBed.inject(RevendaService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load revendas on init', () => {
    spyOn(component, 'carregarRevendas');
    component.ngOnInit();
    expect(component.carregarRevendas).toHaveBeenCalled();
  });

  it('should add a new revenda', () => {
    spyOn(revendaService, 'criarRevenda').and.callThrough();
    component.novaRevenda = { cnpj: '12345678901234', razaoSocial: 'Revenda Teste', nomeFantasia: 'Revenda Fantasia', email: 'teste@revenda.com' };
    component.adicionarRevenda();
    expect(revendaService.criarRevenda).toHaveBeenCalled();
  });

  it('should delete a revenda', () => {
    spyOn(revendaService, 'excluirRevenda').and.callThrough();
    component.excluirRevenda('123');
    expect(revendaService.excluirRevenda).toHaveBeenCalledWith('123');
  });
});