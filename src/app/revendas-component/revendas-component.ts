import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RevendaService } from '../Service/revenda-service';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

interface Revenda {
  id: string;
  cnpj: string;
  razaoSocial: string;
  nomeFantasia: string;
  email: string;
  nomeContatoPrincipal?: string;
}

@Component({
  selector: 'app-revendas-component',
  imports: [HttpClientModule, FormsModule, CommonModule],
  templateUrl: './revendas-component.html',
  styleUrls: ['./revendas-component.scss']
})
export class RevendasComponent implements OnInit {
  revendas: Revenda[] = [];
  novaRevenda: any = {
    cnpj: '',
    razaoSocial: '',
    nomeFantasia: '',
    email: '',
    nomeContatoPrincipal: ''
  };
  revendaSelecionada: Revenda | null = null;

  constructor(
    private revendaService: RevendaService, 
    private router: Router,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    console.log('Componente inicializado');
    this.carregarRevendas();
  }

  carregarRevendas(): void {
    console.log('Carregando revendas...');
    this.revendas = [];
    this.cdr.detectChanges();
    this.cdr.markForCheck();
    this.revendaService.getRevendas().subscribe({
      next: (data: Revenda[]) => {
        console.log('Revendas recebidas:', data);
        setTimeout(() => {
          this.revendas = [...data];
          this.cdr.detectChanges();
          this.cdr.markForCheck();
        }, 0);
      },
      error: (err) => {
        console.error('Erro ao carregar revendas:', err);
      }
    });
  }

  adicionarRevenda(): void {
    console.log('Adicionando revenda:', this.novaRevenda);
    this.revendaService.criarRevenda(this.novaRevenda).subscribe({
      next: (response) => {
        console.log('Revenda criada com sucesso:', response);
        this.carregarRevendas();
        this.novaRevenda = { cnpj: '', razaoSocial: '', nomeFantasia: '', email: '', nomeContatoPrincipal: '' };
        const modal = document.getElementById('adicionarRevendaModal');
        if (modal) {
          const bootstrapModal = (window as any).bootstrap?.Modal?.getInstance(modal);
          bootstrapModal?.hide();
        }
      },
      error: (err) => {
        console.error('Erro ao criar revenda:', err);
      }
    });
  }

  atualizarRevenda(): void {
    if (this.revendaSelecionada) {
      console.log('Atualizando revenda:', this.revendaSelecionada);
      this.revendaService.atualizarRevenda(this.revendaSelecionada).subscribe({
        next: (response) => {
          console.log('Revenda atualizada com sucesso:', response);
          this.carregarRevendas();
          this.cancelarEdicao();
        },
        error: (err) => {
          console.error('Erro ao atualizar revenda:', err);
        }
      });
    }
  }

  excluirRevenda(id: string): void {
    if (confirm('Tem certeza que deseja excluir esta revenda?')) {
      console.log('Excluindo revenda:', id);
      this.revendaService.excluirRevenda(id).subscribe({
        next: (response) => {
          console.log('Revenda excluída com sucesso:', response);
          this.carregarRevendas();
        },
        error: (err) => {
          console.error('Erro ao excluir revenda:', err);
        }
      });
    }
  }

  selecionarRevendaParaEdicao(revenda: Revenda): void {
    console.log('Selecionando revenda para edição:', revenda);
    this.revendaSelecionada = { ...revenda };
    this.cdr.detectChanges();
    setTimeout(() => {
      const modal = document.getElementById('editarRevendaModal');
      if (modal) {
        const bootstrapModal = new (window as any).bootstrap.Modal(modal);
        bootstrapModal.show();
      }
    }, 100);
  }

  cancelarEdicao(): void {
    this.revendaSelecionada = null;
    const modal = document.getElementById('editarRevendaModal');
    if (modal) {
      const bootstrapModal = (window as any).bootstrap?.Modal?.getInstance(modal);
      bootstrapModal?.hide();
    }
  }

  trackByRevendaId(index: number, item: Revenda): string { return item.id; }
}