import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RevendaService } from '../Service/revenda-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-revendas-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './revendas-component.html',
  styleUrls: ['./revendas-component.scss']
})
export class RevendasComponent implements OnInit {
  revendas: any[] = [];
  novaRevenda: any = {};
  revendaSelecionada: any = null;

  constructor(private revendaService: RevendaService, private router: Router) {}

  ngOnInit(): void {
    this.carregarRevendas();
  }

  carregarRevendas(): void {
    this.revendaService.getRevendas().subscribe((data) => {
      this.revendas = data;
    });
  }

  adicionarRevenda(): void {
    this.revendaService.criarRevenda(this.novaRevenda).subscribe({
      next: () => {
        this.carregarRevendas();
        this.novaRevenda = {};
      },
      error: (err: any) => console.error('Erro ao criar revenda:', err)
    });
  }

  atualizarRevenda(): void {
    if (this.revendaSelecionada) {
      this.revendaService.atualizarRevenda(this.revendaSelecionada).subscribe({
        next: () => {
          this.carregarRevendas();
          this.cancelarEdicao();
        },
        error: (err: any) => console.error('Erro ao atualizar revenda:', err)
      });
    }
  }

  excluirRevenda(id: string): void {
    if (confirm('Tem certeza que deseja excluir esta revenda?')) {
      this.revendaService.excluirRevenda(id).subscribe({
        next: () => this.carregarRevendas(),
        error: (err: any) => console.error('Erro ao excluir revenda:', err)
      });
    }
  }

  selecionarRevendaParaEdicao(revenda: any): void {
    this.revendaSelecionada = revenda;
  }

  cancelarEdicao(): void {
    this.revendaSelecionada = null;
  }
}