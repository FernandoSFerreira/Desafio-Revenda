import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { ProdutoService } from '../Service/produto-service';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

interface Produto {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
}

@Component({
  selector: 'app-produtos-component',
  imports: [HttpClientModule, FormsModule, CommonModule, CurrencyPipe],
  templateUrl: './produtos-component.html',
  styleUrls: ['./produtos-component.scss']
})
export class ProdutosComponent implements OnInit {
  produtos: Produto[] = [];
  novoProduto: any = {
    nome: '',
    descricao: '',
    preco: 0
  };
  produtoSelecionado: Produto | null = null;

  constructor(
    private produtoService: ProdutoService, 
    private router: Router,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    console.log('Componente inicializado');
    this.carregarProdutos();
  }

  carregarProdutos(): void {
    console.log('Carregando produtos...');
    this.produtos = [];
    this.cdr.detectChanges();
    this.cdr.markForCheck();
    
    this.produtoService.getProdutos().subscribe({
      next: (data: any) => {    
        console.log('Produtos recebidos:', data);
        setTimeout(() => {
          this.produtos = [...data];
          this.cdr.detectChanges();
          this.cdr.markForCheck();
        }, 0);
      },
      error: (err) => {
        console.error('Erro ao carregar produtos:', err);
      }
    });
  }

  adicionarProduto(): void {
    console.log('Adicionando produto:', this.novoProduto);
    this.produtoService.criarProduto(this.novoProduto).subscribe({
      next: (response) => {
        console.log('Produto criado com sucesso:', response);
        this.carregarProdutos();
        this.novoProduto = { nome: '', descricao: '', preco: 0 };
        const modal = document.getElementById('adicionarProdutoModal');
        if (modal) {
          const bootstrapModal = (window as any).bootstrap?.Modal?.getInstance(modal);
          bootstrapModal?.hide();
        }
      },
      error: (err) => {
        console.error('Erro ao criar produto:', err);
      }
    });
  }

  atualizarProduto(): void {
    if (this.produtoSelecionado) {
      console.log('Atualizando produto:', this.produtoSelecionado);
      this.produtoService.atualizarProduto(this.produtoSelecionado).subscribe({
        next: (response) => {
          console.log('Produto atualizado com sucesso:', response);
          this.carregarProdutos();
          this.cancelarEdicao();
        },
        error: (err) => {
          console.error('Erro ao atualizar produto:', err);
        }
      });
    }
  }

  excluirProduto(id: string): void {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      console.log('Excluindo produto:', id);
      this.produtoService.excluirProduto(id).subscribe({
        next: (response) => {
          console.log('Produto excluído com sucesso:', response);
          this.carregarProdutos();
        },
        error: (err) => {
          console.error('Erro ao excluir produto:', err);
        }
      });
    }
  }

  selecionarProdutoParaEdicao(produto: Produto): void {
    console.log('Selecionando produto para edição:', produto);
    this.produtoSelecionado = { ...produto };
    this.cdr.detectChanges();
    setTimeout(() => {
      const modal = document.getElementById('editarProdutoModal');
      if (modal) {
        const bootstrapModal = new (window as any).bootstrap.Modal(modal);
        bootstrapModal.show();
      }
    }, 100);
  }

  cancelarEdicao(): void {
    this.produtoSelecionado = null;
    const modal = document.getElementById('editarProdutoModal');
    if (modal) {
      const bootstrapModal = (window as any).bootstrap?.Modal?.getInstance(modal);
      bootstrapModal?.hide();
    }
  }

  trackByProdutoId(index: number, item: Produto): string { return item.id; }
}