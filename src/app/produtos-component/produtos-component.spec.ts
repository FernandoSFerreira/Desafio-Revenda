import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProdutosComponent } from './produtos-component';
import { ProdutoService } from '../Service/produto-service';
import { HttpClientModule } from '@angular/common/http';

describe('ProdutosComponent', () => {
  let component: ProdutosComponent;
  let fixture: ComponentFixture<ProdutosComponent>;
  let produtoService: ProdutoService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [ProdutoService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProdutosComponent);
    component = fixture.componentInstance;
    produtoService = TestBed.inject(ProdutoService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load produtos on init', () => {
    spyOn(component, 'carregarProdutos');
    component.ngOnInit();
    expect(component.carregarProdutos).toHaveBeenCalled();
  });

  it('should add a new produto', () => {
    spyOn(produtoService, 'criarProduto').and.callThrough();
    component.novoProduto = { nome: 'Produto Teste', descricao: 'Descrição Teste', preco: 100 };
    component.adicionarProduto();
    expect(produtoService.criarProduto).toHaveBeenCalled();
  });

  it('should delete a produto', () => {
    spyOn(produtoService, 'excluirProduto').and.callThrough();
    component.excluirProduto('123');
    expect(produtoService.excluirProduto).toHaveBeenCalledWith('123');
  });
});